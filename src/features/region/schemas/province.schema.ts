import { z } from 'zod';

export const provinceFormSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
});

export type ProvinceFormValues = z.infer<typeof provinceFormSchema>;
