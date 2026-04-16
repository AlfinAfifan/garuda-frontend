'use client';

import { DataTable } from '@/components/table/DataTable';
import { pageSizeOptions } from '@/lib/main/options';
import { PencilToLine, TrashBin } from '@gravity-ui/icons';
import { Button, ListBox, SearchField, Select } from '@heroui/react';
import { type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

type ProvinceTableProps = {
  params: BaseParams;
  onChangeParams: React.Dispatch<React.SetStateAction<BaseParams>>;
  data: ProvincePaginatedResponse[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  isLoading: boolean;
  isError: boolean;
  onEdit: (province: ProvincePaginatedResponse) => void;
  onDelete: (province: ProvincePaginatedResponse) => void;
};

export function ProvinceTable({ params, onChangeParams, data, currentPage, totalPages, onPageChange, isLoading, isError, onEdit, onDelete }: ProvinceTableProps) {
  const columns = useMemo<ColumnDef<ProvincePaginatedResponse>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nama Provinsi',
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
          <Select aria-label="Jumlah data provinsi per halaman" className="w-20" placeholder="Select one" value={String(params.limit)} onChange={(value) => onChangeParams((prev) => ({ ...prev, limit: Number(value), page: 1 }))}>
            <Select.Trigger className="h-10 border border-gray-300 shadow-none">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox aria-label="Pilihan jumlah data per halaman provinsi">
                {pageSizeOptions.map((option) => (
                  <ListBox.Item key={option.value.toString()} id={option.value.toString()} textValue={option.label}>
                    {option.label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          <SearchField name="province-search" aria-label="Cari provinsi" value={params.search ?? ''} onChange={(value) => onChangeParams((prev) => ({ ...prev, search: value, page: 1 }))}>
            <SearchField.Group className="h-10 border border-gray-300 shadow-none">
              <SearchField.SearchIcon />
              <SearchField.Input className="w-64" placeholder="Cari nama provinsi..." />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
        </div>
      </div>

      <DataTable
        data={data}
        columns={columns}
        ariaLabel="Tabel data provinsi"
        pageSize={params.limit}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="Belum ada data provinsi."
        errorMessage="Gagal memuat data provinsi. Silakan coba refresh halaman."
        minWidthClassName="min-w-[760px]"
      />
    </div>
  );
}
