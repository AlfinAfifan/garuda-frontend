import { z } from 'zod';

export const tkkTypeFormSchema = z.object({
  name: z.string().trim().min(3, 'Nama minimal 3 karakter'),
  level: z.string().trim().min(1, 'Level wajib dipilih'),
  tkk_field_id: z.string().trim().min(1, 'Bidang TKK wajib dipilih'),
});

export type TkkTypeFormValues = z.infer<typeof tkkTypeFormSchema>;
