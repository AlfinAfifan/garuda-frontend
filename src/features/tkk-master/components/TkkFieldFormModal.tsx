'use client';

import { levelOptions } from '@/lib/main/options';
import { Button, FieldError, Input, Label, ListBox, Modal, Select, TextField } from '@heroui/react';
import { Controller, type Control, type SubmitHandler, type UseFormHandleSubmit } from 'react-hook-form';

import type { TkkFieldFormValues } from '../schemas/tkk-field.schema';

type TkkFieldFormModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  control: Control<TkkFieldFormValues>;
  handleSubmit: UseFormHandleSubmit<TkkFieldFormValues>;
  onSubmit: SubmitHandler<TkkFieldFormValues>;
  onCancel: () => void;
  title: string;
  submitText: string;
  showLevelField: boolean;
};

export function TkkFieldFormModal({ isOpen, onOpenChange, control, handleSubmit, onSubmit, onCancel, title, submitText, showLevelField }: TkkFieldFormModalProps) {
  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container scroll="inside">
        <Modal.Dialog className="sm:max-w-120">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading className="text-xl font-semibold">{title}</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="my-5">
            <form id="tkk-field-form" className="grid grid-cols-1 gap-5" onSubmit={handleSubmit(onSubmit)}>
              <Controller
                control={control}
                name="name"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>Nama Bidang TKK</Label>
                    <Input value={field.value} placeholder="Masukkan nama bidang" className="h-10 border border-gray-300 shadow-none" />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              {showLevelField && (
                <Controller
                  control={control}
                  name="level"
                  render={({ field, fieldState }) => (
                    <Select className="w-full" aria-label="Pilih tingkatan" value={field.value} onChange={(value) => field.onChange(String(value ?? ''))} isInvalid={!!fieldState.error}>
                      <Label>Tingkat</Label>
                      <Select.Trigger className="h-10 border border-gray-300 shadow-none">
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox aria-label="Pilihan tingkatan">
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
                name="color"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>Warna</Label>
                    <Input value={field.value} placeholder="#RRGGBB atau nama warna" className="h-10 border border-gray-300 shadow-none" />
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
            <Button className="w-full bg-primary-600 hover:bg-primary-600/90" form="tkk-field-form" type="submit">
              {submitText}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
