import { z } from 'zod';

export const notificationFormSchema = z
  .object({
    title: z.string().min(3, 'Judul minimal 3 karakter'),
    message: z.string().min(3, 'Pesan minimal 3 karakter'),
    all_roles: z.boolean(),
    roles: z.array(z.string()).optional(),
  })
  .superRefine((value, ctx) => {
    if (!value.all_roles && (!value.roles || value.roles.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['roles'],
        message: 'Pilih minimal 1 role atau aktifkan semua role',
      });
    }
  });

export type NotificationFormValues = z.infer<typeof notificationFormSchema>;
