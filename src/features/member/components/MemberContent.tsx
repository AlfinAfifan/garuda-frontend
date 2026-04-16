'use client';

import { ConfirmationModal } from '@/components/modal/ConfirmationModal';
import { DataTable } from '@/components/table/DataTable';
import { useInstitutionAll } from '@/features/institution/hooks/useInstitution';
import { useCityAll } from '@/features/region/hooks/useCity';
import { useReligionAll } from '@/features/religion/hooks/useReligion';
import { levelOptions, pageSizeOptions } from '@/lib/main/options';
import { PencilToLine, TrashBin } from '@gravity-ui/icons';
import { Autocomplete, Button, EmptyState, ListBox, SearchField, Select, toast, useFilter, useOverlayState } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useSession } from 'next-auth/react';
import { useCreateMember, useDeleteMember, useMemberPaginated, useUpdateMember } from '../hooks/useMember';
import { type MemberFormValues, memberFormSchema } from '../schemas/member.schema';
import { MemberFormModal } from './MemberFormModal';

type MemberFormMode = 'create' | 'edit';

export function MemberContent() {
  const formModalState = useOverlayState();
  const deleteModalState = useOverlayState();
  const { data: session } = useSession();

  const defaultLevelFilter: '' | 'siaga' | 'penggalang' | 'penegak' = session?.user?.role === 'super_admin' ? '' : ((session?.user?.level ?? '') as '' | 'siaga' | 'penggalang' | 'penegak');
  const defaultInstitutionFilter = session?.user?.role === 'institution' ? session?.user?.institution_id : '';
  const defaultDistrictFilter = session?.user?.role === 'kwarran' ? session?.user?.district_id : '';

  const [formMode, setFormMode] = useState<MemberFormMode>('create');
  const [selectedMember, setSelectedMember] = useState<MemberPaginatedResponse | null>(null);
  const [institutionSearch, setInstitutionSearch] = useState('');
  const [params, setParams] = useState<MemberPaginatedParams>({
    page: 1,
    limit: 10,
    search: '',
    institution_id: defaultInstitutionFilter || '',
    level: defaultLevelFilter || '',
  });

  const { data: institutionAllData } = useInstitutionAll({ search: institutionSearch, limit: 100, level: defaultLevelFilter, district_id: defaultDistrictFilter });
  const { data: cityAllData } = useCityAll();
  const { data: religionAllData } = useReligionAll();
  const { data: paginatedData, isLoading, isError } = useMemberPaginated(params);

  const createMember = useCreateMember();
  const updateMember = useUpdateMember();
  const deleteMember = useDeleteMember();

  const defaultValues: MemberFormValues = {
    name: '',
    phone: '',
    nta: '',
    nik: '',
    talent: '',
    address: '',
    father_name: '',
    mother_name: '',
    parent_phone: '',
    parent_address: '',
    entry_level: '',
    exit_reason: '',
    birthdate: '',
    father_birthdate: '',
    mother_birthdate: '',
    entry_date: '',
    exit_date: '',
    father_birthplace: '',
    mother_birthplace: '',
    birthplace: '',
    religion: '',
    institution_id: defaultInstitutionFilter || '',
    citizenship: 'wni',
    gender: 'male',
    level: defaultLevelFilter,
  };

  const { control, handleSubmit, reset } = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues,
  });

  const { contains } = useFilter({ sensitivity: 'base' });

  const institutions = institutionAllData?.data ?? [];
  const cities = cityAllData?.data ?? [];
  const religions = religionAllData?.data ?? [];
  const members = paginatedData?.data ?? [];
  const paginationMeta = paginatedData?.meta;

  const handleOpenCreateModal = () => {
    setFormMode('create');
    setSelectedMember(null);
    reset(defaultValues);
    formModalState.open();
  };

  const handleOpenEditModal = (member: MemberPaginatedResponse) => {
    setFormMode('edit');
    setSelectedMember(member);
    reset({
      name: member.name,
      phone: member.phone,
      nta: member.nta,
      nik: member.nik,
      talent: member.talent,
      address: member.address,
      father_name: member.father_name,
      mother_name: member.mother_name,
      parent_phone: member.parent_phone,
      parent_address: member.parent_address,
      entry_level: member.entry_level,
      exit_reason: member.exit_reason ?? '',
      birthdate: member.birthdate,
      father_birthdate: member.father_birthdate,
      mother_birthdate: member.mother_birthdate,
      entry_date: member.entry_date,
      exit_date: member.exit_date ?? '',
      father_birthplace: member.father_birthplace,
      mother_birthplace: member.mother_birthplace,
      birthplace: member.birthplace,
      religion: member.religion,
      institution_id: member.institution_id,
      citizenship: member.citizenship,
      gender: member.gender,
      level: member.level,
    });
    formModalState.open();
  };

  const handleCloseFormModal = () => {
    formModalState.close();
    setSelectedMember(null);
  };

  const handleOpenDeleteModal = (member: MemberPaginatedResponse) => {
    setSelectedMember(member);
    deleteModalState.open();
  };

  const handleFormSubmit = async (values: MemberFormValues) => {
    const payload: MemberPayload = {
      ...values,
      exit_reason: values.exit_reason || '',
      exit_date: values.exit_date || '',
    };

    if (formMode === 'create') {
      await toast.promise(createMember.mutateAsync(payload), {
        loading: 'Menyimpan member...',
        success: 'Member berhasil ditambahkan.',
        error: 'Gagal menambahkan member.',
      });

      handleCloseFormModal();
      return;
    }

    if (!selectedMember) {
      return;
    }

    await toast.promise(updateMember.mutateAsync({ id: selectedMember.id, payload }), {
      loading: 'Memperbarui member...',
      success: 'Member berhasil diperbarui.',
      error: 'Gagal memperbarui member.',
    });

    handleCloseFormModal();
  };

  const handleDeleteMember = async () => {
    if (!selectedMember) {
      return;
    }

    await toast.promise(deleteMember.mutateAsync(selectedMember.id), {
      loading: 'Menghapus member...',
      success: 'Member berhasil dihapus.',
      error: 'Gagal menghapus member.',
    });

    deleteModalState.close();
    setSelectedMember(null);
  };

  const columns = useMemo<ColumnDef<MemberPaginatedResponse>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nama',
      },
      {
        accessorKey: 'institution_name',
        header: 'Lembaga',
      },
      {
        accessorKey: 'religion_name',
        header: 'Agama',
      },
      {
        accessorKey: 'gender',
        header: 'Gender',
        cell: ({ row }: { row: { original: MemberPaginatedResponse } }) => (row.original.gender === 'male' ? 'Laki-laki' : 'Perempuan'),
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
        id: 'action',
        header: 'Action',
        cell: ({ row }: { row: { original: MemberPaginatedResponse } }) => (
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
    [session],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Member</h1>
        <Button variant="primary" className="bg-primary-600 hover:bg-primary-600/90" onPress={handleOpenCreateModal}>
          Tambah Member
        </Button>
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

            <SearchField name="search" aria-label="Cari member" value={params.search ?? ''} onChange={(value) => setParams((prev) => ({ ...prev, search: value, page: 1 }))}>
              <SearchField.Group className="h-10 border border-gray-300 shadow-none">
                <SearchField.SearchIcon />
                <SearchField.Input className="w-64" placeholder="Cari nama member..." />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>

            {['super_admin'].includes(session?.user?.role ?? '') && (
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

            {['super_admin', 'admin', 'kwarran'].includes(session?.user?.role ?? '') && (
              <Autocomplete
                aria-label="Filter lembaga"
                placeholder="Search institution"
                selectionMode="single"
                value={params.institution_id ?? ''}
                onChange={(value) => setParams((prev) => ({ ...prev, institution_id: String(value ?? ''), page: 1 }))}
                className="w-64"
              >
                <Autocomplete.Trigger className="h-10 border border-gray-300 shadow-none">
                  <Autocomplete.Value />
                  <Autocomplete.ClearButton />
                  <Autocomplete.Indicator />
                </Autocomplete.Trigger>
                <Autocomplete.Popover>
                  <Autocomplete.Filter filter={contains}>
                    <SearchField autoFocus name="search" variant="secondary" value={institutionSearch} onChange={(value) => setInstitutionSearch(value)}>
                      <SearchField.Group>
                        <SearchField.SearchIcon />
                        <SearchField.Input placeholder="Cari lembaga..." />
                        <SearchField.ClearButton />
                      </SearchField.Group>
                    </SearchField>

                    <ListBox aria-label="Filter lembaga" renderEmptyState={() => <EmptyState>No results found</EmptyState>}>
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
                  </Autocomplete.Filter>
                </Autocomplete.Popover>
              </Autocomplete>
            )}
          </div>
        </div>

        <div className="mt-5">
          <DataTable
            data={members}
            columns={columns}
            ariaLabel="Tabel data member"
            pageSize={params.limit}
            currentPage={paginationMeta?.page ?? params.page}
            totalPages={paginationMeta?.totalPages ?? 1}
            onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
            isLoading={isLoading}
            isError={isError}
            emptyMessage="Belum ada data member."
            errorMessage="Gagal memuat data member. Silakan coba refresh halaman."
            minWidthClassName="min-w-[1120px]"
          />
        </div>
      </div>

      <MemberFormModal
        isOpen={formModalState.isOpen}
        onOpenChange={(isOpen) => {
          formModalState.setOpen(isOpen);
          if (!isOpen) {
            setSelectedMember(null);
          }
        }}
        control={control}
        handleSubmit={handleSubmit}
        onSubmit={handleFormSubmit}
        onCancel={handleCloseFormModal}
        title={formMode === 'create' ? 'Tambah Member' : 'Edit Member'}
        submitText={formMode === 'create' ? 'Simpan Member' : 'Simpan Perubahan'}
        institutionOptions={institutions}
        religionOptions={religions}
        cityOptions={cities}
      />

      <ConfirmationModal
        isOpen={deleteModalState.isOpen}
        onOpenChange={deleteModalState.setOpen}
        icon={<TrashBin className="size-5" />}
        title="Hapus Member"
        description={selectedMember ? `Yakin ingin menghapus member ${selectedMember.name}? Tindakan ini tidak dapat dibatalkan.` : 'Yakin ingin menghapus data ini?'}
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={handleDeleteMember}
      />
    </div>
  );
}
