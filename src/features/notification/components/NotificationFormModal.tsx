'use client';

import { roleOptions } from '@/lib/main/options';
import { Button, Checkbox, FieldError, Input, Label, Modal, TextArea, TextField } from '@heroui/react';
import { Controller, useWatch, type Control, type SubmitHandler, type UseFormHandleSubmit } from 'react-hook-form';

import type { NotificationFormValues } from '../schemas/notification.schema';

type NotificationFormModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  control: Control<NotificationFormValues>;
  handleSubmit: UseFormHandleSubmit<NotificationFormValues>;
  onSubmit: SubmitHandler<NotificationFormValues>;
  onCancel: () => void;
  title?: string;
  submitText?: string;
};

export function NotificationFormModal({ isOpen, onOpenChange, control, handleSubmit, onSubmit, onCancel, title = 'Edit Notification', submitText = 'Simpan' }: NotificationFormModalProps) {
  const isAllRoles = useWatch({
    control,
    name: 'all_roles',
  });

  const fieldClassName = 'h-10 border border-gray-300 shadow-none data-[focus-within=true]:border-primary-500 data-[focus-within=true]:ring-2 data-[focus-within=true]:ring-primary-500/20';

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container scroll="inside">
        <Modal.Dialog className="sm:max-w-120">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading className="text-xl font-semibold">{title}</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="my-5">
            <form id="notification-form" className="grid grid-cols-1 gap-5" onSubmit={handleSubmit(onSubmit)}>
              <Controller
                control={control}
                name="title"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>Judul</Label>
                    <Input value={field.value} placeholder="Masukkan judul notifikasi" className={fieldClassName} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="message"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>Pesan</Label>
                    <TextArea
                      value={field.value}
                      rows={4}
                      placeholder="Masukkan isi notifikasi"
                      className="border border-gray-300 shadow-none data-[focus-within=true]:border-primary-500 data-[focus-within=true]:ring-2 data-[focus-within=true]:ring-primary-500/20"
                    />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="all_roles"
                render={({ field }) => (
                  <Checkbox id="all-roles" isSelected={field.value} onChange={field.onChange}>
                    <Checkbox.Control className="size-5 border">
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    <Checkbox.Content>
                      <Label htmlFor="all-roles">Kirim ke semua role</Label>
                    </Checkbox.Content>
                  </Checkbox>
                )}
              />

              <Controller
                control={control}
                name="roles"
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Role Tujuan</p>
                    <div className="rounded-xl border border-gray-300 p-3">
                      <div className="grid grid-cols-2 gap-3">
                        {roleOptions.map((option) => {
                          const selectedRoles = field.value ?? [];
                          const isSelected = selectedRoles.includes(option.value);

                          return (
                            <Checkbox
                              key={option.value}
                              id={`role-${option.value}`}
                              isSelected={isSelected}
                              isDisabled={isAllRoles}
                              onChange={(checked) => {
                                if (checked) {
                                  field.onChange([...selectedRoles, option.value]);
                                  return;
                                }

                                field.onChange(selectedRoles.filter((role) => role !== option.value));
                              }}
                            >
                              <Checkbox.Control className="size-5 border">
                                <Checkbox.Indicator />
                              </Checkbox.Control>
                              <Checkbox.Content>
                                <Label htmlFor={`role-${option.value}`}>{option.label}</Label>
                              </Checkbox.Content>
                            </Checkbox>
                          );
                        })}
                      </div>
                    </div>
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </div>
                )}
              />
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="tertiary" className="w-full" onPress={onCancel}>
              Batal
            </Button>
            <Button className="w-full bg-primary-600 hover:bg-primary-600/90" form="notification-form" type="submit">
              {submitText}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
