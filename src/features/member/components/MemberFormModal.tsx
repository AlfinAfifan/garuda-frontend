'use client';

import { levelOptions } from '@/lib/main/options';
import { Autocomplete, Button, EmptyState, FieldError, Input, Label, ListBox, Modal, SearchField, Select, TextArea, TextField, useFilter } from '@heroui/react';
import { useState } from 'react';
import { Controller, type Control, type SubmitHandler, type UseFormHandleSubmit } from 'react-hook-form';

import { useSession } from 'next-auth/react';
import type { MemberFormValues } from '../schemas/member.schema';

const genderOptions: Array<{ value: 'male' | 'female'; label: string }> = [
  { value: 'male', label: 'Laki-laki' },
  { value: 'female', label: 'Perempuan' },
];

const citizenshipOptions: Array<{ value: 'wni' | 'wna'; label: string }> = [
  { value: 'wni', label: 'WNI' },
  { value: 'wna', label: 'WNA' },
];

type MemberFormModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  control: Control<MemberFormValues>;
  handleSubmit: UseFormHandleSubmit<MemberFormValues>;
  onSubmit: SubmitHandler<MemberFormValues>;
  onCancel: () => void;
  title?: string;
  submitText?: string;
  institutionOptions: InstitutionAllResponse[];
  religionOptions: ReligionAllResponse[];
  cityOptions: CityAllResponse[];
};

export function MemberFormModal({ isOpen, onOpenChange, control, handleSubmit, onSubmit, onCancel, title = 'Edit Member', submitText = 'Simpan', institutionOptions, religionOptions, cityOptions }: MemberFormModalProps) {
  const { data: session } = useSession();

  const [institutionSearch, setInstitutionSearch] = useState('');
  const [birthplaceSearch, setBirthplaceSearch] = useState('');
  const [fatherBirthplaceSearch, setFatherBirthplaceSearch] = useState('');
  const [motherBirthplaceSearch, setMotherBirthplaceSearch] = useState('');
  const { contains } = useFilter({ sensitivity: 'base' });
  const fieldClassName = 'h-10 border border-gray-300 shadow-none data-[focus-within=true]:border-primary-500 data-[focus-within=true]:ring-2 data-[focus-within=true]:ring-primary-500/20';

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container scroll="inside">
        <Modal.Dialog className="sm:max-w-200">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading className="text-xl font-semibold">{title}</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="my-5">
            <form id="member-form" className="grid grid-cols-1 gap-5 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
              <Controller
                control={control}
                name="name"
                render={({ field, fieldState }) => (
                  <TextField className="w-full md:col-span-2" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>Nama</Label>
                    <Input value={field.value} placeholder="Masukkan nama member" className={fieldClassName} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              {['super_admin', 'admin', 'kwarran'].includes(session?.user?.role || '') && (
                <Controller
                  control={control}
                  name="institution_id"
                  render={({ field, fieldState }) => (
                    <TextField className="w-full" isInvalid={!!fieldState.error}>
                      <Label>Lembaga</Label>
                      <Autocomplete aria-label="Lembaga" placeholder="Pilih lembaga" selectionMode="single" value={field.value} onChange={(value) => field.onChange(String(value ?? ''))} className="w-full">
                        <Autocomplete.Trigger className={fieldClassName}>
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
                            <ListBox aria-label="Pilihan lembaga" renderEmptyState={() => <EmptyState>No results found</EmptyState>}>
                              {institutionOptions.map((option) => (
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
              )}

              {session?.user?.role === 'institution' && <Controller control={control} name="institution_id" render={({ field }) => <input {...field} type="hidden" value={session.user?.institution_id ?? ''} />} />}

              <Controller
                control={control}
                name="religion"
                render={({ field, fieldState }) => (
                  <Select aria-label="Agama" className="w-full" value={field.value} onChange={(value) => field.onChange(String(value ?? ''))} isInvalid={!!fieldState.error}>
                    <Label>Agama</Label>
                    <Select.Trigger className={fieldClassName}>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox aria-label="Pilihan agama">
                        {religionOptions.map((option) => (
                          <ListBox.Item key={option.id} id={option.id} textValue={option.name}>
                            {option.name}
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Select>
                )}
              />

              <Controller
                control={control}
                name="gender"
                render={({ field, fieldState }) => (
                  <Select aria-label="Jenis kelamin" className="w-full" value={field.value} onChange={(value) => field.onChange(String(value ?? ''))} isInvalid={!!fieldState.error}>
                    <Label>Jenis Kelamin</Label>
                    <Select.Trigger className={fieldClassName}>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox aria-label="Pilihan jenis kelamin">
                        {genderOptions.map((option) => (
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

              <Controller
                control={control}
                name="citizenship"
                render={({ field, fieldState }) => (
                  <Select aria-label="Kewarganegaraan" className="w-full" value={field.value} onChange={(value) => field.onChange(String(value ?? ''))} isInvalid={!!fieldState.error}>
                    <Label>Kewarganegaraan</Label>
                    <Select.Trigger className={fieldClassName}>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox aria-label="Pilihan kewarganegaraan">
                        {citizenshipOptions.map((option) => (
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

              {session?.user?.role === 'super_admin' && (
                <Controller
                  control={control}
                  name="level"
                  render={({ field, fieldState }) => (
                    <Select aria-label="Level" className="w-full" value={field.value} onChange={(value) => field.onChange(String(value ?? ''))} isInvalid={!!fieldState.error}>
                      <Label>Level</Label>
                      <Select.Trigger className={fieldClassName}>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox aria-label="Pilihan level">
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
              )}

              <Controller
                control={control}
                name="entry_level"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>Tingkat Masuk</Label>
                    <Input value={field.value} placeholder="Masukkan tingkat masuk" className={fieldClassName} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="phone"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>No. Telepon</Label>
                    <Input value={field.value} placeholder="Masukkan nomor telepon" className={fieldClassName} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="nta"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>NTA</Label>
                    <Input value={field.value} placeholder="Masukkan NTA" className={fieldClassName} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="nik"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>NIK</Label>
                    <Input value={field.value} placeholder="Masukkan NIK" className={fieldClassName} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="talent"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>Bakat</Label>
                    <Input value={field.value} placeholder="Masukkan bakat" className={fieldClassName} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="birthplace"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" isInvalid={!!fieldState.error}>
                    <Label>Tempat Lahir</Label>
                    <Autocomplete aria-label="Tempat lahir" placeholder="Pilih tempat lahir" selectionMode="single" value={field.value} onChange={(value) => field.onChange(String(value ?? ''))} className="w-full">
                      <Autocomplete.Trigger className={fieldClassName}>
                        <Autocomplete.Value />
                        <Autocomplete.ClearButton />
                        <Autocomplete.Indicator />
                      </Autocomplete.Trigger>
                      <Autocomplete.Popover>
                        <Autocomplete.Filter filter={contains}>
                          <SearchField autoFocus name="search" variant="secondary" value={birthplaceSearch} onChange={(value) => setBirthplaceSearch(value)}>
                            <SearchField.Group>
                              <SearchField.SearchIcon />
                              <SearchField.Input placeholder="Cari tempat lahir..." />
                              <SearchField.ClearButton />
                            </SearchField.Group>
                          </SearchField>
                          <ListBox aria-label="Pilihan tempat lahir" renderEmptyState={() => <EmptyState>No results found</EmptyState>}>
                            {cityOptions.map((option) => (
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

              <Controller
                control={control}
                name="birthdate"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" name={field.name} type="date" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>Tanggal Lahir</Label>
                    <Input value={field.value} className={fieldClassName} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="entry_date"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" name={field.name} type="date" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>Tanggal Masuk</Label>
                    <Input value={field.value} className={fieldClassName} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="exit_date"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" name={field.name} type="date" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>Tanggal Keluar</Label>
                    <Input value={field.value ?? ''} className={fieldClassName} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="father_name"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>Nama Ayah</Label>
                    <Input value={field.value} placeholder="Masukkan nama ayah" className={fieldClassName} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="father_birthplace"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" isInvalid={!!fieldState.error}>
                    <Label>Tempat Lahir Ayah</Label>
                    <Autocomplete aria-label="Tempat lahir ayah" placeholder="Pilih tempat lahir ayah" selectionMode="single" value={field.value} onChange={(value) => field.onChange(String(value ?? ''))} className="w-full">
                      <Autocomplete.Trigger className={fieldClassName}>
                        <Autocomplete.Value />
                        <Autocomplete.ClearButton />
                        <Autocomplete.Indicator />
                      </Autocomplete.Trigger>
                      <Autocomplete.Popover>
                        <Autocomplete.Filter filter={contains}>
                          <SearchField autoFocus name="search" variant="secondary" value={fatherBirthplaceSearch} onChange={(value) => setFatherBirthplaceSearch(value)}>
                            <SearchField.Group>
                              <SearchField.SearchIcon />
                              <SearchField.Input placeholder="Cari tempat lahir ayah..." />
                              <SearchField.ClearButton />
                            </SearchField.Group>
                          </SearchField>
                          <ListBox aria-label="Pilihan tempat lahir ayah" renderEmptyState={() => <EmptyState>No results found</EmptyState>}>
                            {cityOptions.map((option) => (
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

              <Controller
                control={control}
                name="father_birthdate"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" name={field.name} type="date" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>Tanggal Lahir Ayah</Label>
                    <Input value={field.value} className={fieldClassName} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="mother_name"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>Nama Ibu</Label>
                    <Input value={field.value} placeholder="Masukkan nama ibu" className={fieldClassName} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="mother_birthplace"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" isInvalid={!!fieldState.error}>
                    <Label>Tempat Lahir Ibu</Label>
                    <Autocomplete aria-label="Tempat lahir ibu" placeholder="Pilih tempat lahir ibu" selectionMode="single" value={field.value} onChange={(value) => field.onChange(String(value ?? ''))} className="w-full">
                      <Autocomplete.Trigger className={fieldClassName}>
                        <Autocomplete.Value />
                        <Autocomplete.ClearButton />
                        <Autocomplete.Indicator />
                      </Autocomplete.Trigger>
                      <Autocomplete.Popover>
                        <Autocomplete.Filter filter={contains}>
                          <SearchField autoFocus name="search" variant="secondary" value={motherBirthplaceSearch} onChange={(value) => setMotherBirthplaceSearch(value)}>
                            <SearchField.Group>
                              <SearchField.SearchIcon />
                              <SearchField.Input placeholder="Cari tempat lahir ibu..." />
                              <SearchField.ClearButton />
                            </SearchField.Group>
                          </SearchField>
                          <ListBox aria-label="Pilihan tempat lahir ibu" renderEmptyState={() => <EmptyState>No results found</EmptyState>}>
                            {cityOptions.map((option) => (
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

              <Controller
                control={control}
                name="mother_birthdate"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" name={field.name} type="date" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>Tanggal Lahir Ibu</Label>
                    <Input value={field.value} className={fieldClassName} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="parent_phone"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>No. Telepon Orang Tua</Label>
                    <Input value={field.value} placeholder="Masukkan nomor telepon orang tua" className={fieldClassName} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="address"
                render={({ field, fieldState }) => (
                  <TextField className="w-full md:col-span-2" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>Alamat</Label>
                    <TextArea
                      value={field.value}
                      rows={3}
                      placeholder="Masukkan alamat member"
                      className="border border-gray-300 shadow-none data-[focus-within=true]:border-primary-500 data-[focus-within=true]:ring-2 data-[focus-within=true]:ring-primary-500/20"
                    />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="parent_address"
                render={({ field, fieldState }) => (
                  <TextField className="w-full md:col-span-2" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>Alamat Orang Tua</Label>
                    <TextArea
                      value={field.value}
                      rows={3}
                      placeholder="Masukkan alamat orang tua"
                      className="border border-gray-300 shadow-none data-[focus-within=true]:border-primary-500 data-[focus-within=true]:ring-2 data-[focus-within=true]:ring-primary-500/20"
                    />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="exit_reason"
                render={({ field, fieldState }) => (
                  <TextField className="w-full md:col-span-2" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>Alasan Keluar</Label>
                    <TextArea
                      value={field.value ?? ''}
                      rows={2}
                      placeholder="Masukkan alasan keluar (opsional)"
                      className="border border-gray-300 shadow-none data-[focus-within=true]:border-primary-500 data-[focus-within=true]:ring-2 data-[focus-within=true]:ring-primary-500/20"
                    />
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
            <Button className="w-full bg-primary-600 hover:bg-primary-600/90" form="member-form" type="submit">
              {submitText}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
