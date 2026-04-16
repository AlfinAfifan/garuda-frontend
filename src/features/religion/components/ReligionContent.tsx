'use client';

import { ConfirmationModal } from '@/components/modal/ConfirmationModal';
import { DataTable } from '@/components/table/DataTable';
import { pageSizeOptions } from '@/lib/main/options';
import { PencilToLine, TrashBin } from '@gravity-ui/icons';
import { Button, ListBox, SearchField, Select, toast, useOverlayState } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useCreateReligion, useDeleteReligion, useReligionPaginated, useUpdateReligion } from '../hooks/useReligion';
import { type ReligionFormValues, religionFormSchema } from '../schemas/religion.schema';
import { ReligionFormModal } from './ReligionFormModal';

type ReligionFormMode = 'create' | 'edit';

export function ReligionContent() {
  const formModalState = useOverlayState();
  const deleteModalState = useOverlayState();

  const [formMode, setFormMode] = useState<ReligionFormMode>('create');
  const [selectedReligion, setSelectedReligion] = useState<ReligionPaginatedResponse | null>(null);
  const [params, setParams] = useState<BaseParams>({
    page: 1,
    limit: 10,
    search: '',
  });

  const { data: paginatedData, isLoading, isError } = useReligionPaginated(params);
  const createReligion = useCreateReligion();
  const updateReligion = useUpdateReligion();
  const deleteReligion = useDeleteReligion();

  const defaultValues: ReligionFormValues = {
    name: '',
  };

  const { control, handleSubmit, reset } = useForm<ReligionFormValues>({
    resolver: zodResolver(religionFormSchema),
    defaultValues,
  });

  const handleOpenCreateModal = () => {
    setFormMode('create');
    setSelectedReligion(null);
    reset(defaultValues);
    formModalState.open();
  };

  const handleOpenEditModal = (religion: ReligionPaginatedResponse) => {
    setFormMode('edit');
    setSelectedReligion(religion);
    reset({ name: religion.name });
    formModalState.open();
  };

  const handleCloseFormModal = () => {
    formModalState.close();
    setSelectedReligion(null);
  };

  const handleOpenDeleteModal = (religion: ReligionPaginatedResponse) => {
    setSelectedReligion(religion);
    deleteModalState.open();
  };

  const handleFormSubmit = async (values: ReligionFormValues) => {
    if (formMode === 'create') {
      await toast.promise(createReligion.mutateAsync(values), {
        loading: 'Menyimpan agama...',
        success: 'Agama berhasil ditambahkan.',
        error: 'Gagal menambahkan agama.',
      });

      handleCloseFormModal();
      return;
    }

    if (!selectedReligion) {
      return;
    }

    await toast.promise(updateReligion.mutateAsync({ id: selectedReligion.id, payload: values }), {
      loading: 'Memperbarui agama...',
      success: 'Agama berhasil diperbarui.',
      error: 'Gagal memperbarui agama.',
    });

    handleCloseFormModal();
  };

  const handleDeleteReligion = async () => {
    if (!selectedReligion) {
      return;
    }

    await toast.promise(deleteReligion.mutateAsync(selectedReligion.id), {
      loading: 'Menghapus agama...',
      success: 'Agama berhasil dihapus.',
      error: 'Gagal menghapus agama.',
    });

    deleteModalState.close();
    setSelectedReligion(null);
  };

  const selectedLimit = String(params.limit);

  const religions = paginatedData?.data ?? [];
  const paginationMeta = paginatedData?.meta;

  const columns = useMemo<ColumnDef<ReligionPaginatedResponse>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nama Agama',
      },
      {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button isIconOnly size="sm" variant="secondary" onPress={() => handleOpenEditModal(row.original)}>
              <PencilToLine className="size-4" />
            </Button>
            <Button isIconOnly size="sm" variant="danger" onPress={() => handleOpenDeleteModal(row.original)}>
              <TrashBin className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Religion</h1>
        <Button variant="primary" className="bg-primary-600 hover:bg-primary-600/90" onPress={handleOpenCreateModal}>
          Tambah Religion
        </Button>
      </div>

      <div className="rounded-4xl bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <Select aria-label="Jumlah data per halaman" className="w-20" placeholder="Select one" value={selectedLimit} onChange={(value) => setParams((prev) => ({ ...prev, limit: Number(value), page: 1 }))}>
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

            <SearchField name="search" aria-label="Cari religion" value={params.search ?? ''} onChange={(value) => setParams((prev) => ({ ...prev, search: value, page: 1 }))}>
              <SearchField.Group className="h-10 border border-gray-300 shadow-none">
                <SearchField.SearchIcon />
                <SearchField.Input className="w-64" placeholder="Cari nama agama..." />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>
          </div>
        </div>

        <div className="mt-5">
          <DataTable
            data={religions}
            columns={columns}
            ariaLabel="Tabel data religion"
            pageSize={params.limit}
            currentPage={paginationMeta?.page ?? params.page}
            totalPages={paginationMeta?.totalPages ?? 1}
            onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
            isLoading={isLoading}
            isError={isError}
            emptyMessage="Belum ada data religion."
            errorMessage="Gagal memuat data religion. Silakan coba refresh halaman."
            minWidthClassName="min-w-[680px]"
          />
        </div>
      </div>

      <ReligionFormModal
        isOpen={formModalState.isOpen}
        onOpenChange={(isOpen) => {
          formModalState.setOpen(isOpen);
          if (!isOpen) {
            setSelectedReligion(null);
          }
        }}
        control={control}
        handleSubmit={handleSubmit}
        onSubmit={handleFormSubmit}
        onCancel={handleCloseFormModal}
        title={formMode === 'create' ? 'Tambah Religion' : 'Edit Religion'}
        submitText={formMode === 'create' ? 'Simpan Religion' : 'Simpan Perubahan'}
      />

      <ConfirmationModal
        isOpen={deleteModalState.isOpen}
        onOpenChange={deleteModalState.setOpen}
        icon={<TrashBin className="size-5" />}
        title="Hapus Religion"
        description={selectedReligion ? `Yakin ingin menghapus religion ${selectedReligion.name}? Tindakan ini tidak dapat dibatalkan.` : 'Yakin ingin menghapus data ini?'}
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={handleDeleteReligion}
      />
    </div>
  );
}
