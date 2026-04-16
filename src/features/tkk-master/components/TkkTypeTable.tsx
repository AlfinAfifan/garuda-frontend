'use client';

import { DataTable } from '@/components/table/DataTable';
import { levelOptions, pageSizeOptions } from '@/lib/main/options';
import { PencilToLine, TrashBin } from '@gravity-ui/icons';
import { Button, ListBox, SearchField, Select } from '@heroui/react';
import { type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

type TkkTypeTableProps = {
  params: TkkTypePaginatedParams;
  onChangeParams: React.Dispatch<React.SetStateAction<TkkTypePaginatedParams>>;
  tkkFieldOptions: TkkFieldAllResponse[];
  showLevelFilter: boolean;
  data: TkkTypePaginatedResponse[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  isLoading: boolean;
  isError: boolean;
  onEdit: (item: TkkTypePaginatedResponse) => void;
  onDelete: (item: TkkTypePaginatedResponse) => void;
};

export function TkkTypeTable({ params, onChangeParams, tkkFieldOptions, showLevelFilter, data, currentPage, totalPages, onPageChange, isLoading, isError, onEdit, onDelete }: TkkTypeTableProps) {
  const columns = useMemo<ColumnDef<TkkTypePaginatedResponse>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nama Tipe TKK',
      },
      {
        accessorKey: 'level',
        header: 'Level',
      },
      {
        accessorKey: 'tkk_field_name',
        header: 'Bidang TKK',
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

          <SearchField name="search-type" aria-label="Cari tipe tkk" value={params.search ?? ''} onChange={(value) => onChangeParams((prev) => ({ ...prev, search: value, page: 1 }))}>
            <SearchField.Group className="h-10 border border-gray-300 shadow-none">
              <SearchField.SearchIcon />
              <SearchField.Input className="w-64" placeholder="Cari tipe TKK..." />
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

          <Select aria-label="Filter bidang tkk" className="w-56" value={params.tkk_field_id ?? ''} onChange={(value) => onChangeParams((prev) => ({ ...prev, tkk_field_id: String(value ?? ''), page: 1 }))}>
            <Select.Trigger className="h-10 border border-gray-300 shadow-none">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox aria-label="Filter bidang tkk">
                <ListBox.Item id="" key="all-field" textValue="Semua bidang">
                  Semua bidang
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                {tkkFieldOptions.map((option) => (
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
        ariaLabel="Tabel data tipe TKK"
        pageSize={params.limit}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="Belum ada data tipe TKK."
        errorMessage="Gagal memuat data tipe TKK."
        minWidthClassName="min-w-[1020px]"
      />
    </div>
  );
}
