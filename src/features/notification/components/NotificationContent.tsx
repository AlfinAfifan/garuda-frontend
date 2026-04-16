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

import { useCreateNotification, useDeleteNotification, useNotificationPaginated, useUpdateNotification } from '../hooks/useNotification';
import { type NotificationFormValues, notificationFormSchema } from '../schemas/notification.schema';
import { NotificationFormModal } from './NotificationFormModal';

type NotificationFormMode = 'create' | 'edit';

export function NotificationContent() {
  const formModalState = useOverlayState();
  const deleteModalState = useOverlayState();

  const [formMode, setFormMode] = useState<NotificationFormMode>('create');
  const [selectedNotification, setSelectedNotification] = useState<NotificationPaginatedResponse | null>(null);
  const [params, setParams] = useState<NotificationPaginatedParams>({
    page: 1,
    limit: 10,
    search: '',
  });

  const { data: paginatedData, isLoading, isError } = useNotificationPaginated(params);
  const createNotification = useCreateNotification();
  const updateNotification = useUpdateNotification();
  const deleteNotification = useDeleteNotification();

  const defaultValues: NotificationFormValues = {
    title: '',
    message: '',
    all_roles: true,
    roles: [],
  };

  const { control, handleSubmit, reset, setValue } = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues,
  });

  const handleOpenCreateModal = () => {
    setFormMode('create');
    setSelectedNotification(null);
    reset(defaultValues);
    formModalState.open();
  };

  const handleOpenEditModal = (notification: NotificationPaginatedResponse) => {
    setFormMode('edit');
    setSelectedNotification(notification);
    reset({
      title: notification.title,
      message: notification.message,
      all_roles: notification.all_roles ?? false,
      roles: notification.roles ?? [],
    });
    formModalState.open();
  };

  const handleCloseFormModal = () => {
    formModalState.close();
    setSelectedNotification(null);
  };

  const handleOpenDeleteModal = (notification: NotificationPaginatedResponse) => {
    setSelectedNotification(notification);
    deleteModalState.open();
  };

  const handleFormSubmit = async (values: NotificationFormValues) => {
    const payload: NotificationPayload = {
      title: values.title,
      message: values.message,
      all_roles: values.all_roles,
      roles: values.all_roles ? [] : (values.roles ?? []),
    };

    if (formMode === 'create') {
      await toast.promise(createNotification.mutateAsync(payload), {
        loading: 'Menyimpan notification...',
        success: 'Notification berhasil ditambahkan.',
        error: 'Gagal menambahkan notification.',
      });

      handleCloseFormModal();
      return;
    }

    if (!selectedNotification) {
      return;
    }

    await toast.promise(updateNotification.mutateAsync({ id: selectedNotification.id, payload }), {
      loading: 'Memperbarui notification...',
      success: 'Notification berhasil diperbarui.',
      error: 'Gagal memperbarui notification.',
    });

    handleCloseFormModal();
  };

  const handleDeleteNotification = async () => {
    if (!selectedNotification) {
      return;
    }

    await toast.promise(deleteNotification.mutateAsync(selectedNotification.id), {
      loading: 'Menghapus notification...',
      success: 'Notification berhasil dihapus.',
      error: 'Gagal menghapus notification.',
    });

    deleteModalState.close();
    setSelectedNotification(null);
  };

  const selectedLimit = String(params.limit);

  const notifications = paginatedData?.data ?? [];
  const paginationMeta = paginatedData?.meta;

  const columns = useMemo<ColumnDef<NotificationPaginatedResponse>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Judul',
      },
      {
        accessorKey: 'message',
        header: 'Pesan',
        cell: ({ row }) => <span className="line-clamp-2 max-w-90">{row.original.message}</span>,
      },
      {
        id: 'roles',
        header: 'Role Tujuan',
        cell: ({ row }) => {
          if (row.original.all_roles) {
            return 'Semua Role';
          }

          return row.original.roles?.length ? row.original.roles.join(', ') : '-';
        },
      },
      {
        accessorKey: 'created_by',
        header: 'Created By',
        cell: ({ row }) => row.original.created_by || '-',
      },
      {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => {
          const canUpdate = row.original.can_update ?? true;

          return (
            <div className="flex items-center gap-2">
              <Button isIconOnly size="sm" variant="secondary" isDisabled={!canUpdate} onPress={() => handleOpenEditModal(row.original)}>
                <PencilToLine className="size-4" />
              </Button>
              <Button isIconOnly size="sm" variant="danger" isDisabled={!canUpdate} onPress={() => handleOpenDeleteModal(row.original)}>
                <TrashBin className="size-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notification</h1>
        <Button variant="primary" className="bg-primary-600 hover:bg-primary-600/90" onPress={handleOpenCreateModal}>
          Tambah Notification
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

            <SearchField name="search" aria-label="Cari notification" value={params.search ?? ''} onChange={(value) => setParams((prev) => ({ ...prev, search: value, page: 1 }))}>
              <SearchField.Group className="h-10 border border-gray-300 shadow-none">
                <SearchField.SearchIcon />
                <SearchField.Input className="w-64" placeholder="Cari judul notification..." />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>
          </div>
        </div>

        <div className="mt-5">
          <DataTable
            data={notifications}
            columns={columns}
            ariaLabel="Tabel data notification"
            pageSize={params.limit}
            currentPage={paginationMeta?.page ?? params.page}
            totalPages={paginationMeta?.totalPages ?? 1}
            onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
            isLoading={isLoading}
            isError={isError}
            emptyMessage="Belum ada data notification."
            errorMessage="Gagal memuat data notification. Silakan coba refresh halaman."
            minWidthClassName="min-w-[920px]"
          />
        </div>
      </div>

      <NotificationFormModal
        isOpen={formModalState.isOpen}
        onOpenChange={(isOpen) => {
          formModalState.setOpen(isOpen);
          if (!isOpen) {
            setSelectedNotification(null);
            setValue('roles', []);
          }
        }}
        control={control}
        handleSubmit={handleSubmit}
        onSubmit={handleFormSubmit}
        onCancel={handleCloseFormModal}
        title={formMode === 'create' ? 'Tambah Notification' : 'Edit Notification'}
        submitText={formMode === 'create' ? 'Simpan Notification' : 'Simpan Perubahan'}
      />

      <ConfirmationModal
        isOpen={deleteModalState.isOpen}
        onOpenChange={deleteModalState.setOpen}
        icon={<TrashBin className="size-5" />}
        title="Hapus Notification"
        description={selectedNotification ? `Yakin ingin menghapus notification ${selectedNotification.title}? Tindakan ini tidak dapat dibatalkan.` : 'Yakin ingin menghapus data ini?'}
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={handleDeleteNotification}
      />
    </div>
  );
}
