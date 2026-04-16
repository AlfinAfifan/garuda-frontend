'use client';

import { ConfirmationModal } from '@/components/modal/ConfirmationModal';
import { DataTable } from '@/components/table/DataTable';
import { useDistrictAll } from '@/features/region/hooks/useDistrict';
import { levelOptions, pageSizeOptions } from '@/lib/main/options';
import { PencilToLine, TrashBin } from '@gravity-ui/icons';
import { Autocomplete, Button, EmptyState, ListBox, SearchField, Select, toast, useFilter, useOverlayState } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ColumnDef } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useSession } from 'next-auth/react';
import { useCreateInstitution, useDeleteInstitution, useInstitutionPaginated, useUpdateInstitution } from '../hooks/useInstitution';
import { type InstitutionFormValues, institutionFormSchema } from '../schemas/institution.schema';
import { InstitutionFormModal } from './InstitutionFormModal';

type InstitutionFormMode = 'create' | 'edit';

export function InstitutionContent() {
  const formModalState = useOverlayState();
  const deleteModalState = useOverlayState();
  const { data: session } = useSession();

  const userRole = session?.user?.role;

  const [formMode, setFormMode] = useState<InstitutionFormMode>('create');
  const [selectedInstitution, setSelectedInstitution] = useState<InstitutionPaginatedResponse | null>(null);
  const [districtSearch, setDistrictSearch] = useState('');
  const [params, setParams] = useState<InstitutionPaginatedParams>({
    page: 1,
    limit: 10,
    search: '',
    district_id: '',
    level: '',
  });

  // Update params when session is loaded
  useEffect(() => {
    if (session?.user) {
      const defaultLevelFilter = session.user.role === 'super_admin' ? '' : (session.user.level ?? '');
      const defaultDistrictFilter = session.user.role === 'kwarran' ? session.user.district_id : '';

      setParams((prev) => ({
        ...prev,
        level: defaultLevelFilter,
        district_id: defaultDistrictFilter,
      }));
    }
  }, [session?.user]);

  const defaultLevelFilter = session?.user?.role === 'super_admin' ? '' : (session?.user?.level ?? '');
  const defaultDistrictFilter = session?.user?.role === 'kwarran' ? session?.user?.district_id : '';

  const { data: districtAllData } = useDistrictAll({ search: districtSearch });
  const { data: paginatedData, isLoading, isError } = useInstitutionPaginated(params);

  const createInstitution = useCreateInstitution();
  const updateInstitution = useUpdateInstitution();
  const deleteInstitution = useDeleteInstitution();

  const defaultValues: InstitutionFormValues = {
    name: '',
    district_id: defaultDistrictFilter || '',
    address: '',
    male_scout_unit_number: '',
    female_scout_unit_number: '',
    male_scout_unit_leader_name: '',
    female_scout_unit_leader_name: '',
    male_scout_unit_leader_nta: '',
    female_scout_unit_leader_nta: '',
    principal_name: '',
    principal_nip: '',
    level: defaultLevelFilter || '',
  };

  const { control, handleSubmit, reset } = useForm<InstitutionFormValues>({
    resolver: zodResolver(institutionFormSchema),
    defaultValues,
  });

  // Update form default values when session is loaded
  useEffect(() => {
    if (session?.user) {
      reset({
        ...defaultValues,
        district_id: defaultDistrictFilter || '',
        level: defaultLevelFilter || '',
      });
    }
  }, [session?.user?.id]);

  const { contains } = useFilter({ sensitivity: 'base' });

  const districtOptions = districtAllData?.data ?? [];
  const institutions = paginatedData?.data ?? [];
  const paginationMeta = paginatedData?.meta;

  const handleOpenCreateModal = () => {
    setFormMode('create');
    setSelectedInstitution(null);
    reset(defaultValues);
    formModalState.open();
  };

  const handleOpenEditModal = (institution: InstitutionPaginatedResponse) => {
    setFormMode('edit');
    setSelectedInstitution(institution);
    reset({
      name: institution.name,
      district_id: institution.district_id,
      address: institution.address,
      male_scout_unit_number: institution.male_scout_unit_number,
      female_scout_unit_number: institution.female_scout_unit_number,
      male_scout_unit_leader_name: institution.male_scout_unit_leader_name,
      female_scout_unit_leader_name: institution.female_scout_unit_leader_name,
      male_scout_unit_leader_nta: institution.male_scout_unit_leader_nta,
      female_scout_unit_leader_nta: institution.female_scout_unit_leader_nta,
      principal_name: institution.principal_name,
      principal_nip: institution.principal_nip,
      level: institution.level,
    });
    formModalState.open();
  };

  const handleCloseFormModal = () => {
    formModalState.close();
    setSelectedInstitution(null);
  };

  const handleOpenDeleteModal = (institution: InstitutionPaginatedResponse) => {
    setSelectedInstitution(institution);
    deleteModalState.open();
  };

  const handleFormSubmit = async (values: InstitutionFormValues) => {
    if (formMode === 'create') {
      await toast.promise(createInstitution.mutateAsync(values), {
        loading: 'Menyimpan lembaga...',
        success: 'Lembaga berhasil ditambahkan.',
        error: 'Gagal menambahkan lembaga.',
      });

      handleCloseFormModal();
      return;
    }

    if (!selectedInstitution) {
      return;
    }

    await toast.promise(updateInstitution.mutateAsync({ id: selectedInstitution.id, payload: values }), {
      loading: 'Memperbarui lembaga...',
      success: 'Lembaga berhasil diperbarui.',
      error: 'Gagal memperbarui lembaga.',
    });

    handleCloseFormModal();
  };

  const handleDeleteInstitution = async () => {
    if (!selectedInstitution) {
      return;
    }

    await toast.promise(deleteInstitution.mutateAsync(selectedInstitution.id), {
      loading: 'Menghapus lembaga...',
      success: 'Lembaga berhasil dihapus.',
      error: 'Gagal menghapus lembaga.',
    });

    deleteModalState.close();
    setSelectedInstitution(null);
  };

  const columns = useMemo<ColumnDef<InstitutionPaginatedResponse>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nama Lembaga',
      },
      {
        accessorKey: 'district_name',
        header: 'Kecamatan',
      },
      ...(session?.user?.role === 'super_admin'
        ? [
            {
              accessorKey: 'level',
              header: 'Level',
            },
          ]
        : []),
      {
        accessorKey: 'principal_name',
        header: 'Kepala Sekolah',
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
    [session?.user?.role],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Lembaga</h1>
        <Button variant="primary" className="bg-primary-600 hover:bg-primary-600/90" onPress={handleOpenCreateModal}>
          Tambah Lembaga
        </Button>
      </div>

      <div className="rounded-4xl bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <Select aria-label="Jumlah data per halaman" className="w-20" placeholder="Select one" value={String(params.limit)} onChange={(value) => setParams((prev) => ({ ...prev, limit: Number(value), page: 1 }))}>
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

            <SearchField name="search" aria-label="Cari lembaga" value={params.search ?? ''} onChange={(value) => setParams((prev) => ({ ...prev, search: value, page: 1 }))}>
              <SearchField.Group className="h-10 border border-gray-300 shadow-none">
                <SearchField.SearchIcon />
                <SearchField.Input className="w-64" placeholder="Cari nama lembaga..." />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>

            {['super_admin'].includes(userRole ?? '') && (
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

            {['super_admin', 'admin'].includes(userRole ?? '') && (
              <Autocomplete
                aria-label="Filter kecamatan"
                placeholder="Search district"
                selectionMode="single"
                value={params.district_id ?? ''}
                onChange={(value) => setParams((prev) => ({ ...prev, district_id: String(value ?? ''), page: 1 }))}
                className="w-56"
              >
                <Autocomplete.Trigger className="h-10 border border-gray-300 shadow-none">
                  <Autocomplete.Value />
                  <Autocomplete.ClearButton />
                  <Autocomplete.Indicator />
                </Autocomplete.Trigger>
                <Autocomplete.Popover>
                  <Autocomplete.Filter filter={contains}>
                    <SearchField autoFocus name="search" variant="secondary" value={districtSearch} onChange={(value) => setDistrictSearch(value)}>
                      <SearchField.Group>
                        <SearchField.SearchIcon />
                        <SearchField.Input placeholder="Cari kecamatan..." />
                        <SearchField.ClearButton />
                      </SearchField.Group>
                    </SearchField>

                    <ListBox aria-label="Filter kecamatan" renderEmptyState={() => <EmptyState>No results found</EmptyState>}>
                      <ListBox.Item id="" key="all-district" textValue="Semua kecamatan">
                        Semua kecamatan
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                      {districtOptions.map((option) => (
                        <ListBox.Item key={option.id} id={option.id} textValue={option.name}>
                          {option.name}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Autocomplete.Filter>
                </Autocomplete.Popover>
              </Autocomplete>
            )}
          </div>
        </div>

        <div className="mt-5">
          <DataTable
            data={institutions}
            columns={columns}
            ariaLabel="Tabel data lembaga"
            pageSize={params.limit}
            currentPage={paginationMeta?.page ?? params.page}
            totalPages={paginationMeta?.totalPages ?? 1}
            onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
            isLoading={isLoading}
            isError={isError}
            emptyMessage="Belum ada data lembaga."
            errorMessage="Gagal memuat data lembaga. Silakan coba refresh halaman."
            minWidthClassName="min-w-[1120px]"
          />
        </div>
      </div>

      <InstitutionFormModal
        isOpen={formModalState.isOpen}
        onOpenChange={(isOpen) => {
          formModalState.setOpen(isOpen);
          if (!isOpen) {
            setSelectedInstitution(null);
          }
        }}
        control={control}
        handleSubmit={handleSubmit}
        onSubmit={handleFormSubmit}
        onCancel={handleCloseFormModal}
        title={formMode === 'create' ? 'Tambah Lembaga' : 'Edit Lembaga'}
        submitText={formMode === 'create' ? 'Simpan Lembaga' : 'Simpan Perubahan'}
        districtOptions={districtOptions}
        onDistrictSearchChange={(search) => setDistrictSearch(search)}
        userRole={session?.user?.role}
        userLevel={session?.user?.level}
        userDistrictId={session?.user?.district_id}
      />

      <ConfirmationModal
        isOpen={deleteModalState.isOpen}
        onOpenChange={deleteModalState.setOpen}
        icon={<TrashBin className="size-5" />}
        title="Hapus Lembaga"
        description={selectedInstitution ? `Yakin ingin menghapus lembaga ${selectedInstitution.name}? Tindakan ini tidak dapat dibatalkan.` : 'Yakin ingin menghapus data ini?'}
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={handleDeleteInstitution}
      />
    </div>
  );
}
