'use client';

import { ConfirmationModal } from '@/components/modal/ConfirmationModal';
import { DataTable } from '@/components/table/DataTable';
import { useInstitutionAll } from '@/features/institution/hooks/useInstitution';
import { useDistrictAll } from '@/features/region/hooks/useDistrict';
import { UserFilterModal, type UserFilterValues } from '@/features/user/components/UserFilterModal';
import { UserFormModal } from '@/features/user/components/UserFormModal';
import { pageSizeOptions } from '@/lib/main/options';
import { Funnel, PencilToLine, TrashBin } from '@gravity-ui/icons';
import { Button, ListBox, SearchField, Select, Switch, toast, useOverlayState } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { useCreateUser, useDeleteUser, useUpdateStatusUser, useUpdateUser, useUserPaginated } from '../hooks/useUser';
import { type UserFormValues, userFormSchema } from '../schemas/user.schema';
type UserFormMode = 'create' | 'edit';

export function UserContent() {
  const formModalState = useOverlayState();
  const deleteModalState = useOverlayState();
  const filterModalState = useOverlayState();
  const [userFormMode, setUserFormMode] = useState<UserFormMode>('create');
  const [params, setParams] = useState<UserPaginatedParams>({
    page: 1,
    limit: 10,
    search: '',
    institution_id: '',
    district_id: '',
    role: '',
    level: '',
  });
  const [selectedUser, setSelectedUser] = useState<UserPaginatedResponse | null>(null);
  const [institutionSearch, setInstitutionSearch] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');

  const { data: paginatedData, isLoading, isError } = useUserPaginated(params);

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const updateStatusUser = useUpdateStatusUser();
  const deleteUser = useDeleteUser();

  const defaultUserFormValues: UserFormValues = {
    name: '',
    email: '',
    password: '',
    role: 'admin',
    level: 'siaga',
    institution_id: '',
    district_id: '',
  };

  const { control, getValues, handleSubmit, reset } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: defaultUserFormValues,
  });

  const selectedLevel = useWatch({ control, name: 'level' });
  const { data: institutionAllDataFiltered } = useInstitutionAll({ level: selectedLevel, search: institutionSearch, limit: 10 });
  const { data: districtAllDataFiltered } = useDistrictAll({ search: districtSearch, limit: 10 });

  const {
    control: filterControl,
    handleSubmit: handleFilterSubmit,
    reset: resetFilterForm,
  } = useForm<UserFilterValues>({
    defaultValues: {
      search: '',
      institution_id: '',
      district_id: '',
      role: '',
      level: '',
    },
  });

  const handleLimitChange = (value: number) => {
    setParams((prev) => ({ ...prev, limit: value, page: 1 }));
  };

  const handleOpenFilterModal = () => {
    resetFilterForm({
      search: params.search ?? '',
      institution_id: params.institution_id ?? '',
      district_id: params.district_id ?? '',
      role: (params.role as UserFilterValues['role']) ?? '',
      level: params.level ?? '',
    });
    filterModalState.open();
  };

  const handleApplyFilter = (values: UserFilterValues) => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      search: values.search.trim(),
      institution_id: values.institution_id.trim(),
      district_id: values.district_id.trim(),
      role: values.role,
      level: values.level.trim(),
    }));
    filterModalState.close();
  };

  const handleResetFilter = () => {
    resetFilterForm({
      search: '',
      institution_id: '',
      district_id: '',
      role: '',
      level: '',
    });
    setParams((prev) => ({
      ...prev,
      page: 1,
      search: '',
      institution_id: '',
      district_id: '',
      role: '',
      level: '',
    }));
    filterModalState.close();
  };

  const handleOpenCreateModal = () => {
    setUserFormMode('create');
    setSelectedUser(null);
    reset(defaultUserFormValues);
    formModalState.open();
  };

  const handleOpenEditModal = (user: UserPaginatedResponse) => {
    setUserFormMode('edit');
    setSelectedUser(user);
    reset({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      level: user.level,
      institution_id: user.institution_id,
      district_id: user.district_id,
    });
    formModalState.open();
  };

  const handleCloseUserFormModal = () => {
    formModalState.close();
    setSelectedUser(null);
  };

  const handleOpenDeleteModal = (user: UserPaginatedResponse) => {
    setSelectedUser(user);
    deleteModalState.open();
  };

  const handleToggleStatus = async (user: UserPaginatedResponse, isSelected: boolean) => {
    await toast.promise(updateStatusUser.mutateAsync({ id: user.id, payload: { is_active: isSelected } }), {
      loading: 'Memperbarui status user...',
      success: 'Status user berhasil diperbarui.',
      error: 'Gagal memperbarui status user.',
    });
  };

  const handleSubmitUserForm = async (values: UserFormValues) => {
    const payload: UserPayload = {
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.role,
      level: values.level,
      institution_id: values.institution_id || '',
      district_id: values.district_id || '',
    };

    if (userFormMode === 'create') {
      await toast.promise(createUser.mutateAsync(payload), {
        loading: 'Menyimpan user...',
        success: 'User berhasil ditambahkan.',
        error: 'Gagal menambahkan user.',
      });

      handleCloseUserFormModal();
      return;
    }

    if (!selectedUser) {
      return;
    }

    await toast.promise(updateUser.mutateAsync({ id: selectedUser.id, payload }), {
      loading: 'Memperbarui user...',
      success: 'User berhasil diperbarui.',
      error: 'Gagal memperbarui user.',
    });

    handleCloseUserFormModal();
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) {
      return;
    }

    await toast.promise(deleteUser.mutateAsync(selectedUser.id), {
      loading: 'Menghapus user...',
      success: 'User berhasil dihapus.',
      error: 'Gagal menghapus user.',
    });

    deleteModalState.close();
    setSelectedUser(null);
  };

  const selectedLimit = String(params.limit);

  const users = paginatedData?.data ?? [];
  const paginationMeta = paginatedData?.meta;

  const columns = useMemo<ColumnDef<UserPaginatedResponse>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nama',
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-slate-900">{row.original.name}</p>
            <p className="text-xs text-slate-500">{row.original.email}</p>
          </div>
        ),
      },
      {
        accessorKey: 'institution_name',
        header: 'Institution',
      },
      {
        accessorKey: 'district_name',
        header: 'District',
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => <span className="capitalize">{row.original.role}</span>,
      },
      {
        accessorKey: 'level',
        header: 'Level',
        cell: ({ row }) => <span className="capitalize">{row.original.level}</span>,
      },
      {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => {
          const canUpdate = row.original.can_update ?? true;
          const isActive = row.original.is_active;

          return (
            <div className="flex items-center gap-2">
              <Button isIconOnly size="sm" variant="secondary" isDisabled={!canUpdate} onPress={() => handleOpenEditModal(row.original)}>
                <PencilToLine className="size-4" />
              </Button>
              <Button isIconOnly size="sm" variant="danger" isDisabled={!canUpdate} onPress={() => handleOpenDeleteModal(row.original)}>
                <TrashBin className="size-4" />
              </Button>
              <Switch aria-label={`Ubah status ${row.original.name}`} isDisabled={!canUpdate} isSelected={isActive} onChange={(isSelected) => void handleToggleStatus(row.original, isSelected)}>
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
                <Switch.Content>{isActive ? 'Aktif' : 'Nonaktif'}</Switch.Content>
              </Switch>
            </div>
          );
        },
      },
    ],
    [],
  );

  const institutionOptions = institutionAllDataFiltered?.data ?? [];
  const districtOptions = districtAllDataFiltered?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">User</h1>
        <Button variant="primary" className="bg-primary-600 hover:bg-primary-600/90" onPress={handleOpenCreateModal}>
          Tambah User
        </Button>
      </div>

      <div className="rounded-4xl bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <Select aria-label="Jumlah data per halaman" className="w-20" placeholder="Select one" value={selectedLimit} onChange={(value) => handleLimitChange(Number(value))}>
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

            <SearchField name="search" aria-label="Cari user" value={params.search ?? ''} onChange={(value) => setParams((prev) => ({ ...prev, search: value, page: 1 }))}>
              <SearchField.Group className="h-10 border border-gray-300 shadow-none">
                <SearchField.SearchIcon />
                <SearchField.Input className="w-64" placeholder="Cari..." />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>
          </div>

          <Button variant="outline" className="border-primary-600 hover:bg-primary-100 text-primary-600" onPress={handleOpenFilterModal}>
            <Funnel />
            Filter
          </Button>
        </div>

        <div className="mt-5">
          <DataTable
            data={users}
            columns={columns}
            ariaLabel="Tabel data user"
            pageSize={params.limit}
            currentPage={paginationMeta?.page ?? params.page}
            totalPages={paginationMeta?.totalPages ?? 1}
            onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
            isLoading={isLoading}
            isError={isError}
            emptyMessage="Belum ada data user."
            errorMessage="Gagal memuat data user. Silakan coba refresh halaman."
            minWidthClassName="min-w-[1240px]"
          />
        </div>
      </div>

      <UserFormModal
        isOpen={formModalState.isOpen}
        onOpenChange={(isOpen) => {
          formModalState.setOpen(isOpen);
          if (!isOpen) {
            setSelectedUser(null);
          }
        }}
        control={control}
        getValues={getValues}
        handleSubmit={handleSubmit}
        onSubmit={handleSubmitUserForm}
        onCancel={handleCloseUserFormModal}
        isEditMode={userFormMode === 'edit'}
        title={userFormMode === 'create' ? 'Tambah User' : 'Edit User'}
        submitText={userFormMode === 'create' ? 'Simpan User' : 'Simpan'}
        institutionOptions={institutionOptions}
        districtOptions={districtOptions}
        onInstitutionSearchChange={setInstitutionSearch}
        onDistrictSearchChange={setDistrictSearch}
      />

      <UserFilterModal
        isOpen={filterModalState.isOpen}
        onOpenChange={filterModalState.setOpen}
        control={filterControl}
        handleSubmit={handleFilterSubmit}
        onSubmit={handleApplyFilter}
        onCancel={() => filterModalState.close()}
        onReset={handleResetFilter}
        institutionOptions={institutionOptions}
        districtOptions={districtOptions}
      />

      <ConfirmationModal
        isOpen={deleteModalState.isOpen}
        onOpenChange={deleteModalState.setOpen}
        icon={<TrashBin className="size-5" />}
        title="Hapus User"
        description={selectedUser ? `Yakin ingin menghapus user ${selectedUser.name}? Tindakan ini tidak dapat dibatalkan.` : 'Yakin ingin menghapus user ini?'}
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={handleDeleteUser}
      />
    </div>
  );
}
