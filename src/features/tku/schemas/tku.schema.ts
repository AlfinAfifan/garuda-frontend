import { z } from 'zod';

export const tkuFormSchema = z.object({
  member_ids: z.array(z.string().min(1)).min(1, 'Pilih minimal satu anggota.'),
});

export type TkuFormValues = z.infer<typeof tkuFormSchema>;
