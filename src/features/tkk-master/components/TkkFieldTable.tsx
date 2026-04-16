'use client';

import { DataTable } from '@/components/table/DataTable';
import { levelOptions, pageSizeOptions } from '@/lib/main/options';
import { PencilToLine, TrashBin } from '@gravity-ui/icons';
import { Button, ListBox, SearchField, Select } from '@heroui/react';
import { type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

type TkkFieldTableProps = {
  params: TkkFieldPaginatedParams;
  onChangeParams: React.Dispatch<React.SetStateAction<TkkFieldPaginatedParams>>;
  showLevelFilter: boolean;
  data: TkkFieldPaginatedResponse[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  isLoading: boolean;
  isError: boolean;
  onEdit: (item: TkkFieldPaginatedResponse) => void;
  onDelete: (item: TkkFieldPaginatedResponse) => void;
};

export function TkkFieldTable({ params, onChangeParams, showLevelFilter, data, currentPage, totalPages, onPageChange, isLoading, isError, onEdit, onDelete }: TkkFieldTableProps) {
  const columns = useMemo<ColumnDef<TkkFieldPaginatedResponse>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nama Bidang TKK',
      },
      {
        accessorKey: 'level',
        header: 'Level',
      },
      {
        accessorKey: 'color',
        header: 'Warna',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="inline-block size-3 rounded-full border border-slate-300" style={{ backgroundColor: row.original.color }} />
            <span>{row.original.color}</span>
          </div>
        ),
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

          <SearchField name="search-field" aria-label="Cari bidang tkk" value={params.search ?? ''} onChange={(value) => onChangeParams((prev) => ({ ...prev, search: value, page: 1 }))}>
            <SearchField.Group className="h-10 border border-gray-300 shadow-none">
              <SearchField.SearchIcon />
              <SearchField.Input className="w-64" placeholder="Cari bidang TKK..." />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>

          {showLevelFilter && (
            <Select aria-label="Filter level" className="w-44" value={params.level ?? ''} onChange={(value) => onChangeParams((prev) => ({ ...prev, level: String(value ?? ''), page: 1 }))}>
              <Select.Trigger className="h-10 border border-gray-300 shadow-none">
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox aria-label="Filter level">
                  <ListBox.Item id="" key="all-level" textValue="Semua level">
                    Semua
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
        </div>
      </div>

      <DataTable
        data={data}
        columns={columns}
        ariaLabel="Tabel data bidang TKK"
        pageSize={params.limit}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="Belum ada data bidang TKK."
        errorMessage="Gagal memuat data bidang TKK."
        minWidthClassName="min-w-[920px]"
      />
    </div>
  );
}
