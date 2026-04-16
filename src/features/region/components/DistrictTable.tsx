'use client';

import { DataTable } from '@/components/table/DataTable';
import { pageSizeOptions } from '@/lib/main/options';
import { PencilToLine, TrashBin } from '@gravity-ui/icons';
import { Button, ListBox, SearchField, Select } from '@heroui/react';
import { type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

type DistrictTableProps = {
  params: DistrictPaginatedParams;
  onChangeParams: React.Dispatch<React.SetStateAction<DistrictPaginatedParams>>;
  cityOptions: CityAllResponse[];
  data: DistrictPaginatedResponse[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  isLoading: boolean;
  isError: boolean;
  onEdit: (district: DistrictPaginatedResponse) => void;
  onDelete: (district: DistrictPaginatedResponse) => void;
};

export function DistrictTable({ params, onChangeParams, cityOptions, data, currentPage, totalPages, onPageChange, isLoading, isError, onEdit, onDelete }: DistrictTableProps) {
  const columns = useMemo<ColumnDef<DistrictPaginatedResponse>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nama Kecamatan',
      },
      {
        accessorKey: 'city_name',
        header: 'Kota',
      },
      {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button isIconOnly size="sm" variant="secondary" onPress={() => onEdit(row.original)}>
              <PencilToLine className="size-4" />
            </Button>
            <Button isIconOnly size="sm" variant="danger" onPress={() => onDelete(row.original)}>
              <TrashBin className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    [onDelete, onEdit],
  );

  return (
    <div className="rounded-4xl bg-white p-6 shadow space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-4">
          <Select aria-label="Jumlah data kecamatan per halaman" className="w-20" placeholder="Select one" value={String(params.limit)} onChange={(value) => onChangeParams((prev) => ({ ...prev, limit: Number(value), page: 1 }))}>
            <Select.Trigger className="h-10 border border-gray-300 shadow-none">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox aria-label="Pilihan jumlah data per halaman kecamatan">
                {pageSizeOptions.map((option) => (
                  <ListBox.Item key={option.value.toString()} id={option.value.toString()} textValue={option.label}>
                    {option.label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          <SearchField name="district-search" aria-label="Cari kecamatan" value={params.search ?? ''} onChange={(value) => onChangeParams((prev) => ({ ...prev, search: value, page: 1 }))}>
            <SearchField.Group className="h-10 border border-gray-300 shadow-none">
              <SearchField.SearchIcon />
              <SearchField.Input className="w-64" placeholder="Cari nama kecamatan..." />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>

          <Select aria-label="Filter kota" className="w-56" placeholder="Semua kota" value={params.city_id ?? ''} onChange={(value) => onChangeParams((prev) => ({ ...prev, city_id: String(value ?? ''), page: 1 }))}>
            <Select.Trigger className="h-10 border border-gray-300 shadow-none">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox aria-label="Filter data berdasarkan kota">
                <ListBox.Item id="" key="all-city" textValue="Semua kota">
                  Semua kota
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                {cityOptions.map((option) => (
                  <ListBox.Item key={option.id} id={option.id} textValue={option.name}>
                    {option.name}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </div>

      <DataTable
        data={data}
        columns={columns}
        ariaLabel="Tabel data kecamatan"
        pageSize={params.limit}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="Belum ada data kecamatan."
        errorMessage="Gagal memuat data kecamatan. Silakan coba refresh halaman."
        minWidthClassName="min-w-[840px]"
      />
    </div>
  );
}
