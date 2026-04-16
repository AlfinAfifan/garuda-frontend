'use client';

import { ConfirmationModal } from '@/components/modal/ConfirmationModal';
import { TrashBin } from '@gravity-ui/icons';
import { Button, Tabs, toast, useOverlayState } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useCityAll, useCityPaginated, useCreateCity, useDeleteCity, useUpdateCity } from '../hooks/useCity';
import { useCreateDistrict, useDeleteDistrict, useDistrictPaginated, useUpdateDistrict } from '../hooks/useDistrict';
import { useCreateProvince, useDeleteProvince, useProvinceAll, useProvincePaginated, useUpdateProvince } from '../hooks/useProvince';
import { cityFormSchema, type CityFormValues } from '../schemas/city.schema';
import { districtFormSchema, type DistrictFormValues } from '../schemas/district.schema';
import { provinceFormSchema, type ProvinceFormValues } from '../schemas/province.schema';
import { CityFormModal } from './CityFormModal';
import { CityTable } from './CityTable';
import { DistrictFormModal } from './DistrictFormModal';
import { DistrictTable } from './DistrictTable';
import { ProvinceFormModal } from './ProvinceFormModal';
import { ProvinceTable } from './ProvinceTable';

type RegionTabKey = 'province' | 'city' | 'district';
type RegionFormMode = 'create' | 'edit';

export function RegionContent() {
  const formModalState = useOverlayState();
  const deleteModalState = useOverlayState();

  const [activeTab, setActiveTab] = useState<RegionTabKey>('province');
  const [formMode, setFormMode] = useState<RegionFormMode>('create');

  const [provinceParams, setProvinceParams] = useState<BaseParams>({ page: 1, limit: 10, search: '' });
  const [cityParams, setCityParams] = useState<CityPaginatedParams>({ page: 1, limit: 10, search: '', province_id: '' });
  const [districtParams, setDistrictParams] = useState<DistrictPaginatedParams>({ page: 1, limit: 10, search: '', city_id: '' });

  const [selectedProvince, setSelectedProvince] = useState<ProvincePaginatedResponse | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityPaginatedResponse | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictPaginatedResponse | null>(null);

  const provinceForm = useForm<ProvinceFormValues>({
    resolver: zodResolver(provinceFormSchema),
    defaultValues: { name: '' },
  });

  const cityForm = useForm<CityFormValues>({
    resolver: zodResolver(cityFormSchema),
    defaultValues: { name: '', province_id: '' },
  });

  const districtForm = useForm<DistrictFormValues>({
    resolver: zodResolver(districtFormSchema),
    defaultValues: { name: '', city_id: '' },
  });

  const { data: provincePaginatedData, isLoading: isProvinceLoading, isError: isProvinceError } = useProvincePaginated(provinceParams);
  const { data: cityPaginatedData, isLoading: isCityLoading, isError: isCityError } = useCityPaginated(cityParams);
  const { data: districtPaginatedData, isLoading: isDistrictLoading, isError: isDistrictError } = useDistrictPaginated(districtParams);

  const { data: provinceAllData } = useProvinceAll();
  const { data: cityAllData } = useCityAll();

  const createProvince = useCreateProvince();
  const updateProvince = useUpdateProvince();
  const deleteProvince = useDeleteProvince();

  const createCity = useCreateCity();
  const updateCity = useUpdateCity();
  const deleteCity = useDeleteCity();

  const createDistrict = useCreateDistrict();
  const updateDistrict = useUpdateDistrict();
  const deleteDistrict = useDeleteDistrict();

  const provinceOptions = provinceAllData?.data ?? [];
  const cityOptions = cityAllData?.data ?? [];

  const provinces = provincePaginatedData?.data ?? [];
  const cities = cityPaginatedData?.data ?? [];
  const districts = districtPaginatedData?.data ?? [];
  const provincePaginationMeta = provincePaginatedData?.meta;
  const cityPaginationMeta = cityPaginatedData?.meta;
  const districtPaginationMeta = districtPaginatedData?.meta;

  const resetSelection = () => {
    setSelectedProvince(null);
    setSelectedCity(null);
    setSelectedDistrict(null);
  };

  const closeFormModal = () => {
    formModalState.close();
    resetSelection();
  };

  const openCreateModal = () => {
    setFormMode('create');
    resetSelection();

    if (activeTab === 'province') {
      provinceForm.reset({ name: '' });
    }

    if (activeTab === 'city') {
      cityForm.reset({ name: '', province_id: cityParams.province_id ?? '' });
    }

    if (activeTab === 'district') {
      districtForm.reset({ name: '', city_id: districtParams.city_id ?? '' });
    }

    formModalState.open();
  };

  const openEditProvinceModal = (province: ProvincePaginatedResponse) => {
    setActiveTab('province');
    setFormMode('edit');
    setSelectedProvince(province);
    setSelectedCity(null);
    setSelectedDistrict(null);
    provinceForm.reset({ name: province.name });
    formModalState.open();
  };

  const openEditCityModal = (city: CityPaginatedResponse) => {
    setActiveTab('city');
    setFormMode('edit');
    setSelectedCity(city);
    setSelectedProvince(null);
    setSelectedDistrict(null);
    cityForm.reset({ name: city.name, province_id: city.province_id });
    formModalState.open();
  };

  const openEditDistrictModal = (district: DistrictPaginatedResponse) => {
    setActiveTab('district');
    setFormMode('edit');
    setSelectedDistrict(district);
    setSelectedProvince(null);
    setSelectedCity(null);
    districtForm.reset({ name: district.name, city_id: district.city_id });
    formModalState.open();
  };

  const openDeleteProvinceModal = (province: ProvincePaginatedResponse) => {
    setActiveTab('province');
    setSelectedProvince(province);
    setSelectedCity(null);
    setSelectedDistrict(null);
    deleteModalState.open();
  };

  const openDeleteCityModal = (city: CityPaginatedResponse) => {
    setActiveTab('city');
    setSelectedCity(city);
    setSelectedProvince(null);
    setSelectedDistrict(null);
    deleteModalState.open();
  };

  const openDeleteDistrictModal = (district: DistrictPaginatedResponse) => {
    setActiveTab('district');
    setSelectedDistrict(district);
    setSelectedProvince(null);
    setSelectedCity(null);
    deleteModalState.open();
  };

  const handleProvinceSubmit = async (values: ProvinceFormValues) => {
    if (formMode === 'create') {
      await toast.promise(createProvince.mutateAsync(values), {
        loading: 'Menyimpan provinsi...',
        success: 'Provinsi berhasil ditambahkan.',
        error: 'Gagal menambahkan provinsi.',
      });
      closeFormModal();
      return;
    }

    if (!selectedProvince) {
      return;
    }

    await toast.promise(updateProvince.mutateAsync({ id: selectedProvince.id, payload: values }), {
      loading: 'Memperbarui provinsi...',
      success: 'Provinsi berhasil diperbarui.',
      error: 'Gagal memperbarui provinsi.',
    });

    closeFormModal();
  };

  const handleCitySubmit = async (values: CityFormValues) => {
    if (formMode === 'create') {
      await toast.promise(createCity.mutateAsync(values), {
        loading: 'Menyimpan kota...',
        success: 'Kota berhasil ditambahkan.',
        error: 'Gagal menambahkan kota.',
      });
      closeFormModal();
      return;
    }

    if (!selectedCity) {
      return;
    }

    await toast.promise(updateCity.mutateAsync({ id: selectedCity.id, payload: values }), {
      loading: 'Memperbarui kota...',
      success: 'Kota berhasil diperbarui.',
      error: 'Gagal memperbarui kota.',
    });

    closeFormModal();
  };

  const handleDistrictSubmit = async (values: DistrictFormValues) => {
    if (formMode === 'create') {
      await toast.promise(createDistrict.mutateAsync(values), {
        loading: 'Menyimpan kecamatan...',
        success: 'Kecamatan berhasil ditambahkan.',
        error: 'Gagal menambahkan kecamatan.',
      });
      closeFormModal();
      return;
    }

    if (!selectedDistrict) {
      return;
    }

    await toast.promise(updateDistrict.mutateAsync({ id: selectedDistrict.id, payload: values }), {
      loading: 'Memperbarui kecamatan...',
      success: 'Kecamatan berhasil diperbarui.',
      error: 'Gagal memperbarui kecamatan.',
    });

    closeFormModal();
  };

  const handleDelete = async () => {
    if (activeTab === 'province' && selectedProvince) {
      await toast.promise(deleteProvince.mutateAsync(selectedProvince.id), {
        loading: 'Menghapus provinsi...',
        success: 'Provinsi berhasil dihapus.',
        error: 'Gagal menghapus provinsi.',
      });
    }

    if (activeTab === 'city' && selectedCity) {
      await toast.promise(deleteCity.mutateAsync(selectedCity.id), {
        loading: 'Menghapus kota...',
        success: 'Kota berhasil dihapus.',
        error: 'Gagal menghapus kota.',
      });
    }

    if (activeTab === 'district' && selectedDistrict) {
      await toast.promise(deleteDistrict.mutateAsync(selectedDistrict.id), {
        loading: 'Menghapus kecamatan...',
        success: 'Kecamatan berhasil dihapus.',
        error: 'Gagal menghapus kecamatan.',
      });
    }

    deleteModalState.close();
    resetSelection();
  };

  const currentEntityName = activeTab === 'province' ? 'Provinsi' : activeTab === 'city' ? 'Kota' : 'Kecamatan';
  const selectedEntityName = activeTab === 'province' ? selectedProvince?.name : activeTab === 'city' ? selectedCity?.name : selectedDistrict?.name;
  const addButtonLabel = activeTab === 'province' ? 'Tambah Province' : activeTab === 'city' ? 'Tambah City' : 'Tambah District';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Wilayah</h1>
        <Button variant="primary" className="bg-primary-600 hover:bg-primary-600/90" onPress={openCreateModal}>
          {addButtonLabel}
        </Button>
      </div>

      <Tabs selectedKey={activeTab} onSelectionChange={(key) => setActiveTab(key as RegionTabKey)} className="w-full">
        <Tabs.ListContainer>
          <Tabs.List aria-label="Pilih tipe region" className="*:data-[selected=true]:text-accent-foreground">
            <Tabs.Tab id="province">
              Province
              <Tabs.Indicator className="bg-primary-500" />
            </Tabs.Tab>
            <Tabs.Tab id="city">
              City
              <Tabs.Indicator className="bg-primary-500" />
            </Tabs.Tab>
            <Tabs.Tab id="district">
              District
              <Tabs.Indicator className="bg-primary-500" />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>

        <Tabs.Panel id="province" className="mt-5">
          <ProvinceTable
            params={provinceParams}
            onChangeParams={setProvinceParams}
            data={provinces}
            currentPage={provincePaginationMeta?.page ?? provinceParams.page}
            totalPages={provincePaginationMeta?.totalPages ?? 1}
            onPageChange={(page) => setProvinceParams((prev) => ({ ...prev, page }))}
            isLoading={isProvinceLoading}
            isError={isProvinceError}
            onEdit={openEditProvinceModal}
            onDelete={openDeleteProvinceModal}
          />
        </Tabs.Panel>

        <Tabs.Panel id="city" className="mt-5">
          <CityTable
            params={cityParams}
            onChangeParams={setCityParams}
            provinceOptions={provinceOptions}
            data={cities}
            currentPage={cityPaginationMeta?.page ?? cityParams.page}
            totalPages={cityPaginationMeta?.totalPages ?? 1}
            onPageChange={(page) => setCityParams((prev) => ({ ...prev, page }))}
            isLoading={isCityLoading}
            isError={isCityError}
            onEdit={openEditCityModal}
            onDelete={openDeleteCityModal}
          />
        </Tabs.Panel>

        <Tabs.Panel id="district" className="mt-5">
          <DistrictTable
            params={districtParams}
            onChangeParams={setDistrictParams}
            cityOptions={cityOptions}
            data={districts}
            currentPage={districtPaginationMeta?.page ?? districtParams.page}
            totalPages={districtPaginationMeta?.totalPages ?? 1}
            onPageChange={(page) => setDistrictParams((prev) => ({ ...prev, page }))}
            isLoading={isDistrictLoading}
            isError={isDistrictError}
            onEdit={openEditDistrictModal}
            onDelete={openDeleteDistrictModal}
          />
        </Tabs.Panel>
      </Tabs>

      {activeTab === 'province' && (
        <ProvinceFormModal
          isOpen={formModalState.isOpen}
          onOpenChange={(isOpen) => {
            formModalState.setOpen(isOpen);
            if (!isOpen) {
              resetSelection();
            }
          }}
          control={provinceForm.control}
          handleSubmit={provinceForm.handleSubmit}
          onSubmit={handleProvinceSubmit}
          onCancel={closeFormModal}
          title={formMode === 'create' ? 'Tambah Provinsi' : 'Edit Provinsi'}
          submitText={formMode === 'create' ? 'Simpan Provinsi' : 'Simpan Perubahan'}
        />
      )}

      {activeTab === 'city' && (
        <CityFormModal
          isOpen={formModalState.isOpen}
          onOpenChange={(isOpen) => {
            formModalState.setOpen(isOpen);
            if (!isOpen) {
              resetSelection();
            }
          }}
          control={cityForm.control}
          handleSubmit={cityForm.handleSubmit}
          onSubmit={handleCitySubmit}
          onCancel={closeFormModal}
          title={formMode === 'create' ? 'Tambah Kota' : 'Edit Kota'}
          submitText={formMode === 'create' ? 'Simpan Kota' : 'Simpan Perubahan'}
          provinceOptions={provinceOptions}
        />
      )}

      {activeTab === 'district' && (
        <DistrictFormModal
          isOpen={formModalState.isOpen}
          onOpenChange={(isOpen) => {
            formModalState.setOpen(isOpen);
            if (!isOpen) {
              resetSelection();
            }
          }}
          control={districtForm.control}
          handleSubmit={districtForm.handleSubmit}
          onSubmit={handleDistrictSubmit}
          onCancel={closeFormModal}
          title={formMode === 'create' ? 'Tambah Kecamatan' : 'Edit Kecamatan'}
          submitText={formMode === 'create' ? 'Simpan Kecamatan' : 'Simpan Perubahan'}
          cityOptions={cityOptions}
        />
      )}

      <ConfirmationModal
        isOpen={deleteModalState.isOpen}
        onOpenChange={deleteModalState.setOpen}
        icon={<TrashBin className="size-5" />}
        title={`Hapus ${currentEntityName}`}
        description={selectedEntityName ? `Yakin ingin menghapus ${currentEntityName.toLowerCase()} ${selectedEntityName}? Tindakan ini tidak dapat dibatalkan.` : 'Yakin ingin menghapus data ini?'}
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={handleDelete}
      />
    </div>
  );
}
