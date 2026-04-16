import { z } from 'zod';

export const cityFormSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  province_id: z.string().min(1, 'Provinsi wajib dipilih'),
});

export type CityFormValues = z.infer<typeof cityFormSchema>;
