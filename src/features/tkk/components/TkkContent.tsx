'use client';

import { ConfirmationModal } from '@/components/modal/ConfirmationModal';
import { useMemberPaginated } from '@/features/member/hooks/useMember';
import { useTkkTypeAll } from '@/features/tkk-master/hooks/useTkkType';
import { extractUserLevel, extractUserRole } from '@/lib/auth/role-access';
import { levelOptions } from '@/lib/main/options';
import { ArrowRight, TrashBin } from '@gravity-ui/icons';
import { Button, ListBox, Select, Tabs, toast, useOverlayState } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useCreateTkkBulk, useDeleteTkk, useTkkPaginated, useTkkSummary, useUpdateTkkLevel, useUpdateTkkLevelBulk } from '../hooks/useTkk';
import { type TkkFormValues, tkkFormSchema } from '../schemas/tkk.schema';
import { TkkFormModal } from './TkkFormModal';
import { TkkTable } from './TkkTable';

type ScoutLevel = 'siaga' | 'penggalang' | 'penegak';
type TkkLevel = 'siaga' | 'purwa' | 'madya' | 'utama';

const LEVEL_TKK_BY_SCOUT_LEVEL: Record<ScoutLevel, TkkLevel[]> = {
  siaga: ['siaga'],
  penggalang: ['purwa', 'madya', 'utama'],
  penegak: ['purwa', 'madya', 'utama'],
};

const NEXT_TKK_LEVEL_MAP: Partial<Record<TkkLevel, TkkLevel>> = {
  purwa: 'madya',
  madya: 'utama',
};

const PREVIOUS_TKK_LEVEL_MAP: Partial<Record<TkkLevel, TkkLevel>> = {
  madya: 'purwa',
  utama: 'madya',
};

const ROOT_TKK_LEVELS = new Set<TkkLevel>(['siaga', 'purwa']);

function formatTkkLabel(level: TkkLevel): string {
  return level.charAt(0).toUpperCase() + level.slice(1);
}

function getSummaryValue(summary: TkkSummaryResponse | undefined, level: TkkLevel): number {
  const direct = summary?.[level];
  if (typeof direct === 'number') {
    return direct;
  }

  const prefixed = summary?.[`total_${level}`];
  return typeof prefixed === 'number' ? prefixed : 0;
}

export function TkkContent() {
  const formModalState = useOverlayState();
  const deleteModalState = useOverlayState();
  const { data: session } = useSession();

  const currentRole = useMemo(() => extractUserRole((session?.user as Record<string, unknown> | undefined) ?? null), [session?.user]);
  const userLevel = useMemo(() => extractUserLevel((session?.user as Record<string, unknown> | undefined) ?? null), [session?.user]);

  const isSuperAdmin = currentRole === 'super_admin';
  const [selectedLevel, setSelectedLevel] = useState<ScoutLevel>('siaga');

  const effectiveLevel = (isSuperAdmin ? selectedLevel : userLevel) as ScoutLevel | undefined;
  const defaultInstitutionFilter = session?.user?.role === 'institution' ? session?.user?.institution_id : '';

  const visibleLevelTkk = useMemo(() => {
    if (!effectiveLevel || !['siaga', 'penggalang', 'penegak'].includes(effectiveLevel)) {
      return [] as TkkLevel[];
    }

    return LEVEL_TKK_BY_SCOUT_LEVEL[effectiveLevel as ScoutLevel];
  }, [effectiveLevel]);

  const hasTabs = visibleLevelTkk.length > 1;
  const [activeLevelTkk, setActiveLevelTkk] = useState<TkkLevel>('siaga');

  useEffect(() => {
    if (!visibleLevelTkk.length) {
      return;
    }

    setActiveLevelTkk((prev) => (visibleLevelTkk.includes(prev) ? prev : visibleLevelTkk[0]));
  }, [visibleLevelTkk]);

  const currentLevelTkk = hasTabs ? activeLevelTkk : (visibleLevelTkk[0] ?? 'siaga');
  const nextLevelTkk = NEXT_TKK_LEVEL_MAP[currentLevelTkk];

  const [selectedTkk, setSelectedTkk] = useState<TkkPaginatedResponse | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [params, setParams] = useState<TkkPaginatedParams>({
    page: 1,
    limit: 10,
    search: '',
    institution_id: defaultInstitutionFilter || '',
    member_id: '',
    tkk_type_id: '',
    level: effectiveLevel || '',
    level_tkk: '',
  });

  const [memberSearch, setMemberSearch] = useState('');

  const memberQueryLevel = effectiveLevel && ['siaga', 'penggalang', 'penegak'].includes(effectiveLevel) ? effectiveLevel : 'siaga';

  const { data: tkkSummaryData } = useTkkSummary({
    level: memberQueryLevel,
  });

  const { data: tkkPaginatedData, isLoading, isError } = useTkkPaginated(params);
  const tkkData = tkkPaginatedData?.data ?? [];
  const paginationMeta = tkkPaginatedData?.meta;

  useEffect(() => {
    const validIds = new Set(tkkData.map((item) => item.id));

    setSelectedIds((prev) => {
      const next = prev.filter((id) => validIds.has(id));
      if (next.length === prev.length && next.every((id, index) => id === prev[index])) {
        return prev;
      }

      return next;
    });
  }, [tkkData]);

  const useMemberSource = ROOT_TKK_LEVELS.has(currentLevelTkk);
  const sourceTkkLevel = PREVIOUS_TKK_LEVEL_MAP[currentLevelTkk] ?? '';

  const { data: memberData, isLoading: isMemberLoading } = useMemberPaginated({
    page: 1,
    limit: 50,
    search: memberSearch,
    institution_id: defaultInstitutionFilter || '',
    level: memberQueryLevel,
  });

  const { data: sourceTkkData, isLoading: isSourceTkkLoading } = useTkkPaginated({
    page: 1,
    limit: 50,
    search: memberSearch,
    institution_id: defaultInstitutionFilter || '',
    member_id: '',
    tkk_type_id: '',
    level: memberQueryLevel,
    level_tkk: sourceTkkLevel,
  });

  const memberOptions = useMemo(() => {
    if (useMemberSource) {
      return memberData?.data.map((member) => ({ id: member.id, name: member.name })) ?? [];
    }

    const seen = new Set<string>();
    const options: { id: string; name: string }[] = [];

    for (const item of sourceTkkData?.data ?? []) {
      if (!item.member_id || seen.has(item.member_id)) {
        continue;
      }

      seen.add(item.member_id);
      options.push({ id: item.member_id, name: item.member_name });
    }

    return options;
  }, [memberData?.data, sourceTkkData?.data, useMemberSource]);

  const isMemberOptionsLoading = useMemberSource ? isMemberLoading : isSourceTkkLoading;

  const { data: tkkTypeOptions } = useTkkTypeAll({ level: memberQueryLevel });

  const createTkkBulk = useCreateTkkBulk();
  const updateTkkLevel = useUpdateTkkLevel();
  const updateTkkLevelBulk = useUpdateTkkLevelBulk();
  const deleteTkk = useDeleteTkk();

  const { control, handleSubmit, reset } = useForm<TkkFormValues>({
    resolver: zodResolver(tkkFormSchema),
    defaultValues: {
      tkk_type_id: '',
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

    setSelectedIds(tkkData.map((item) => item.id));
  };

  const openCreateModal = () => {
    setMemberSearch('');
    reset({ tkk_type_id: '', member_ids: [] });
    formModalState.open();
  };

  const closeCreateModal = () => {
    formModalState.close();
    setMemberSearch('');
  };

  const handleCreate = async (values: TkkFormValues) => {
    await toast.promise(
      createTkkBulk.mutateAsync({
        member_ids: values.member_ids,
        tkk_type_id: values.tkk_type_id,
        level_tkk: currentLevelTkk,
      }),
      {
        loading: 'Menyimpan data TKK...',
        success: 'Data TKK berhasil ditambahkan.',
        error: 'Gagal menambahkan data TKK.',
      },
    );

    closeCreateModal();
  };

  const handleLevelUpSingle = async (item: TkkPaginatedResponse) => {
    if (!nextLevelTkk) {
      toast.info('Level TKK ini sudah level tertinggi.');
      return;
    }

    await toast.promise(updateTkkLevel.mutateAsync({ id: item.id, payload: { level_tkk: nextLevelTkk } }), {
      loading: 'Memperbarui level TKK...',
      success: 'Level TKK berhasil diperbarui.',
      error: 'Gagal memperbarui level TKK.',
    });
  };

  const handleLevelUpBulk = async () => {
    if (!nextLevelTkk) {
      toast.info('Level TKK ini sudah level tertinggi.');
      return;
    }

    if (!selectedIds.length) {
      toast.info('Pilih data terlebih dahulu.');
      return;
    }

    await toast.promise(
      updateTkkLevelBulk.mutateAsync({
        ids: selectedIds,
        level_tkk: nextLevelTkk,
      }),
      {
        loading: 'Memperbarui level TKK terpilih...',
        success: 'Level TKK terpilih berhasil diperbarui.',
        error: 'Gagal memperbarui level TKK terpilih.',
      },
    );

    setSelectedIds([]);
  };

  const openDeleteModal = (item: TkkPaginatedResponse) => {
    setSelectedTkk(item);
    deleteModalState.open();
  };

  const handleDelete = async () => {
    if (!selectedTkk) {
      return;
    }

    await toast.promise(deleteTkk.mutateAsync(selectedTkk.id), {
      loading: 'Menghapus data TKK...',
      success: 'Data TKK berhasil dihapus.',
      error: 'Gagal menghapus data TKK.',
    });

    deleteModalState.close();
    setSelectedTkk(null);
  };

  const summary = tkkSummaryData?.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">TKK</h1>

        <div className="flex flex-wrap items-center gap-3">
          {isSuperAdmin && (
            <Select aria-label="Pilih level" className="w-48" value={selectedLevel} onChange={(value) => setSelectedLevel(String(value ?? 'siaga') as ScoutLevel)}>
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

          {nextLevelTkk && selectedIds.length > 0 && (
            <Button variant="outline" className="border-primary-500 text-primary-600 hover:bg-primary-50" onPress={handleLevelUpBulk}>
              <ArrowRight className="size-4" />
              Naikkan ke {formatTkkLabel(nextLevelTkk)}
            </Button>
          )}

          <Button variant="primary" className="bg-primary-600 hover:bg-primary-600/90" onPress={openCreateModal}>
            Tambah TKK
          </Button>
        </div>
      </div>

      {visibleLevelTkk.length ? (
        <div className="space-y-5">
          <div className={`grid gap-4 ${visibleLevelTkk.length === 1 ? 'sm:grid-cols-1 lg:grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
            {visibleLevelTkk.map((levelTkk) => (
              <div key={`summary-${levelTkk}`} className={`rounded-3xl bg-white p-4 shadow text-center`}>
                <p className="text-sm text-slate-500">Total {formatTkkLabel(levelTkk)}</p>
                <p className="text-2xl font-bold text-slate-900">{getSummaryValue(summary, levelTkk)}</p>
              </div>
            ))}
          </div>

          {hasTabs ? (
            <Tabs selectedKey={activeLevelTkk} onSelectionChange={(key) => setActiveLevelTkk(String(key) as TkkLevel)} className="w-full">
              <Tabs.ListContainer>
                <Tabs.List aria-label="Tab level TKK" className="*:data-[selected=true]:text-accent-foreground">
                  {visibleLevelTkk.map((levelTkk) => (
                    <Tabs.Tab key={levelTkk} id={levelTkk}>
                      {formatTkkLabel(levelTkk)}
                      <Tabs.Indicator className="bg-primary-500" />
                    </Tabs.Tab>
                  ))}
                </Tabs.List>
              </Tabs.ListContainer>

              {visibleLevelTkk.map((levelTkk) => (
                <Tabs.Panel key={levelTkk} id={levelTkk} className="mt-5">
                  <div className="rounded-4xl bg-white p-6 shadow">
                    <TkkTable
                      data={tkkData}
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
                      canLevelUp={Boolean(nextLevelTkk)}
                    />
                  </div>
                </Tabs.Panel>
              ))}
            </Tabs>
          ) : (
            <div className="rounded-4xl bg-white p-6 shadow">
              <TkkTable
                data={tkkData}
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
                canLevelUp={Boolean(nextLevelTkk)}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">Role Anda tidak memiliki akses ke level TKK mana pun.</div>
      )}

      <TkkFormModal
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
        title={`Tambah TKK ${formatTkkLabel(currentLevelTkk)}`}
        submitText="Simpan"
        memberSearch={memberSearch}
        onMemberSearchChange={setMemberSearch}
        memberOptions={memberOptions}
        tkkTypeOptions={tkkTypeOptions?.data ?? []}
        isMemberOptionsLoading={isMemberOptionsLoading}
      />

      <ConfirmationModal
        isOpen={deleteModalState.isOpen}
        onOpenChange={(isOpen) => {
          deleteModalState.setOpen(isOpen);
          if (!isOpen) {
            setSelectedTkk(null);
          }
        }}
        title="Hapus Data TKK"
        description={selectedTkk ? `Apakah Anda yakin ingin menghapus data TKK ${selectedTkk.member_name}?` : 'Apakah Anda yakin ingin menghapus data ini?'}
        confirmText="Hapus"
        icon={<TrashBin className="size-6" />}
        onConfirm={handleDelete}
      />
    </div>
  );
}
