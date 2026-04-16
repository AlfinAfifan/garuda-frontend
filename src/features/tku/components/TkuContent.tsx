'use client';

import { ConfirmationModal } from '@/components/modal/ConfirmationModal';
import { useMemberPaginated } from '@/features/member/hooks/useMember';
import { extractUserLevel, extractUserRole } from '@/lib/auth/role-access';
import { levelOptions } from '@/lib/main/options';
import { ArrowRight, TrashBin } from '@gravity-ui/icons';
import { Button, ListBox, Select, Tabs, toast, useOverlayState } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useCreateTkuBulk, useDeleteTku, useTkuPaginated, useTkuSummary, useUpdateTkuLevel, useUpdateTkuLevelBulk } from '../hooks/useTku';
import { type TkuFormValues, tkuFormSchema } from '../schemas/tku.schema';
import { TkuFormModal } from './TkuFormModal';
import { TkuTable } from './TkuTable';

type TkuTabConfig = {
  key: string;
  label: string;
  level: 'siaga' | 'penggalang' | 'penegak';
  nextLevel: string | null;
};

const TKU_TABS: TkuTabConfig[] = [
  { key: 'mula', label: 'Mula', level: 'siaga', nextLevel: 'bantu' },
  { key: 'bantu', label: 'Bantu', level: 'siaga', nextLevel: 'tata' },
  { key: 'tata', label: 'Tata', level: 'siaga', nextLevel: null },
  { key: 'ramu', label: 'Ramu', level: 'penggalang', nextLevel: 'rakit' },
  { key: 'rakit', label: 'Rakit', level: 'penggalang', nextLevel: 'terap' },
  { key: 'terap', label: 'Terap', level: 'penggalang', nextLevel: null },
  { key: 'bantara', label: 'Bantara', level: 'penegak', nextLevel: 'laksana' },
  { key: 'laksana', label: 'Laksana', level: 'penegak', nextLevel: null },
];

const LEVEL_GROUPS: Record<'siaga' | 'penggalang' | 'penegak', string[]> = {
  siaga: ['mula', 'bantu', 'tata'],
  penggalang: ['ramu', 'rakit', 'terap'],
  penegak: ['bantara', 'laksana'],
};

const ROOT_TKU_LEVELS = new Set(['mula', 'ramu', 'bantara']);

const PREVIOUS_TKU_LEVEL_MAP: Partial<Record<string, string>> = {
  bantu: 'mula',
  tata: 'bantu',
  rakit: 'ramu',
  terap: 'rakit',
  laksana: 'bantara',
};

export function TkuContent() {
  const formModalState = useOverlayState();
  const deleteModalState = useOverlayState();
  const { data: session } = useSession();

  const currentRole = useMemo(() => extractUserRole((session?.user as Record<string, unknown> | undefined) ?? null), [session?.user]);
  const userLevel = useMemo(() => extractUserLevel((session?.user as Record<string, unknown> | undefined) ?? null), [session?.user]);
  const isSuperAdmin = currentRole === 'super_admin';
  const [selectedLevel, setSelectedLevel] = useState<'siaga' | 'penggalang' | 'penegak'>('siaga');

  const effectiveLevel = isSuperAdmin ? selectedLevel : userLevel;
  const defaultInstitutionFilter = session?.user?.role === 'institution' ? session?.user?.institution_id : '';

  const visibleTabKeys = useMemo(() => {
    if (!effectiveLevel || !['siaga', 'penggalang', 'penegak'].includes(effectiveLevel)) {
      return [];
    }

    return LEVEL_GROUPS[effectiveLevel as 'siaga' | 'penggalang' | 'penegak'];
  }, [effectiveLevel]);

  const [activeTab, setActiveTab] = useState<string>('');
  const [selectedTku, setSelectedTku] = useState<TkuPaginatedResponse | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const activeTabConfig = useMemo(() => TKU_TABS.find((tab) => tab.key === activeTab) ?? null, [activeTab]);

  const [params, setParams] = useState<TkuPaginatedParams>({
    page: 1,
    limit: 10,
    search: '',
    institution_id: defaultInstitutionFilter || '',
    member_id: '',
    level: '',
    level_tku: '',
  });

  const [memberSearch, setMemberSearch] = useState('');

  useEffect(() => {
    if (!visibleTabKeys.length) {
      return;
    }

    setActiveTab((prev) => (prev && visibleTabKeys.includes(prev) ? prev : visibleTabKeys[0]));
  }, [visibleTabKeys]);

  useEffect(() => {
    if (!activeTabConfig) {
      return;
    }

    setParams((prev) => {
      const nextLevel = activeTabConfig.level;
      const nextLevelTku = activeTabConfig.key;

      if (prev.level === nextLevel && prev.level_tku === nextLevelTku) {
        return prev;
      }

      return {
        ...prev,
        page: 1,
        level: nextLevel,
        level_tku: nextLevelTku,
      };
    });
  }, [activeTabConfig]);

  const memberQueryLevel = activeTabConfig?.level ?? (userLevel && ['siaga', 'penggalang', 'penegak'].includes(userLevel) ? userLevel : 'siaga');

  const { data: tkuPaginatedData, isLoading, isError } = useTkuPaginated(params);
  const { data: tkuSummaryData } = useTkuSummary({
    level: memberQueryLevel,
  });
  const tkuData = tkuPaginatedData?.data ?? [];
  const paginationMeta = tkuPaginatedData?.meta;

  useEffect(() => {
    const validIds = new Set(tkuData.map((item) => item.id));

    setSelectedIds((prev) => {
      const next = prev.filter((id) => validIds.has(id));

      if (next.length === prev.length && next.every((id, index) => id === prev[index])) {
        return prev;
      }

      return next;
    });
  }, [tkuData]);

  const useMemberSource = ROOT_TKU_LEVELS.has(activeTabConfig?.key ?? '');
  const sourceTkuLevel = PREVIOUS_TKU_LEVEL_MAP[activeTabConfig?.key ?? ''] ?? '';

  const { data: memberData, isLoading: isMemberLoading } = useMemberPaginated({
    page: 1,
    limit: 10,
    search: memberSearch,
    institution_id: defaultInstitutionFilter || '',
    level: memberQueryLevel,
  });

  const { data: sourceTkuData, isLoading: isSourceTkuLoading } = useTkuPaginated({
    page: 1,
    limit: 10,
    search: memberSearch,
    institution_id: defaultInstitutionFilter || '',
    member_id: '',
    level: memberQueryLevel,
    level_tku: sourceTkuLevel,
  });

  const memberOptions = useMemo(() => {
    if (useMemberSource) {
      return memberData?.data.map((member) => ({ id: member.id, name: member.name })) ?? [];
    }

    const seen = new Set<string>();
    const options: { id: string; name: string }[] = [];

    for (const item of sourceTkuData?.data ?? []) {
      if (!item.member_id || seen.has(item.member_id)) {
        continue;
      }

      seen.add(item.member_id);
      options.push({
        id: item.member_id,
        name: item.member_name,
      });
    }

    return options;
  }, [memberData?.data, sourceTkuData?.data, useMemberSource]);

  const isMemberOptionsLoading = useMemberSource ? isMemberLoading : isSourceTkuLoading;

  const createTkuBulk = useCreateTkuBulk();
  const updateTkuLevel = useUpdateTkuLevel();
  const updateTkuLevelBulk = useUpdateTkuLevelBulk();
  const deleteTku = useDeleteTku();

  const { control, handleSubmit, reset } = useForm<TkuFormValues>({
    resolver: zodResolver(tkuFormSchema),
    defaultValues: {
      member_ids: [],
    },
  });

  const handleToggleRowSelection = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) {
        return prev.includes(id) ? prev : [...prev, id];
      }

      return prev.filter((item) => item !== id);
    });
  };

  const handleToggleSelectAll = (checked: boolean) => {
    if (!checked) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(tkuData.map((item) => item.id));
  };

  const openCreateModal = () => {
    setMemberSearch('');
    reset({ member_ids: [] });
    formModalState.open();
  };

  const closeCreateModal = () => {
    formModalState.close();
    setMemberSearch('');
  };

  const handleCreate = async (values: TkuFormValues) => {
    await toast.promise(
      createTkuBulk.mutateAsync({
        member_ids: values.member_ids,
      }),
      {
        loading: 'Menyimpan data TKU...',
        success: 'Data TKU berhasil ditambahkan.',
        error: 'Gagal menambahkan data TKU.',
      },
    );

    closeCreateModal();
  };

  const handleLevelUpSingle = async (item: TkuPaginatedResponse) => {
    if (!activeTabConfig?.nextLevel) {
      toast.info('Level TKU ini sudah level tertinggi.');
      return;
    }

    await toast.promise(updateTkuLevel.mutateAsync({ id: item.id, payload: { level_tku: activeTabConfig.nextLevel } }), {
      loading: 'Memperbarui level TKU...',
      success: 'Level TKU berhasil diperbarui.',
      error: 'Gagal memperbarui level TKU.',
    });
  };

  const handleLevelUpBulk = async () => {
    if (!activeTabConfig?.nextLevel) {
      toast.info('Level TKU ini sudah level tertinggi.');
      return;
    }

    if (!selectedIds.length) {
      toast.info('Pilih data terlebih dahulu.');
      return;
    }

    await toast.promise(
      updateTkuLevelBulk.mutateAsync({
        ids: selectedIds,
        level_tku: activeTabConfig.nextLevel,
      }),
      {
        loading: 'Memperbarui level TKU terpilih...',
        success: 'Level TKU terpilih berhasil diperbarui.',
        error: 'Gagal memperbarui level TKU terpilih.',
      },
    );

    setSelectedIds([]);
  };

  const openDeleteModal = (item: TkuPaginatedResponse) => {
    setSelectedTku(item);
    deleteModalState.open();
  };

  const handleDelete = async () => {
    if (!selectedTku) {
      return;
    }

    await toast.promise(deleteTku.mutateAsync(selectedTku.id), {
      loading: 'Menghapus data TKU...',
      success: 'Data TKU berhasil dihapus.',
      error: 'Gagal menghapus data TKU.',
    });

    deleteModalState.close();
    setSelectedTku(null);
  };

  const visibleTabs = TKU_TABS.filter((tab) => visibleTabKeys.includes(tab.key));
  const nextLabel = activeTabConfig?.nextLevel ? (TKU_TABS.find((tab) => tab.key === activeTabConfig.nextLevel)?.label ?? activeTabConfig.nextLevel) : null;
  const summary = tkuSummaryData?.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">TKU</h1>

        <div className="flex flex-wrap items-center gap-3">
          {isSuperAdmin && (
            <Select aria-label="Pilih level" className="w-48" value={selectedLevel} onChange={(value) => setSelectedLevel(String(value ?? 'siaga') as 'siaga' | 'penggalang' | 'penegak')}>
              <Select.Trigger className="h-10 border border-gray-300 shadow-none">
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox aria-label="Pilihan level">
                  {levelOptions.map((option) => (
                    <ListBox.Item key={option.value} id={option.value} textValue={option.label}>
                      {option.label}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          )}

          {activeTabConfig?.nextLevel && selectedIds.length > 0 && (
            <Button variant="outline" className="border-primary-500 text-primary-600 hover:bg-primary-50" onPress={handleLevelUpBulk}>
              <ArrowRight className="size-4" />
              Naikkan ke {nextLabel}
            </Button>
          )}

          <Button variant="primary" className="bg-primary-600 hover:bg-primary-600/90" onPress={openCreateModal}>
            Tambah TKU
          </Button>
        </div>
      </div>

      {visibleTabs.length ? (
        <div className="space-y-5">
          <div className={`grid gap-4 ${memberQueryLevel === 'penegak' ? 'lg:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'} `}>
            {visibleTabs.map((tab) => (
              <div key={`summary-${tab.key}`} className="rounded-3xl bg-white p-4 shadow text-center">
                <p className="text-sm text-slate-500">Total {tab.label}</p>
                <p className="text-2xl font-bold text-slate-900">{summary?.[`total_${tab.key}`] ?? 0}</p>
              </div>
            ))}
          </div>

          <Tabs selectedKey={activeTab || visibleTabs[0]?.key} onSelectionChange={(key) => setActiveTab(String(key))} className="w-full">
            <Tabs.ListContainer>
              <Tabs.List aria-label="Tab level TKU" className="*:data-[selected=true]:text-accent-foreground">
                {visibleTabs.map((tab) => (
                  <Tabs.Tab key={tab.key} id={tab.key}>
                    {tab.label}
                    <Tabs.Indicator className="bg-primary-500" />
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs.ListContainer>

            {visibleTabs.map((tab) => (
              <Tabs.Panel key={tab.key} id={tab.key} className="mt-5">
                <div className="rounded-4xl bg-white p-6 shadow">
                  <TkuTable
                    data={tkuData}
                    isLoading={isLoading}
                    isError={isError}
                    params={params}
                    currentPage={paginationMeta?.page ?? params.page}
                    totalPages={paginationMeta?.totalPages ?? 1}
                    onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
                    onChangeParams={setParams}
                    selectedIds={selectedIds}
                    onToggleRowSelection={handleToggleRowSelection}
                    onToggleSelectAll={handleToggleSelectAll}
                    onDelete={openDeleteModal}
                    onLevelUp={handleLevelUpSingle}
                    canLevelUp={Boolean(activeTabConfig?.nextLevel)}
                  />
                </div>
              </Tabs.Panel>
            ))}
          </Tabs>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">Role Anda tidak memiliki akses ke level TKU mana pun.</div>
      )}

      <TkuFormModal
        isOpen={formModalState.isOpen}
        onOpenChange={(isOpen) => {
          formModalState.setOpen(isOpen);
          if (!isOpen) {
            setMemberSearch('');
          }
        }}
        control={control}
        handleSubmit={handleSubmit}
        onSubmit={handleCreate}
        onCancel={closeCreateModal}
        title={activeTabConfig ? `Tambah TKU ${activeTabConfig.label}` : 'Tambah TKU'}
        submitText="Simpan"
        memberSearch={memberSearch}
        onMemberSearchChange={setMemberSearch}
        memberOptions={memberOptions}
        isMemberOptionsLoading={isMemberOptionsLoading}
      />

      <ConfirmationModal
        isOpen={deleteModalState.isOpen}
        onOpenChange={(isOpen) => {
          deleteModalState.setOpen(isOpen);
          if (!isOpen) {
            setSelectedTku(null);
          }
        }}
        title="Hapus Data TKU"
        description={selectedTku ? `Apakah Anda yakin ingin menghapus data TKU ${selectedTku.member_name}?` : 'Apakah Anda yakin ingin menghapus data ini?'}
        confirmText="Hapus"
        icon={<TrashBin className="size-6" />}
        onConfirm={handleDelete}
      />
    </div>
  );
}
