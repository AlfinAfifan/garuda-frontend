'use client';

import { Button, FieldError, Input, Label, Modal, TextField } from '@heroui/react';
import { Controller, type Control, type SubmitHandler, type UseFormHandleSubmit } from 'react-hook-form';

import type { ProvinceFormValues } from '../schemas/province.schema';

type ProvinceFormModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  control: Control<ProvinceFormValues>;
  handleSubmit: UseFormHandleSubmit<ProvinceFormValues>;
  onSubmit: SubmitHandler<ProvinceFormValues>;
  onCancel: () => void;
  title: string;
  submitText: string;
};

export function ProvinceFormModal({ isOpen, onOpenChange, control, handleSubmit, onSubmit, onCancel, title, submitText }: ProvinceFormModalProps) {
  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container scroll="inside">
        <Modal.Dialog className="sm:max-w-120">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading className="text-xl font-semibold">{title}</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="my-5">
            <form id="province-form" className="grid grid-cols-1 gap-5" onSubmit={handleSubmit(onSubmit)}>
              <Controller
                control={control}
                name="name"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>Nama Provinsi</Label>
                    <Input value={field.value} placeholder="Masukkan nama provinsi" className="h-10 border border-gray-300 shadow-none" />
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
            <Button className="w-full bg-primary-600 hover:bg-primary-600/90" form="province-form" type="submit">
              {submitText}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
