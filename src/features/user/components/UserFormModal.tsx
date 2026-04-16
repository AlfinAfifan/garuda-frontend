'use client';

import { levelOptions, roleOptions } from '@/lib/main/options';
import { Autocomplete, Button, EmptyState, FieldError, Input, Label, ListBox, Modal, SearchField, Select, TextField, useFilter } from '@heroui/react';
import { useState } from 'react';
import { Controller, useWatch, type Control, type SubmitHandler, type UseFormGetValues, type UseFormHandleSubmit } from 'react-hook-form';

import type { UserFormValues } from '../schemas/user.schema';

type UserFormModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  control: Control<UserFormValues>;
  getValues: UseFormGetValues<UserFormValues>;
  handleSubmit: UseFormHandleSubmit<UserFormValues>;
  onSubmit: SubmitHandler<UserFormValues>;
  onCancel: () => void;
  isEditMode?: boolean;
  title?: string;
  submitText?: string;
  institutionOptions: InstitutionAllResponse[];
  districtOptions: DistrictAllResponse[];
  onInstitutionSearchChange?: (search: string) => void;
  onDistrictSearchChange?: (search: string) => void;
};

export function UserFormModal({
  isOpen,
  onOpenChange,
  control,
  getValues,
  handleSubmit,
  onSubmit,
  onCancel,
  isEditMode = false,
  title = 'Edit User',
  submitText = 'Simpan',
  institutionOptions,
  districtOptions,
  onInstitutionSearchChange,
  onDistrictSearchChange,
}: UserFormModalProps) {
  const fieldClassName = 'h-10 border border-gray-300 shadow-none data-[focus-within=true]:border-primary-500 data-[focus-within=true]:ring-2 data-[focus-within=true]:ring-primary-500/20';
  const { contains } = useFilter({ sensitivity: 'base' });
  const selectedRole = useWatch({ control, name: 'role' });
  const [institutionSearch, setInstitutionSearch] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (isEditMode) {
      event.preventDefault();
      void onSubmit(getValues(), event);
      return;
    }

    void handleSubmit(onSubmit)(event);
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-160 overflow-visible">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading className="text-xl font-semibold">{title}</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="my-5 overflow-visible">
            <form id="edit-user-form" className="grid grid-cols-1 gap-5 md:grid-cols-2" onSubmit={handleFormSubmit}>
              <Controller
                control={control}
                name="name"
                render={({ field, fieldState }) => (
                  <TextField className="w-full md:col-span-2" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>Nama</Label>
                    <Input value={field.value} placeholder="Masukkan nama" className={fieldClassName} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field, fieldState }) => (
                  <TextField className="w-full md:col-span-2" name={field.name} type="email" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>Email</Label>
                    <Input value={field.value} placeholder="Masukkan email" className={fieldClassName} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field, fieldState }) => (
                  <TextField className="w-full md:col-span-2" name={field.name} type="password" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>Password</Label>
                    <Input value={field.value} placeholder="Masukkan password" className={fieldClassName} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="role"
                render={({ field, fieldState }) => (
                  <Select aria-label="Role user" value={field.value} onChange={(value) => field.onChange(String(value))}>
                    <Label>Role</Label>
                    <Select.Trigger className={fieldState.error ? 'border border-danger shadow-none h-10 data-[focus-within=true]:ring-2 data-[focus-within=true]:ring-danger-soft-hover' : fieldClassName}>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox aria-label="Role user">
                        {roleOptions.map((option) => (
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
                name="level"
                render={({ field, fieldState }) => (
                  <Select aria-label="Level user" value={field.value} onChange={(value) => field.onChange(String(value))}>
                    <Label>Level</Label>
                    <Select.Trigger className={fieldState.error ? 'border border-danger shadow-none h-10 data-[focus-within=true]:ring-2 data-[focus-within=true]:ring-danger-soft-hover' : fieldClassName}>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox aria-label="Level user">
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

              {selectedRole === 'institution' && (
                <Controller
                  control={control}
                  name="institution_id"
                  render={({ field, fieldState }) => (
                    <Autocomplete aria-label="Lembaga user" placeholder="Cari lembaga" selectionMode="single" value={field.value || ''} onChange={(value) => field.onChange(String(value ?? ''))} className="w-full">
                      <Label>Lembaga</Label>
                      <Autocomplete.Trigger className={fieldState.error ? 'border border-danger shadow-none h-10 data-[focus-within=true]:ring-2 data-[focus-within=true]:ring-danger-soft-hover' : fieldClassName}>
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
                            value={institutionSearch}
                            onChange={(value) => {
                              setInstitutionSearch(value);
                              onInstitutionSearchChange?.(value);
                            }}
                          >
                            <SearchField.Group>
                              <SearchField.SearchIcon />
                              <SearchField.Input placeholder="Cari lembaga..." />
                              <SearchField.ClearButton />
                            </SearchField.Group>
                          </SearchField>
                          <ListBox aria-label="Lembaga user" renderEmptyState={() => <EmptyState>No results found</EmptyState>}>
                            {institutionOptions.map((option) => (
                              <ListBox.Item key={option.id} id={option.id} textValue={option.name}>
                                {option.name}
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Autocomplete.Filter>
                      </Autocomplete.Popover>
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Autocomplete>
                  )}
                />
              )}

              {selectedRole === 'kwarran' && (
                <Controller
                  control={control}
                  name="district_id"
                  render={({ field, fieldState }) => (
                    <Autocomplete aria-label="Kecamatan user" placeholder="Cari kecamatan..." selectionMode="single" value={field.value || ''} onChange={(value) => field.onChange(String(value ?? ''))} className="w-full">
                      <Label>Kecamatan</Label>
                      <Autocomplete.Trigger className={fieldState.error ? 'border border-danger shadow-none h-10 data-[focus-within=true]:ring-2 data-[focus-within=true]:ring-danger-soft-hover' : fieldClassName}>
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
                          <ListBox aria-label="Kecamatan user" renderEmptyState={() => <EmptyState>No results found</EmptyState>}>
                            {districtOptions.map((option) => (
                              <ListBox.Item key={option.id} id={option.id} textValue={option.name}>
                                {option.name}
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Autocomplete.Filter>
                      </Autocomplete.Popover>
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Autocomplete>
                  )}
                />
              )}
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="tertiary" className="w-full" onPress={onCancel}>
              Batal
            </Button>
            <Button className="w-full bg-primary-600 hover:bg-primary-600/90" form="edit-user-form" type="submit">
              {submitText}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
