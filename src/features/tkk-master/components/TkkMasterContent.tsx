'use client';

import { ConfirmationModal } from '@/components/modal/ConfirmationModal';
import { TrashBin } from '@gravity-ui/icons';
import { Button, Tabs, toast, useOverlayState } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { extractUserLevel, extractUserRole } from '@/lib/auth/role-access';

import { useCreateTkkField, useDeleteTkkField, useTkkFieldAll, useTkkFieldPaginated, useUpdateTkkField } from '../hooks/useTkkField';
import { useCreateTkkType, useDeleteTkkType, useTkkTypePaginated, useUpdateTkkType } from '../hooks/useTkkType';
import { tkkFieldFormSchema, type TkkFieldFormValues } from '../schemas/tkk-field.schema';
import { tkkTypeFormSchema, type TkkTypeFormValues } from '../schemas/tkk-type.schema';
import { TkkFieldFormModal } from './TkkFieldFormModal';
import { TkkFieldTable } from './TkkFieldTable';
import { TkkTypeFormModal } from './TkkTypeFormModal';
import { TkkTypeTable } from './TkkTypeTable';

type TkkMasterTabKey = 'field' | 'type';
type TkkMasterFormMode = 'create' | 'edit';

export function TkkMasterContent() {
  const formModalState = useOverlayState();
  const deleteModalState = useOverlayState();
  const { data: session } = useSession();

  const [activeTab, setActiveTab] = useState<TkkMasterTabKey>('field');
  const [formMode, setFormMode] = useState<TkkMasterFormMode>('create');

  const [tkkFieldParams, setTkkFieldParams] = useState<TkkFieldPaginatedParams>({ page: 1, limit: 10, search: '', level: '' });
  const [tkkTypeParams, setTkkTypeParams] = useState<TkkTypePaginatedParams>({ page: 1, limit: 10, search: '', level: '', tkk_field_id: '' });

  const [selectedTkkField, setSelectedTkkField] = useState<TkkFieldPaginatedResponse | null>(null);
  const [selectedTkkType, setSelectedTkkType] = useState<TkkTypePaginatedResponse | null>(null);

  const currentRole = useMemo(() => extractUserRole((session?.user as Record<string, unknown> | undefined) ?? null), [session?.user]);
  const userLevel = useMemo(() => extractUserLevel((session?.user as Record<string, unknown> | undefined) ?? null), [session?.user]);
  const isSuperAdmin = currentRole === 'super_admin';
  const showLevelFilter = isSuperAdmin;

  useEffect(() => {
    if (isSuperAdmin || !userLevel) {
      return;
    }

    setTkkFieldParams((prev) => {
      if (prev.level === userLevel) {
        return prev;
      }

      return { ...prev, level: userLevel, page: 1 };
    });

    setTkkTypeParams((prev) => {
      if (prev.level === userLevel) {
        return prev;
      }

      return { ...prev, level: userLevel, page: 1 };
    });
  }, [isSuperAdmin, userLevel]);

  const tkkFieldForm = useForm<TkkFieldFormValues>({
    resolver: zodResolver(tkkFieldFormSchema),
    defaultValues: { name: '', level: '', color: '' },
  });

  const tkkTypeForm = useForm<TkkTypeFormValues>({
    resolver: zodResolver(tkkTypeFormSchema),
    defaultValues: { name: '', level: '', tkk_field_id: '' },
  });

  const { data: tkkFieldAllData } = useTkkFieldAll();
  const { data: tkkFieldPaginatedData, isLoading: isTkkFieldLoading, isError: isTkkFieldError } = useTkkFieldPaginated(tkkFieldParams);
  const { data: tkkTypePaginatedData, isLoading: isTkkTypeLoading, isError: isTkkTypeError } = useTkkTypePaginated(tkkTypeParams);

  const createTkkField = useCreateTkkField();
  const updateTkkField = useUpdateTkkField();
  const deleteTkkField = useDeleteTkkField();

  const createTkkType = useCreateTkkType();
  const updateTkkType = useUpdateTkkType();
  const deleteTkkType = useDeleteTkkType();

  const tkkFieldOptions = tkkFieldAllData?.data ?? [];
  const tkkFieldData = tkkFieldPaginatedData?.data ?? [];
  const tkkTypeData = tkkTypePaginatedData?.data ?? [];
  const tkkFieldPaginationMeta = tkkFieldPaginatedData?.meta;
  const tkkTypePaginationMeta = tkkTypePaginatedData?.meta;

  const resetSelection = () => {
    setSelectedTkkField(null);
    setSelectedTkkType(null);
  };

  const closeFormModal = () => {
    formModalState.close();
    resetSelection();
  };

  const openCreateModal = () => {
    setFormMode('create');
    resetSelection();

    if (activeTab === 'field') {
      tkkFieldForm.reset({ name: '', level: isSuperAdmin ? (tkkFieldParams.level ?? '') : (userLevel ?? ''), color: '' });
    }

    if (activeTab === 'type') {
      tkkTypeForm.reset({ name: '', level: isSuperAdmin ? (tkkTypeParams.level ?? '') : (userLevel ?? ''), tkk_field_id: tkkTypeParams.tkk_field_id ?? '' });
    }

    formModalState.open();
  };

  const openEditTkkFieldModal = (item: TkkFieldPaginatedResponse) => {
    setActiveTab('field');
    setFormMode('edit');
    setSelectedTkkField(item);
    setSelectedTkkType(null);
    tkkFieldForm.reset({ name: item.name, level: isSuperAdmin ? item.level : (userLevel ?? item.level), color: item.color });
    formModalState.open();
  };

  const openEditTkkTypeModal = (item: TkkTypePaginatedResponse) => {
    setActiveTab('type');
    setFormMode('edit');
    setSelectedTkkType(item);
    setSelectedTkkField(null);
    tkkTypeForm.reset({ name: item.name, level: isSuperAdmin ? item.level : (userLevel ?? item.level), tkk_field_id: item.tkk_field_id });
    formModalState.open();
  };

  const openDeleteTkkFieldModal = (item: TkkFieldPaginatedResponse) => {
    setActiveTab('field');
    setSelectedTkkField(item);
    setSelectedTkkType(null);
    deleteModalState.open();
  };

  const openDeleteTkkTypeModal = (item: TkkTypePaginatedResponse) => {
    setActiveTab('type');
    setSelectedTkkType(item);
    setSelectedTkkField(null);
    deleteModalState.open();
  };

  const handleTkkFieldSubmit = async (values: TkkFieldFormValues) => {
    const payload: TkkFieldFormValues = {
      ...values,
      level: isSuperAdmin ? values.level : (userLevel ?? values.level),
    };

    if (formMode === 'create') {
      await toast.promise(createTkkField.mutateAsync(payload), {
        loading: 'Menyimpan bidang TKK...',
        success: 'Bidang TKK berhasil ditambahkan.',
        error: 'Gagal menambahkan bidang TKK.',
      });
      closeFormModal();
      return;
    }

    if (!selectedTkkField) {
      return;
    }

    await toast.promise(updateTkkField.mutateAsync({ id: selectedTkkField.id, payload }), {
      loading: 'Memperbarui bidang TKK...',
      success: 'Bidang TKK berhasil diperbarui.',
      error: 'Gagal memperbarui bidang TKK.',
    });

    closeFormModal();
  };

  const handleTkkTypeSubmit = async (values: TkkTypeFormValues) => {
    const payload: TkkTypeFormValues = {
      ...values,
      level: isSuperAdmin ? values.level : (userLevel ?? values.level),
    };

    if (formMode === 'create') {
      await toast.promise(createTkkType.mutateAsync(payload), {
        loading: 'Menyimpan tipe TKK...',
        success: 'Tipe TKK berhasil ditambahkan.',
        error: 'Gagal menambahkan tipe TKK.',
      });
      closeFormModal();
      return;
    }

    if (!selectedTkkType) {
      return;
    }

    await toast.promise(updateTkkType.mutateAsync({ id: selectedTkkType.id, payload }), {
      loading: 'Memperbarui tipe TKK...',
      success: 'Tipe TKK berhasil diperbarui.',
      error: 'Gagal memperbarui tipe TKK.',
    });

    closeFormModal();
  };

  const handleDelete = async () => {
    if (activeTab === 'field' && selectedTkkField) {
      await toast.promise(deleteTkkField.mutateAsync(selectedTkkField.id), {
        loading: 'Menghapus bidang TKK...',
        success: 'Bidang TKK berhasil dihapus.',
        error: 'Gagal menghapus bidang TKK.',
      });
    }

    if (activeTab === 'type' && selectedTkkType) {
      await toast.promise(deleteTkkType.mutateAsync(selectedTkkType.id), {
        loading: 'Menghapus tipe TKK...',
        success: 'Tipe TKK berhasil dihapus.',
        error: 'Gagal menghapus tipe TKK.',
      });
    }

    deleteModalState.close();
    resetSelection();
  };

  const currentEntityName = activeTab === 'field' ? 'Bidang TKK' : 'Tipe TKK';
  const selectedEntityName = activeTab === 'field' ? selectedTkkField?.name : selectedTkkType?.name;
  const addButtonLabel = activeTab === 'field' ? 'Tambah Bidang TKK' : 'Tambah Tipe TKK';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Master TKK</h1>
        <Button variant="primary" className="bg-primary-600 hover:bg-primary-600/90" onPress={openCreateModal}>
          {addButtonLabel}
        </Button>
      </div>

      <Tabs selectedKey={activeTab} onSelectionChange={(key) => setActiveTab(key as TkkMasterTabKey)} className="w-full">
        <Tabs.ListContainer>
          <Tabs.List aria-label="Pilih tipe master TKK" className="*:data-[selected=true]:text-accent-foreground">
            <Tabs.Tab id="field">
              Bidang TKK
              <Tabs.Indicator className="bg-primary-500" />
            </Tabs.Tab>
            <Tabs.Tab id="type">
              Tipe TKK
              <Tabs.Indicator className="bg-primary-500" />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>

        <Tabs.Panel id="field" className="mt-5">
          <TkkFieldTable
            params={tkkFieldParams}
            onChangeParams={setTkkFieldParams}
            showLevelFilter={showLevelFilter}
            data={tkkFieldData}
            currentPage={tkkFieldPaginationMeta?.page ?? tkkFieldParams.page}
            totalPages={tkkFieldPaginationMeta?.totalPages ?? 1}
            onPageChange={(page) => setTkkFieldParams((prev) => ({ ...prev, page }))}
            isLoading={isTkkFieldLoading}
            isError={isTkkFieldError}
            onEdit={openEditTkkFieldModal}
            onDelete={openDeleteTkkFieldModal}
          />
        </Tabs.Panel>

        <Tabs.Panel id="type" className="mt-5">
          <TkkTypeTable
            params={tkkTypeParams}
            onChangeParams={setTkkTypeParams}
            tkkFieldOptions={tkkFieldOptions}
            showLevelFilter={showLevelFilter}
            data={tkkTypeData}
            currentPage={tkkTypePaginationMeta?.page ?? tkkTypeParams.page}
            totalPages={tkkTypePaginationMeta?.totalPages ?? 1}
            onPageChange={(page) => setTkkTypeParams((prev) => ({ ...prev, page }))}
            isLoading={isTkkTypeLoading}
            isError={isTkkTypeError}
            onEdit={openEditTkkTypeModal}
            onDelete={openDeleteTkkTypeModal}
          />
        </Tabs.Panel>
      </Tabs>

      {activeTab === 'field' && (
        <TkkFieldFormModal
          isOpen={formModalState.isOpen}
          onOpenChange={(isOpen) => {
            formModalState.setOpen(isOpen);
            if (!isOpen) {
              resetSelection();
            }
          }}
          control={tkkFieldForm.control}
          handleSubmit={tkkFieldForm.handleSubmit}
          onSubmit={handleTkkFieldSubmit}
          onCancel={closeFormModal}
          title={formMode === 'create' ? 'Tambah Bidang TKK' : 'Edit Bidang TKK'}
          submitText={formMode === 'create' ? 'Simpan Bidang TKK' : 'Simpan Perubahan'}
          showLevelField={showLevelFilter}
        />
      )}

      {activeTab === 'type' && (
        <TkkTypeFormModal
          isOpen={formModalState.isOpen}
          onOpenChange={(isOpen) => {
            formModalState.setOpen(isOpen);
            if (!isOpen) {
              resetSelection();
            }
          }}
          control={tkkTypeForm.control}
          handleSubmit={tkkTypeForm.handleSubmit}
          onSubmit={handleTkkTypeSubmit}
          onCancel={closeFormModal}
          title={formMode === 'create' ? 'Tambah Tipe TKK' : 'Edit Tipe TKK'}
          submitText={formMode === 'create' ? 'Simpan Tipe TKK' : 'Simpan Perubahan'}
          tkkFieldOptions={tkkFieldOptions}
          showLevelField={showLevelFilter}
        />
      )}

      <ConfirmationModal
        isOpen={deleteModalState.isOpen}
        onOpenChange={deleteModalState.setOpen}
        icon={<TrashBin className="size-5" />}
        title={`Hapus ${currentEntityName}`}
        description={selectedEntityName ? `Yakin ingin menghapus ${currentEntityName.toLowerCase()} ${selectedEntityName}? Tindakan ini tidak dapat dibatalkan.` : 'Yakin ingin menghapus data ini?'}
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={handleDelete}
      />
    </div>
  );
}
