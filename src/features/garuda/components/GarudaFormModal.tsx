'use client';

import { useMemberPaginated } from '@/features/member/hooks/useMember';
import { Autocomplete, Button, EmptyState, FieldError, Label, ListBox, Modal, SearchField, Tag, TagGroup } from '@heroui/react';
import { useMemo, useState } from 'react';
import { Controller, type Control, type SubmitHandler, type UseFormHandleSubmit } from 'react-hook-form';

import { useSession } from 'next-auth/react';
import type { GarudaCreateFormValues } from '../schemas/garuda.schema';

type GarudaFormModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  control: Control<GarudaCreateFormValues>;
  handleSubmit: UseFormHandleSubmit<GarudaCreateFormValues>;
  onSubmit: SubmitHandler<GarudaCreateFormValues>;
  onCancel: () => void;
  title?: string;
  submitText?: string;
};

export function GarudaFormModal({ isOpen, onOpenChange, control, handleSubmit, onSubmit, onCancel, title = 'Tambah Garuda', submitText = 'Simpan' }: GarudaFormModalProps) {
  const { data: session } = useSession();

  const defaultLevelFilter = session?.user?.role === 'super_admin' ? '' : (session?.user?.level ?? '');
  const defaultInstitutionFilter = session?.user?.role === 'institution' ? session?.user?.institution_id : '';

  const [memberSearch, setMemberSearch] = useState('');
  const [memberParams, setMemberParams] = useState({ page: 1, limit: 20, search: '', level: defaultLevelFilter, institution_id: defaultInstitutionFilter || '' });
  const { data: memberData, isLoading: isMemberOptionsLoading } = useMemberPaginated(memberParams);
  const memberOptions = useMemo(() => (memberData?.data ?? []).map((m: any) => ({ id: m.id, name: m.name })), [memberData]);

  const onMemberSearchChange = (val: string) => {
    setMemberSearch(val);
    setMemberParams((prev) => ({ ...prev, search: val, page: 1 }));
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-120">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading className="text-xl font-semibold">{title}</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="my-5">
            <form id="garuda-form" className="grid grid-cols-1 gap-5" onSubmit={handleSubmit(onSubmit)}>
              <Controller
                control={control}
                name="member_ids"
                render={({ field, fieldState }) => {
                  const selectedKeys = Array.isArray(field.value) ? field.value : [];
                  const handleRemove = (id: string) => {
                    field.onChange(selectedKeys.filter((v) => v !== id));
                  };
                  return (
                    <Autocomplete
                      placeholder="Pilih anggota"
                      selectionMode="multiple"
                      value={selectedKeys}
                      onChange={(keys) => field.onChange((keys as readonly (string | number)[]).map(String))}
                      onClear={() => field.onChange([])}
                      className="w-full"
                    >
                      <Label>Pilih Anggota</Label>
                      <Autocomplete.Trigger className="min-h-11 border border-gray-300 shadow-none data-[focus-within=true]:border-primary-500 data-[focus-within=true]:ring-2 data-[focus-within=true]:ring-primary-500/20">
                        <Autocomplete.Value>
                          {({ defaultChildren, isPlaceholder }: any) => {
                            if (isPlaceholder || !selectedKeys.length) {
                              return defaultChildren;
                            }
                            return (
                              <TagGroup
                                size="sm"
                                onRemove={(keys: Set<string | number>) => {
                                  const newSelected = selectedKeys.filter((id) => !keys.has(id));
                                  field.onChange(newSelected);
                                }}
                              >
                                <TagGroup.List>
                                  {selectedKeys.map((memberId) => {
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
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Autocomplete>
                  );
                }}
              />
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="tertiary" className="w-full" onPress={onCancel}>
              Batal
            </Button>
            <Button className="w-full bg-primary-600 hover:bg-primary-600/90" form="garuda-form" type="submit">
              {submitText}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
