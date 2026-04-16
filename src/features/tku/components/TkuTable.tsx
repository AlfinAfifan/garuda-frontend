'use client';

import { DataTable } from '@/components/table/DataTable';
import { pageSizeOptions } from '@/lib/main/options';
import { ArrowRight, TrashBin } from '@gravity-ui/icons';
import { Button, ListBox, SearchField, Select } from '@heroui/react';
import { type ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { useMemo } from 'react';

type TkuTableProps = {
  data: TkuPaginatedResponse[];
  isLoading?: boolean;
  isError?: boolean;
  params: TkuPaginatedParams;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onChangeParams: React.Dispatch<React.SetStateAction<TkuPaginatedParams>>;
  selectedIds: string[];
  onToggleRowSelection: (id: string, checked: boolean) => void;
  onToggleSelectAll: (checked: boolean) => void;
  onDelete: (item: TkuPaginatedResponse) => void;
  onLevelUp: (item: TkuPaginatedResponse) => void;
  canLevelUp: boolean;
};

export function TkuTable({ data, isLoading = false, isError = false, params, currentPage, totalPages, onPageChange, onChangeParams, selectedIds, onToggleRowSelection, onToggleSelectAll, onDelete, onLevelUp, canLevelUp }: TkuTableProps) {
  const isAllSelected = data.length > 0 && data.every((item) => selectedIds.includes(item.id));

  const columns = useMemo<ColumnDef<TkuPaginatedResponse>[]>(
    () => [
      {
        accessorKey: 'member_name',
        header: 'Nama Anggota',
      },
      {
        accessorKey: 'institution_name',
        header: 'Lembaga',
      },
      {
        accessorKey: 'sk_number',
        header: 'No. SK',
        cell: ({ row }) => row.original.sk_number || '-',
      },
      {
        accessorKey: 'sk_date',
        header: 'Tanggal SK',
        cell: ({ row }) => dayjs(row.original.sk_date).format('DD MMM YYYY') || '-',
      },
      {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {canLevelUp && (
              <Button isIconOnly size="sm" variant="outline" className="border-primary-500 text-primary-600" onPress={() => onLevelUp(row.original)}>
                <ArrowRight className="size-4" />
              </Button>
            )}
            <Button isIconOnly size="sm" variant="danger" onPress={() => onDelete(row.original)}>
              <TrashBin className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    [canLevelUp, isAllSelected, onDelete, onLevelUp, onToggleRowSelection, onToggleSelectAll, selectedIds],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <Select aria-label="Jumlah data per halaman" className="w-20" value={String(params.limit)} onChange={(value) => onChangeParams((prev) => ({ ...prev, limit: Number(value), page: 1 }))}>
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

        <SearchField name="search" aria-label="Cari data TKU" value={params.search ?? ''} onChange={(value) => onChangeParams((prev) => ({ ...prev, search: value, page: 1 }))}>
          <SearchField.Group className="h-10 border border-gray-300 shadow-none">
            <SearchField.SearchIcon />
            <SearchField.Input className="w-72" placeholder="Cari nama anggota..." />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
      </div>

      <DataTable
        data={data}
        columns={columns}
        ariaLabel="Tabel data TKU"
        pageSize={params.limit}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        isLoading={isLoading}
        isError={isError}
        minWidthClassName="min-w-[980px]"
      />
    </div>
  );
}
