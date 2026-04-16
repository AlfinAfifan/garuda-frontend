'use client';

import { Button, FieldError, Input, Label, ListBox, Modal, Select, TextField } from '@heroui/react';
import { Controller, type Control, type SubmitHandler, type UseFormHandleSubmit } from 'react-hook-form';

import type { DistrictFormValues } from '../schemas/district.schema';

type DistrictFormModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  control: Control<DistrictFormValues>;
  handleSubmit: UseFormHandleSubmit<DistrictFormValues>;
  onSubmit: SubmitHandler<DistrictFormValues>;
  onCancel: () => void;
  title: string;
  submitText: string;
  cityOptions: CityAllResponse[];
};

export function DistrictFormModal({ isOpen, onOpenChange, control, handleSubmit, onSubmit, onCancel, title, submitText, cityOptions }: DistrictFormModalProps) {
  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container scroll="inside">
        <Modal.Dialog className="sm:max-w-120">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading className="text-xl font-semibold">{title}</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="my-5">
            <form id="district-form" className="grid grid-cols-1 gap-5" onSubmit={handleSubmit(onSubmit)}>
              <Controller
                control={control}
                name="city_id"
                render={({ field, fieldState }) => (
                  <Select className="w-full" aria-label="Pilih kota" value={field.value} onChange={(value) => field.onChange(String(value ?? ''))} isInvalid={!!fieldState.error}>
                    <Label>Kota</Label>
                    <Select.Trigger className="h-10 border border-gray-300 shadow-none">
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox aria-label="Pilihan kota">
                        {cityOptions.map((option) => (
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
                name="name"
                render={({ field, fieldState }) => (
                  <TextField className="w-full" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>Nama Kecamatan</Label>
                    <Input value={field.value} placeholder="Masukkan nama kecamatan" className="h-10 border border-gray-300 shadow-none" />
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
            <Button className="w-full bg-primary-600 hover:bg-primary-600/90" form="district-form" type="submit">
              {submitText}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
