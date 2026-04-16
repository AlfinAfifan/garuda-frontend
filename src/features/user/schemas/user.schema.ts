import { z } from 'zod';

export const userFormSchema = z
  .object({
    name: z.string().trim().min(3, 'Nama minimal 3 karakter'),
    email: z.string().trim().email('Format email tidak valid'),
    password: z.string().trim().min(6, 'Password minimal 6 karakter'),
    role: z.enum(['admin', 'kwarran', 'institution'], { message: 'Role wajib dipilih' }),
    level: z.enum(['siaga', 'penggalang', 'penegak'], { message: 'Level wajib dipilih' }),
    institution_id: z.string().trim().optional(),
    district_id: z.string().trim().optional(),
  })
  .refine(
    (data) => {
      if (data.role === 'institution' && !data.institution_id) {
        return false;
      }
      return true;
    },
    {
      message: 'Lembaga wajib dipilih ketika role adalah institution',
      path: ['institution_id'],
    },
  )
  .refine(
    (data) => {
      if (data.role === 'kwarran' && !data.district_id) {
        return false;
      }
      return true;
    },
    {
      message: 'Distrik wajib dipilih ketika role adalah kwarran',
      path: ['district_id'],
    },
  );

export type UserFormValues = z.infer<typeof userFormSchema>;
