'use client';

import { Autocomplete, Button, EmptyState, FieldError, Label, ListBox, Modal, SearchField, Select, Tag, TagGroup } from '@heroui/react';
import { Controller, type Control, type SubmitHandler, type UseFormHandleSubmit } from 'react-hook-form';

import type { TkkFormValues } from '../schemas/tkk.schema';

type MemberOption = {
  id: string;
  name: string;
};

type TkkTypeOption = {
  id: string;
  name: string;
};

type TkkFormModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  control: Control<TkkFormValues>;
  handleSubmit: UseFormHandleSubmit<TkkFormValues>;
  onSubmit: SubmitHandler<TkkFormValues>;
  onCancel: () => void;
  title?: string;
  submitText?: string;
  memberSearch: string;
  onMemberSearchChange: (value: string) => void;
  memberOptions: MemberOption[];
  tkkTypeOptions: TkkTypeOption[];
  isMemberOptionsLoading?: boolean;
};

export function TkkFormModal({
  isOpen,
  onOpenChange,
  control,
  handleSubmit,
  onSubmit,
  onCancel,
  title = 'Tambah TKK',
  submitText = 'Simpan',
  memberSearch,
  onMemberSearchChange,
  memberOptions,
  tkkTypeOptions,
  isMemberOptionsLoading = false,
}: TkkFormModalProps) {
  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-150">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading className="text-xl font-semibold">{title}</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="my-5">
            <form id="tkk-form" className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <Controller
                control={control}
                name="tkk_type_id"
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <Label>Pilih Tipe TKK</Label>
                    <Select aria-label="Pilih tipe TKK" value={field.value} onChange={(value) => field.onChange(String(value ?? ''))}>
                      <Select.Trigger className="h-10 border border-gray-300 shadow-none data-[focus-within=true]:border-primary-500 data-[focus-within=true]:ring-2 data-[focus-within=true]:ring-primary-500/20">
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox aria-label="Pilihan tipe TKK">
                          {tkkTypeOptions.map((option) => (
                            <ListBox.Item key={option.id} id={option.id} textValue={option.name}>
                              {option.name}
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </div>
                )}
              />

              <Controller
                control={control}
                name="member_ids"
                render={({ field, fieldState }) => {
                  const selectedKeys = field.value as readonly (string | number)[];

                  const handleRemoveTags = (keys: Set<string | number> | readonly (string | number)[]) => {
                    const removeKeys = keys instanceof Set ? keys : new Set(keys);
                    field.onChange(field.value.filter((id) => !removeKeys.has(id)));
                  };

                  return (
                    <div className="space-y-3">
                      <Autocomplete placeholder="Pilih anggota" selectionMode="multiple" value={selectedKeys} onChange={(keys) => field.onChange((keys as readonly (string | number)[]).map(String))} onClear={() => field.onChange([])}>
                        <Label>Pilih Anggota</Label>
                        <Autocomplete.Trigger className="min-h-11 border border-gray-300 shadow-none data-[focus-within=true]:border-primary-500 data-[focus-within=true]:ring-2 data-[focus-within=true]:ring-primary-500/20">
                          <Autocomplete.Value>
                            {({ defaultChildren, isPlaceholder }) => {
                              if (isPlaceholder || !field.value.length) {
                                return defaultChildren;
                              }

                              return (
                                <TagGroup size="sm" onRemove={handleRemoveTags}>
                                  <TagGroup.List>
                                    {field.value.map((memberId) => {
                                      const item = memberOptions.find((option) => option.id === memberId);

                                      return (
                                        <Tag key={memberId} id={memberId}>
                                          {item?.name ?? memberId}
                                        </Tag>
                                      );
                                    })}
                                  </TagGroup.List>
                                </TagGroup>
                              );
                            }}
                          </Autocomplete.Value>
                          <Autocomplete.ClearButton />
                          <Autocomplete.Indicator />
                        </Autocomplete.Trigger>
                        <Autocomplete.Popover>
                          <Autocomplete.Filter>
                            <SearchField autoFocus name="member-search" variant="secondary" value={memberSearch} onChange={onMemberSearchChange}>
                              <SearchField.Group>
                                <SearchField.SearchIcon />
                                <SearchField.Input placeholder="Cari anggota..." />
                                <SearchField.ClearButton />
                              </SearchField.Group>
                            </SearchField>

                            <ListBox aria-label="Pilihan anggota" renderEmptyState={() => <EmptyState>{isMemberOptionsLoading ? 'Memuat anggota...' : 'Tidak ada hasil ditemukan.'}</EmptyState>}>
                              {memberOptions.map((option) => (
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
                    </div>
                  );
                }}
              />
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="tertiary" className="w-full" onPress={onCancel}>
              Batal
            </Button>
            <Button className="w-full bg-primary-600 hover:bg-primary-600/90" form="tkk-form" type="submit">
              {submitText}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
