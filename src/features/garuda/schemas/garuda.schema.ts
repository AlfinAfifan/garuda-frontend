import { z } from 'zod';

export const garudaCreateFormSchema = z.object({
  member_ids: z.array(z.string().min(1)).min(1, 'Pilih minimal satu anggota.'),
});

export type GarudaCreateFormValues = z.infer<typeof garudaCreateFormSchema>;
