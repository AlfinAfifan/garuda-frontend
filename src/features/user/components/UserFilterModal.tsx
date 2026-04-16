'use client';

import { levelOptions, roleOptions } from '@/lib/main/options';
import { Button, Input, Label, ListBox, Modal, Select, TextField } from '@heroui/react';
import { Controller, type Control, type SubmitHandler, type UseFormHandleSubmit } from 'react-hook-form';

export type UserFilterValues = {
  search: string;
  institution_id: string;
  district_id: string;
  role: '' | 'admin' | 'kwarran' | 'institution';
  level: string;
};

type UserFilterModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  control: Control<UserFilterValues>;
  handleSubmit: UseFormHandleSubmit<UserFilterValues>;
  onSubmit: SubmitHandler<UserFilterValues>;
  onCancel: () => void;
  onReset: () => void;
  institutionOptions: InstitutionAllResponse[];
  districtOptions: DistrictAllResponse[];
};

export function UserFilterModal({ isOpen, onOpenChange, control, handleSubmit, onSubmit, onCancel, onReset, institutionOptions, districtOptions }: UserFilterModalProps) {
  const fieldClassName = 'h-10 border border-gray-300 shadow-none data-[focus-within=true]:border-primary-500 data-[focus-within=true]:ring-2 data-[focus-within=true]:ring-primary-500/20';

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container scroll="inside">
        <Modal.Dialog className="sm:max-w-120">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading className="text-xl font-semibold">Filter</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="my-5">
            <form id="user-filter-form" className="grid grid-cols-1 gap-5 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
              <Controller
                control={control}
                name="search"
                render={({ field }) => (
                  <TextField className="w-full md:col-span-2" name={field.name} type="text" onChange={field.onChange} onBlur={field.onBlur}>
                    <Label>Search</Label>
                    <Input value={field.value} placeholder="Cari nama, email, institution, district" className={fieldClassName} />
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="institution_id"
                render={({ field }) => (
                  <Select aria-label="Filter institution user" value={field.value || 'all'} onChange={(value) => field.onChange(String(value) === 'all' ? '' : String(value))}>
                    <Label>Institution</Label>
                    <Select.Trigger className={fieldClassName}>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox aria-label="Filter institution user">
                        <ListBox.Item id="all" textValue="Semua institution">
                          Semua institution
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        {institutionOptions.map((option) => (
                          <ListBox.Item key={option.id} id={option.id} textValue={option.name}>
                            {option.name}
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                )}
              />

              <Controller
                control={control}
                name="district_id"
                render={({ field }) => (
                  <Select aria-label="Filter district user" value={field.value || 'all'} onChange={(value) => field.onChange(String(value) === 'all' ? '' : String(value))}>
                    <Label>District</Label>
                    <Select.Trigger className={fieldClassName}>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox aria-label="Filter district user">
                        <ListBox.Item id="all" textValue="Semua district">
                          Semua district
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        {districtOptions.map((option) => (
                          <ListBox.Item key={option.id} id={option.id} textValue={option.name}>
                            {option.name}
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                )}
              />

              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select aria-label="Filter role user" value={field.value || 'all'} onChange={(value) => field.onChange(String(value) === 'all' ? '' : String(value))}>
                    <Label>Role</Label>
                    <Select.Trigger className={fieldClassName}>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox aria-label="Filter role user">
                        <ListBox.Item id="all" textValue="Semua role">
                          Semua role
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        {roleOptions.map((option) => (
                          <ListBox.Item key={option.value} id={option.value} textValue={option.label}>
                            {option.label}
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                )}
              />

              <Controller
                control={control}
                name="level"
                render={({ field }) => (
                  <Select aria-label="Filter level user" value={field.value || 'all'} onChange={(value) => field.onChange(String(value) === 'all' ? '' : String(value))}>
                    <Label>Level</Label>
                    <Select.Trigger className={fieldClassName}>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox aria-label="Filter level user">
                        <ListBox.Item id="all" textValue="Semua level">
                          Semua level
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        {levelOptions.map((option) => (
                          <ListBox.Item key={option.value} id={option.value} textValue={option.label}>
                            {option.label}
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                )}
              />
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className="w-full" onPress={onReset}>
              Reset
            </Button>
            <Button variant="tertiary" className="w-full" onPress={onCancel}>
              Batal
            </Button>
            <Button className="w-full bg-primary-600 hover:bg-primary-600/90" form="user-filter-form" type="submit">
              Terapkan
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
