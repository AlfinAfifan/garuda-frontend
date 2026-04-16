import { z } from 'zod';

export const districtFormSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  city_id: z.string().min(1, 'Kota wajib dipilih'),
});

export type DistrictFormValues = z.infer<typeof districtFormSchema>;

// Backward compatibility for older imports in this module.
export const religionFormSchema = districtFormSchema;
export type ReligionFormValues = DistrictFormValues;
