'use client';

import { Pagination, Spinner, Table } from '@heroui/react';
import { type ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

type DataTableProps<TData extends object> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  ariaLabel: string;
  pageSize?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  isError?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
  minWidthClassName?: string;
};

export function DataTable<TData extends object>({
  data,
  columns,
  ariaLabel,
  pageSize = 10,
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  isError = false,
  emptyMessage = 'Data tidak tersedia.',
  errorMessage = 'Terjadi kesalahan saat memuat data.',
  minWidthClassName = 'min-w-[820px]',
}: DataTableProps<TData>) {
  const [internalPageIndex, setInternalPageIndex] = useState(0);
  const isServerPagination = typeof currentPage === 'number' && typeof totalPages === 'number' && typeof onPageChange === 'function';

  const table = useReactTable({
    data,
    columns,
    ...(isServerPagination
      ? {
          manualPagination: true,
          pageCount: Math.max(totalPages ?? 1, 1),
        }
      : {
          state: {
            pagination: {
              pageIndex: internalPageIndex,
              pageSize,
            },
          },
          onPaginationChange: (updater: { pageIndex: number; pageSize: number } | ((prev: { pageIndex: number; pageSize: number }) => { pageIndex: number; pageSize: number })) => {
            const next = typeof updater === 'function' ? updater({ pageIndex: internalPageIndex, pageSize }) : updater;
            setInternalPageIndex(next.pageIndex);
          },
          getPaginationRowModel: getPaginationRowModel(),
        }),
    getCoreRowModel: getCoreRowModel(),
  });

  const pageCount = isServerPagination ? Math.max(totalPages ?? 1, 1) : Math.max(table.getPageCount(), 1);
  const currentPageNumber = isServerPagination ? Math.min(Math.max(currentPage ?? 1, 1), pageCount) : internalPageIndex + 1;
  const canPreviousPage = currentPageNumber > 1;
  const canNextPage = currentPageNumber < pageCount;

  const goToPage = (page: number) => {
    if (isServerPagination) {
      onPageChange?.(page);
      return;
    }

    table.setPageIndex(page - 1);
  };

  useEffect(() => {
    if (!isServerPagination && internalPageIndex > pageCount - 1) {
      setInternalPageIndex(Math.max(pageCount - 1, 0));
    }
  }, [isServerPagination, pageCount, internalPageIndex]);

  if (isLoading) {
    return (
      <div className="flex min-h-44 items-center justify-center rounded-2xl border border-slate-200 bg-white/90">
        <Spinner aria-label="Memuat data tabel" />
      </div>
    );
  }

  if (isError) {
    return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{errorMessage}</div>;
  }

  if (!data.length) {
    return <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-6 text-center text-sm text-slate-600">{emptyMessage}</div>;
  }

  const headerGroup = table.getHeaderGroups()[0];

  return (
    <Table variant="secondary" className="rounded-2xl border border-slate-200 bg-white">
      <Table.ScrollContainer>
        <Table.Content aria-label={ariaLabel} className={minWidthClassName}>
          <Table.Header>
            {headerGroup.headers.map((header, columnIndex) => (
              <Table.Column key={header.id} isRowHeader={columnIndex === 0} className="text-sm font-semibold text-slate-700">
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </Table.Column>
            ))}
          </Table.Header>

          <Table.Body>
            {table.getRowModel().rows.map((row) => (
              <Table.Row key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell key={cell.id} className="text-sm text-slate-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>

      {pageCount > 1 && (
        <Table.Footer>
          <Pagination className="w-full" size="sm">
            <Pagination.Summary>
              Halaman {currentPageNumber} dari {pageCount}
            </Pagination.Summary>
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous isDisabled={!canPreviousPage} onPress={() => goToPage(currentPageNumber - 1)}>
                  <Pagination.PreviousIcon />
                </Pagination.Previous>
              </Pagination.Item>

              {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
                <Pagination.Item key={page}>
                  <Pagination.Link isActive={page === currentPageNumber} onPress={() => goToPage(page)}>
                    {page}
                  </Pagination.Link>
                </Pagination.Item>
              ))}

              <Pagination.Item>
                <Pagination.Next isDisabled={!canNextPage} onPress={() => goToPage(currentPageNumber + 1)}>
                  <Pagination.NextIcon />
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </Table.Footer>
      )}
    </Table>
  );
}
