'use client';

import { levelOptions } from '@/lib/main/options';
import { Autocomplete, Button, EmptyState, FieldError, Input, Label, ListBox, Modal, SearchField, Select, TextArea, TextField, useFilter } from '@heroui/react';
import { useState } from 'react';
import { Controller, type Control, type SubmitHandler, type UseFormHandleSubmit } from 'react-hook-form';

import type { InstitutionFormValues } from '../schemas/institution.schema';

type InstitutionFormModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  control: Control<InstitutionFormValues>;
  handleSubmit: UseFormHandleSubmit<InstitutionFormValues>;
  onSubmit: SubmitHandler<InstitutionFormValues>;
  onCancel: () => void;
  title?: string;
  submitText?: string;
  districtOptions: DistrictAllResponse[];
  onDistrictSearchChange?: (search: string) => void;
  userRole?: string;
  userLevel?: string;
  userDistrictId?: string;
};

export function InstitutionFormModal({
  isOpen,
  onOpenChange,
  control,
  handleSubmit,
  onSubmit,
  onCancel,
  title = 'Edit Lembaga',
  submitText = 'Simpan',
  districtOptions,
  onDistrictSearchChange,
  userRole,
  userLevel,
  userDistrictId,
}: InstitutionFormModalProps) {
  const [districtSearch, setDistrictSearch] = useState('');
  const { contains } = useFilter({ sensitivity: 'base' });
  const fieldClassName = 'h-10 border border-gray-300 shadow-none data-[focus-within=true]:border-primary-500 data-[focus-within=true]:ring-2 data-[focus-within=true]:ring-primary-500/20';

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container scroll="inside">
        <Modal.Dialog className="sm:max-w-180">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading className="text-xl font-semibold">{title}</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="my-5">
            <form id="institution-form" className="grid grid-cols-1 gap-5 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
              <Controller
                control={control}
                name="name"
                render={({ field, fieldState }) => (
                  <TextField className="w-full md:col-span-2" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>Nama Lembaga</Label>
                    <Input value={field.value} placeholder="Masukkan nama lembaga" className={fieldClassName} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              {userRole === 'super_admin' ? (
                <Controller
                  control={control}
                  name="level"
                  render={({ field, fieldState }) => (
                    <Select aria-label="Level lembaga" className="w-full" value={field.value} onChange={(value) => field.onChange(String(value ?? ''))} isInvalid={!!fieldState.error}>
                      <Label>Level</Label>
                      <Select.Trigger className={fieldClassName}>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox aria-label="Pilihan level lembaga">
                          {levelOptions.map((option) => (
                            <ListBox.Item key={option.value} id={option.value} textValue={option.label}>
                              {option.label}
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Select>
                  )}
                />
              ) : (
                <Controller control={control} name="level" render={({ field }) => <input {...field} type="hidden" value={userLevel ?? ''} />} />
              )}

              {['super_admin', 'admin'].includes(userRole ?? '') ? (
                <Controller
                  control={control}
                  name="district_id"
                  render={({ field, fieldState }) => (
                    <TextField className="w-full" isInvalid={!!fieldState.error}>
                      <Label>Kecamatan</Label>
                      <Autocomplete aria-label="Kecamatan lembaga" placeholder="Pilih kecamatan" selectionMode="single" value={field.value} onChange={(value) => field.onChange(String(value ?? ''))} className="w-full">
                        <Autocomplete.Trigger className={fieldClassName}>
                          <Autocomplete.Value />
                          <Autocomplete.ClearButton />
                          <Autocomplete.Indicator />
                        </Autocomplete.Trigger>
                        <Autocomplete.Popover>
                          <Autocomplete.Filter filter={contains}>
                            <SearchField
                              autoFocus
                              name="search"
                              variant="secondary"
                              value={districtSearch}
                              onChange={(value) => {
                                setDistrictSearch(value);
                                onDistrictSearchChange?.(value);
                              }}
                            >
                              <SearchField.Group>
                                <SearchField.SearchIcon />
                                <SearchField.Input placeholder="Cari kecamatan..." />
                                <SearchField.ClearButton />
                              </SearchField.Group>
                            </SearchField>

                            <ListBox aria-label="Pilihan kecamatan" renderEmptyState={() => <EmptyState>No results found</EmptyState>}>
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
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </TextField>
                  )}
                />
              ) : (
                <Controller control={control} name="district_id" render={({ field }) => <input {...field} type="hidden" value={userDistrictId ?? ''} />} />
              )}

              <Controller
                control={control}
                name="address"
                render={({ field, fieldState }) => (
                  <TextField className="w-full md:col-span-2" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>Alamat</Label>
                    <TextArea
                      value={field.value}
                      rows={3}
                      placeholder="Masukkan alamat lembaga"
                      className="border border-gray-300 shadow-none data-[focus-within=true]:border-primary-500 data-[focus-within=true]:ring-2 data-[focus-within=true]:ring-primary-500/20"
                    />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="male_scout_unit_number"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>No. Gudep Putra</Label>
                    <Input value={field.value} placeholder="Contoh: 01.123" className={fieldClassName} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="female_scout_unit_number"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>No. Gudep Putri</Label>
                    <Input value={field.value} placeholder="Contoh: 01.124" className={fieldClassName} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="male_scout_unit_leader_name"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>Nama Pembina Putra</Label>
                    <Input value={field.value} placeholder="Masukkan nama pembina putra" className={fieldClassName} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="female_scout_unit_leader_name"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>Nama Pembina Putri</Label>
                    <Input value={field.value} placeholder="Masukkan nama pembina putri" className={fieldClassName} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="male_scout_unit_leader_nta"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>NTA Pembina Putra</Label>
                    <Input value={field.value} placeholder="Masukkan NTA pembina putra" className={fieldClassName} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="female_scout_unit_leader_nta"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>NTA Pembina Putri</Label>
                    <Input value={field.value} placeholder="Masukkan NTA pembina putri" className={fieldClassName} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="principal_name"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>Nama Kepala Sekolah</Label>
                    <Input value={field.value} placeholder="Masukkan nama kepala sekolah" className={fieldClassName} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="principal_nip"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>NIP Kepala Sekolah</Label>
                    <Input value={field.value} placeholder="Masukkan NIP kepala sekolah" className={fieldClassName} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="tertiary" className="w-full" onPress={onCancel}>
              Batal
            </Button>
            <Button className="w-full bg-primary-600 hover:bg-primary-600/90" form="institution-form" type="submit">
              {submitText}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
