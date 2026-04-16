'use client';

import { levelOptions } from '@/lib/main/options';
import { ListBox, Select, Skeleton } from '@heroui/react';
import { useEffect, useMemo, useState } from 'react';

import { useDashboard } from '../hooks/useDashboard';

type DashboardCardItem = {
  label: string;
  value: number;
  accentClass: string;
};

export function DashboardContent() {
  const [level, setLevel] = useState<string>('');
  const [year, setYear] = useState<number>(0);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const { data, isLoading, isError } = useDashboard({ level, year });

  const yearOptions = useMemo(() => {
    const currentYear = year || new Date().getFullYear();

    return Array.from({ length: 6 }, (_, index) => currentYear - index);
  }, [year]);

  const overview = data?.data;
  const cards = overview?.cards;
  const charts = overview?.charts;

  const dashboardCards = useMemo<DashboardCardItem[]>(
    () => [
      { label: 'Total Lembaga', value: cards?.total_institutions ?? 0, accentClass: 'text-blue-600' },
      { label: 'Total Member', value: cards?.total_members ?? 0, accentClass: 'text-emerald-600' },
      { label: 'Total TKU', value: cards?.total_tku ?? 0, accentClass: 'text-amber-600' },
      { label: 'Total TKK', value: cards?.total_tkk ?? 0, accentClass: 'text-fuchsia-600' },
      { label: 'Total Garuda', value: cards?.total_garuda ?? 0, accentClass: 'text-cyan-600' },
      { label: 'Garuda Approved', value: cards?.total_garuda_approved ?? 0, accentClass: 'text-green-700' },
    ],
    [cards],
  );

  const membersByLevel = useMemo(
    () => [
      { label: 'Siaga', value: charts?.members_by_level.siaga ?? 0, colorClass: 'bg-blue-500' },
      { label: 'Penggalang', value: charts?.members_by_level.penggalang ?? 0, colorClass: 'bg-emerald-500' },
      { label: 'Penegak', value: charts?.members_by_level.penegak ?? 0, colorClass: 'bg-amber-500' },
    ],
    [charts],
  );

  const tkuByLevel = useMemo(
    () => [
      { label: 'Mula', value: charts?.tku_by_level.mula ?? 0 },
      { label: 'Bantu', value: charts?.tku_by_level.bantu ?? 0 },
      { label: 'Tata', value: charts?.tku_by_level.tata ?? 0 },
      { label: 'Ramu', value: charts?.tku_by_level.ramu ?? 0 },
      { label: 'Rakit', value: charts?.tku_by_level.rakit ?? 0 },
      { label: 'Terap', value: charts?.tku_by_level.terap ?? 0 },
      { label: 'Bantara', value: charts?.tku_by_level.bantara ?? 0 },
      { label: 'Laksana', value: charts?.tku_by_level.laksana ?? 0 },
    ],
    [charts],
  );

  const tkkByLevel = useMemo(
    () => [
      { label: 'Siaga', value: charts?.tkk_by_level.siaga ?? 0, colorClass: 'bg-sky-500' },
      { label: 'Purwa', value: charts?.tkk_by_level.purwa ?? 0, colorClass: 'bg-violet-500' },
      { label: 'Madya', value: charts?.tkk_by_level.madya ?? 0, colorClass: 'bg-rose-500' },
      { label: 'Utama', value: charts?.tkk_by_level.utama ?? 0, colorClass: 'bg-lime-500' },
    ],
    [charts],
  );

  const monthlyMembers = charts?.monthly_new_members ?? [];

  const maxMembersByLevel = Math.max(...membersByLevel.map((item) => item.value), 1);
  const maxTkuByLevel = Math.max(...tkuByLevel.map((item) => item.value), 1);
  const maxMonthlyMembers = Math.max(...monthlyMembers.map((item) => item.total), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>

        <div className="flex flex-wrap gap-3">
          <Select aria-label="Filter tahun dashboard" className="w-32" value={String(year)} onChange={(value) => setYear(Number(value))}>
            <Select.Trigger className="h-10 border border-gray-300 shadow-none">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox aria-label="Filter tahun dashboard">
                {yearOptions.map((option) => (
                  <ListBox.Item key={option.toString()} id={option.toString()} textValue={option.toString()}>
                    {option}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          <Select aria-label="Filter level dashboard" className="w-44" value={level} onChange={(value) => setLevel(String(value ?? ''))}>
            <Select.Trigger className="h-10 border border-gray-300 shadow-none">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox aria-label="Filter level dashboard">
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
        </div>
      </div>

      {isLoading && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="rounded-3xl bg-white p-5 shadow">
                <Skeleton className="mb-3 h-4 w-24 rounded-lg" />
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-5 shadow">
              <Skeleton className="mb-4 h-6 w-32 rounded-lg" />
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index}>
                    <Skeleton className="mb-2 h-3 w-20 rounded-full" />
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow">
              <Skeleton className="mb-4 h-6 w-28 rounded-lg" />
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="rounded-2xl border border-slate-200 p-3">
                    <Skeleton className="mb-2 h-4 w-16 rounded-lg" />
                    <Skeleton className="h-6 w-12 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-5 shadow">
              <Skeleton className="mb-4 h-6 w-32 rounded-lg" />
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Skeleton className="h-3 w-16 rounded-lg" />
                    <Skeleton className="h-2 flex-1 rounded-full" />
                    <Skeleton className="h-3 w-12 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow">
              <Skeleton className="mb-4 h-6 w-40 rounded-lg" />
              <div className="flex h-56 items-end gap-2">
                {Array.from({ length: 12 }).map((_, index) => {
                  const heights = [35, 55, 45, 65, 40, 70, 50, 60, 48, 75, 52, 58];
                  return <Skeleton key={index} className="w-full rounded-t-md" style={{ height: `${heights[index]}%` }} />;
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {isError && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">Gagal memuat data dashboard. Silakan coba refresh halaman.</div>}

      {!isLoading && !isError && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dashboardCards.map((card) => (
              <div key={card.label} className="rounded-3xl bg-white p-5 shadow">
                <p className="text-sm text-slate-500">{card.label}</p>
                <p className={`mt-2 text-3xl font-bold ${card.accentClass}`}>{card.value.toLocaleString('id-ID')}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-5 shadow">
              <h2 className="text-lg font-semibold text-slate-900">Member per Level</h2>
              <div className="mt-4 space-y-4">
                {membersByLevel.map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{item.label}</span>
                      <span className="text-slate-500">{item.value}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100">
                      <div className={`h-2 rounded-full ${item.colorClass}`} style={{ width: `${(item.value / maxMembersByLevel) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow">
              <h2 className="text-lg font-semibold text-slate-900">TKK per Level</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {tkkByLevel.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200 p-3">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block h-3 w-3 rounded-full ${item.colorClass}`} />
                      <p className="text-sm font-medium text-slate-700">{item.label}</p>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-5 shadow">
              <h2 className="text-lg font-semibold text-slate-900">Distribusi TKU</h2>
              <div className="mt-4 space-y-3">
                {tkuByLevel.map((item) => (
                  <div key={item.label} className="grid grid-cols-[90px_1fr_56px] items-center gap-3 text-sm">
                    <span className="font-medium text-slate-600">{item.label}</span>
                    <div className="h-2 w-full rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-primary-500" style={{ width: `${(item.value / maxTkuByLevel) * 100}%` }} />
                    </div>
                    <span className="text-right text-slate-500">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow">
              <h2 className="text-lg font-semibold text-slate-900">Member Baru Bulanan</h2>
              <div className="mt-6 flex h-56 items-end gap-2">
                {monthlyMembers.map((item) => (
                  <div key={item.month} className="group flex min-w-0 flex-1 flex-col items-center gap-2">
                    <div className="w-full rounded-t-md bg-primary-500/85 transition group-hover:bg-primary-500" style={{ height: `${Math.max((item.total / maxMonthlyMembers) * 100, 4)}%` }} />
                    <p className="w-full truncate text-center text-xs text-slate-500" title={item.month}>
                      {item.month}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
