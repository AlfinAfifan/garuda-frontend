import { z } from 'zod';

export const religionFormSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
});

export type ReligionFormValues = z.infer<typeof religionFormSchema>;
