import { z } from 'zod';

export const tkkFormSchema = z.object({
  tkk_type_id: z.string().min(1, 'Pilih tipe TKK terlebih dahulu.'),
  member_ids: z.array(z.string().min(1)).min(1, 'Pilih minimal satu anggota.'),
});

export type TkkFormValues = z.infer<typeof tkkFormSchema>;
