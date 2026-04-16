'use client';

import { Button, FieldError, Input, Label, ListBox, Modal, Select, TextField } from '@heroui/react';
import { Controller, type Control, type SubmitHandler, type UseFormHandleSubmit } from 'react-hook-form';

import type { CityFormValues } from '../schemas/city.schema';

type CityFormModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  control: Control<CityFormValues>;
  handleSubmit: UseFormHandleSubmit<CityFormValues>;
  onSubmit: SubmitHandler<CityFormValues>;
  onCancel: () => void;
  title: string;
  submitText: string;
  provinceOptions: ProvinceAllResponse[];
};

export function CityFormModal({ isOpen, onOpenChange, control, handleSubmit, onSubmit, onCancel, title, submitText, provinceOptions }: CityFormModalProps) {
  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container scroll="inside">
        <Modal.Dialog className="sm:max-w-120">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading className="text-xl font-semibold">{title}</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="my-5">
            <form id="city-form" className="grid grid-cols-1 gap-5" onSubmit={handleSubmit(onSubmit)}>
              <Controller
                control={control}
                name="province_id"
                render={({ field, fieldState }) => (
                  <Select className="w-full" aria-label="Pilih provinsi" value={field.value} onChange={(value) => field.onChange(String(value ?? ''))} isInvalid={!!fieldState.error}>
                    <Label>Provinsi</Label>
                    <Select.Trigger className="h-10 border border-gray-300 shadow-none">
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox aria-label="Pilihan provinsi">
                        {provinceOptions.map((option) => (
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
                    <Label>Nama Kota</Label>
                    <Input value={field.value} placeholder="Masukkan nama kota" className="h-10 border border-gray-300 shadow-none" />
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
            <Button className="w-full bg-primary-600 hover:bg-primary-600/90" form="city-form" type="submit">
              {submitText}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
