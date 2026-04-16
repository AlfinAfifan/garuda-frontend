'use client';

import { ConfirmationModal } from '@/components/modal/ConfirmationModal';
import { DataTable } from '@/components/table/DataTable';
import { useInstitutionAll } from '@/features/institution/hooks/useInstitution';
import { levelOptions, pageSizeOptions } from '@/lib/main/options';
import { Check, TrashBin, Xmark } from '@gravity-ui/icons';
import { Button, Checkbox, Chip, ListBox, SearchField, Select, toast, useOverlayState } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ColumnDef } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useSession } from 'next-auth/react';
import { useCreateGarudaBulk, useDeleteGaruda, useGarudaPaginated, useGarudaSummary, useUpdateApprovalGaruda, useUpdateApprovalGarudaBulk } from '../hooks/useGaruda';
import { type GarudaCreateFormValues, garudaCreateFormSchema } from '../schemas/garuda.schema';
import { GarudaFormModal } from './GarudaFormModal';

export function GarudaContent() {
  const formModalState = useOverlayState();
  const deleteModalState = useOverlayState();
  const { data: session } = useSession();

  const defaultLevelFilter = session?.user?.role === 'institution' ? session.user.level : '';
  const defaultInstitutionFilter = session?.user?.role === 'institution' ? session.user.institution_id : '';

  const [selectedGaruda, setSelectedGaruda] = useState<GarudaPaginatedResponse | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [params, setParams] = useState<GarudaPaginatedParams>({
    page: 1,
    limit: 10,
    search: '',
    level: defaultLevelFilter || '',
    institution_id: defaultInstitutionFilter || '',
  });

  const { data: summaryData } = useGarudaSummary({ level: params.level, is_approved: params.is_approved });
  const { data: paginatedData, isLoading, isError } = useGarudaPaginated(params);
  const { data: institutionAllData } = useInstitutionAll();

  const createGaruda = useCreateGarudaBulk();
  const updateApprovalGaruda = useUpdateApprovalGaruda();
  const updateApprovalGarudaBulk = useUpdateApprovalGarudaBulk();
  const deleteGaruda = useDeleteGaruda();

  const defaultValues: GarudaCreateFormValues = {
    member_ids: [],
  };

  const { control, handleSubmit, reset } = useForm<GarudaCreateFormValues>({
    resolver: zodResolver(garudaCreateFormSchema),
    defaultValues,
  });

  const garudaData = paginatedData?.data ?? [];
  const paginationMeta = paginatedData?.meta;
  const institutions = institutionAllData?.data ?? [];

  useEffect(() => {
    const validIds = new Set(garudaData.map((item) => item.id));

    setSelectedIds((prev) => {
      const next = prev.filter((id) => validIds.has(id));

      if (next.length === prev.length && next.every((id, index) => id === prev[index])) {
        return prev;
      }

      return next;
    });
  }, [garudaData]);

  const isAllSelected = garudaData.length > 0 && garudaData.every((item) => selectedIds.includes(item.id));

  const toggleRowSelection = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) {
        return prev.includes(id) ? prev : [...prev, id];
      }

      return prev.filter((item) => item !== id);
    });
  };

  const toggleSelectAll = (checked: boolean) => {
    if (!checked) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(garudaData.map((item) => item.id));
  };

  const handleOpenCreateModal = () => {
    reset(defaultValues);
    formModalState.open();
  };

  const handleCloseFormModal = () => {
    formModalState.close();
  };

  const handleFormSubmit = async (values: GarudaCreateFormValues) => {
    await toast.promise(createGaruda.mutateAsync(values), {
      loading: 'Menyimpan data garuda...',
      success: 'Data garuda berhasil ditambahkan.',
      error: 'Gagal menambahkan data garuda.',
    });

    handleCloseFormModal();
  };

  const handleBulkUpdateApproval = async (isApproved: boolean) => {
    if (!selectedIds.length) {
      toast.info('Pilih data terlebih dahulu sebelum bulk update.');
      return;
    }

    const pendingIds = garudaData.filter((item) => selectedIds.includes(item.id) && item.is_approved !== isApproved).map((item) => item.id);

    if (!pendingIds.length) {
      toast.info('Tidak ada data yang perlu diperbarui.');
      return;
    }

    await toast.promise(updateApprovalGarudaBulk.mutateAsync({ ids: pendingIds, is_approved: isApproved }), {
      loading: isApproved ? 'Menyetujui seluruh data...' : 'Menolak seluruh data...',
      success: isApproved ? 'Semua data berhasil disetujui.' : 'Semua data berhasil ditolak.',
      error: isApproved ? 'Gagal menyetujui seluruh data.' : 'Gagal menolak seluruh data.',
    });

    setSelectedIds([]);
  };

  const handleUpdateApproval = async (item: GarudaPaginatedResponse, isApproved: boolean) => {
    await toast.promise(updateApprovalGaruda.mutateAsync({ id: item.id, payload: { is_approved: isApproved } }), {
      loading: isApproved ? 'Menyetujui data...' : 'Menolak data...',
      success: isApproved ? 'Data berhasil disetujui.' : 'Data berhasil ditolak.',
      error: isApproved ? 'Gagal menyetujui data.' : 'Gagal menolak data.',
    });
  };

  const handleOpenDeleteModal = (item: GarudaPaginatedResponse) => {
    setSelectedGaruda(item);
    deleteModalState.open();
  };

  const handleDeleteGaruda = async () => {
    if (!selectedGaruda) {
      return;
    }

    await toast.promise(deleteGaruda.mutateAsync(selectedGaruda.id), {
      loading: 'Menghapus data garuda...',
      success: 'Data garuda berhasil dihapus.',
      error: 'Gagal menghapus data garuda.',
    });

    deleteModalState.close();
    setSelectedGaruda(null);
  };

  const columns = useMemo<ColumnDef<GarudaPaginatedResponse>[]>(
    () => [
      {
        id: 'select',
        header: () => (
          <Checkbox slot="selection" aria-label="Pilih semua data garuda" isSelected={isAllSelected} onChange={toggleSelectAll}>
            <Checkbox.Control className="size-4 border">
              <Checkbox.Indicator />
            </Checkbox.Control>
          </Checkbox>
        ),
        cell: ({ row }) => (
          <Checkbox slot="selection" aria-label={`Pilih data garuda ${row.original.member_name}`} isSelected={selectedIds.includes(row.original.id)} onChange={(checked) => toggleRowSelection(row.original.id, checked)}>
            <Checkbox.Control className="size-4 border">
              <Checkbox.Indicator />
            </Checkbox.Control>
          </Checkbox>
        ),
      },
      {
        accessorKey: 'member_name',
        header: 'Nama Member',
      },
      {
        accessorKey: 'level',
        header: 'Level',
      },
      {
        accessorKey: 'total_tku',
        header: 'Total TKU',
      },
      {
        accessorKey: 'is_approved',
        header: 'Status',
        cell: ({ row }) =>
          row.original.is_approved ? (
            <Chip variant="soft" color="success" className="bg-success-100 text-success-700">
              Approved
            </Chip>
          ) : (
            <Chip variant="soft" color="warning" className="bg-warning-100 text-warning-700">
              Pending
            </Chip>
          ),
      },
      {
        accessorKey: 'approved_by_label',
        header: 'Approved By',
        cell: ({ row }) => row.original.approved_by_label || '-',
      },
      {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button isIconOnly size="sm" variant="danger" onPress={() => handleOpenDeleteModal(row.original)}>
              <TrashBin className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    [isAllSelected, selectedIds],
  );

  const summary = summaryData?.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Garuda</h1>
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <>
              <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50" onPress={() => handleBulkUpdateApproval(true)}>
                <Check className="size-4" />
                Approve
              </Button>
            </>
          )}

          {selectedIds.length > 0 && (
            <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50" onPress={() => handleBulkUpdateApproval(false)}>
              <Xmark className="size-4" />
              Reject
            </Button>
          )}
          <Button variant="primary" className="bg-primary-600 hover:bg-primary-600/90" onPress={handleOpenCreateModal}>
            Tambah Garuda
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-4 shadow text-center">
          <p className="text-sm text-slate-500">Total Data</p>
          <p className="text-2xl font-bold text-slate-900">{summary?.total_data ?? 0}</p>
        </div>
        <div className="rounded-3xl bg-white p-4 shadow text-center">
          <p className="text-sm text-slate-500">Total Approved</p>
          <p className="text-2xl font-bold text-success-700">{summary?.total_approved ?? 0}</p>
        </div>
        <div className="rounded-3xl bg-white p-4 shadow text-center">
          <p className="text-sm text-slate-500">Total Pending</p>
          <p className="text-2xl font-bold text-warning-700">{summary?.total_pending ?? 0}</p>
        </div>
      </div>

      <div className="rounded-4xl bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <Select aria-label="Jumlah data per halaman" className="w-20" value={String(params.limit)} onChange={(value) => setParams((prev) => ({ ...prev, limit: Number(value), page: 1 }))}>
              <Select.Trigger className="h-10 border border-gray-300 shadow-none">
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox aria-label="Pilihan jumlah data per halaman">
                  {pageSizeOptions.map((option) => (
                    <ListBox.Item key={option.value.toString()} id={option.value.toString()} textValue={option.label}>
                      {option.label}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            <SearchField name="search" aria-label="Cari garuda" value={params.search ?? ''} onChange={(value) => setParams((prev) => ({ ...prev, search: value, page: 1 }))}>
              <SearchField.Group className="h-10 border border-gray-300 shadow-none">
                <SearchField.SearchIcon />
                <SearchField.Input className="w-64" placeholder="Cari nama member..." />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>

            {['super_admin'].includes(session?.user?.role as string) && (
              <Select aria-label="Filter level" className="w-44" value={params.level ?? ''} onChange={(value) => setParams((prev) => ({ ...prev, level: String(value ?? ''), page: 1 }))}>
                <Select.Trigger className="h-10 border border-gray-300 shadow-none">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox aria-label="Filter level">
                    <ListBox.Item id="" key="all-level" textValue="Semua level">
                      Semua level
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
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

            {['super_admin', 'admin', 'kwarran'].includes(session?.user?.role as string) && (
              <Select aria-label="Filter institution" className="w-64" value={params.institution_id ?? ''} onChange={(value) => setParams((prev) => ({ ...prev, institution_id: String(value ?? ''), page: 1 }))}>
                <Select.Trigger className="h-10 border border-gray-300 shadow-none">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox aria-label="Filter institution">
                    <ListBox.Item id="" key="all-institution" textValue="Semua lembaga">
                      Semua lembaga
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    {institutions.map((option) => (
                      <ListBox.Item key={option.id} id={option.id} textValue={option.name}>
                        {option.name}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            )}

            <Select
              aria-label="Filter approval"
              className="w-48"
              value={typeof params.is_approved === 'boolean' ? String(params.is_approved) : ''}
              onChange={(value) => {
                const nextValue = String(value ?? '');
                setParams((prev) => ({
                  ...prev,
                  is_approved: nextValue === '' ? undefined : nextValue === 'true',
                  page: 1,
                }));
              }}
            >
              <Select.Trigger className="h-10 border border-gray-300 shadow-none">
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox aria-label="Filter approval">
                  <ListBox.Item id="" key="all-approval" textValue="Semua status">
                    Semua status
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                  <ListBox.Item id="true" textValue="Approved">
                    Approved
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                  <ListBox.Item id="false" textValue="Pending">
                    Pending
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>
          </div>
        </div>

        <div className="mt-5">
          <DataTable
            data={garudaData}
            columns={columns}
            ariaLabel="Tabel data garuda"
            pageSize={params.limit}
            currentPage={paginationMeta?.page ?? params.page}
            totalPages={paginationMeta?.totalPages ?? 1}
            onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
            isLoading={isLoading}
            isError={isError}
            emptyMessage="Belum ada data garuda."
            errorMessage="Gagal memuat data garuda. Silakan coba refresh halaman."
            minWidthClassName="min-w-[1120px]"
          />
        </div>
      </div>

      <GarudaFormModal
        isOpen={formModalState.isOpen}
        onOpenChange={(isOpen) => {
          formModalState.setOpen(isOpen);
        }}
        control={control}
        handleSubmit={handleSubmit}
        onSubmit={handleFormSubmit}
        onCancel={handleCloseFormModal}
        title="Tambah Garuda"
        submitText="Simpan Garuda"
      />

      <ConfirmationModal
        isOpen={deleteModalState.isOpen}
        onOpenChange={deleteModalState.setOpen}
        icon={<TrashBin className="size-5" />}
        title="Hapus Garuda"
        description={selectedGaruda ? `Yakin ingin menghapus data garuda untuk ${selectedGaruda.member_name}? Tindakan ini tidak dapat dibatalkan.` : 'Yakin ingin menghapus data ini?'}
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={handleDeleteGaruda}
      />
    </div>
  );
}
