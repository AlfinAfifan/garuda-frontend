import { z } from 'zod';

export const tkkFieldFormSchema = z.object({
  name: z.string().trim().min(3, 'Nama minimal 3 karakter'),
  level: z.string().trim().min(1, 'Level wajib dipilih'),
  color: z.string().trim().min(1, 'Warna wajib diisi'),
});

export type TkkFieldFormValues = z.infer<typeof tkkFieldFormSchema>;
