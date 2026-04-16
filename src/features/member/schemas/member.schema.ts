import { z } from 'zod';

export const memberFormSchema = z.object({
  name: z.string().trim().min(3, 'Nama minimal 3 karakter'),
  phone: z.string().trim().min(1, 'Nomor telepon wajib diisi'),
  nta: z.string().trim().min(1, 'NTA wajib diisi'),
  nik: z.string().trim().min(1, 'NIK wajib diisi'),
  talent: z.string().trim().min(1, 'Bakat wajib diisi'),
  address: z.string().trim().min(3, 'Alamat minimal 3 karakter'),

  father_name: z.string().trim().min(3, 'Nama ayah minimal 3 karakter'),
  mother_name: z.string().trim().min(3, 'Nama ibu minimal 3 karakter'),
  parent_phone: z.string().trim().min(1, 'Nomor telepon orang tua wajib diisi'),
  parent_address: z.string().trim().min(3, 'Alamat orang tua minimal 3 karakter'),

  entry_level: z.string().trim().min(1, 'Tingkat masuk wajib diisi'),
  exit_reason: z.string().trim().optional(),

  birthdate: z.string().trim().min(1, 'Tanggal lahir wajib diisi'),
  father_birthdate: z.string().trim().min(1, 'Tanggal lahir ayah wajib diisi'),
  mother_birthdate: z.string().trim().min(1, 'Tanggal lahir ibu wajib diisi'),

  entry_date: z.string().trim().min(1, 'Tanggal masuk wajib diisi'),
  exit_date: z.string().trim().optional(),

  father_birthplace: z.string().trim().min(1, 'Tempat lahir ayah wajib diisi'),
  mother_birthplace: z.string().trim().min(1, 'Tempat lahir ibu wajib diisi'),
  birthplace: z.string().trim().min(1, 'Tempat lahir wajib diisi'),

  religion: z.string().trim().min(1, 'Agama wajib dipilih'),
  institution_id: z.string().trim().min(1, 'Lembaga wajib dipilih'),

  citizenship: z.enum(['wni', 'wna'], { message: 'Kewarganegaraan wajib dipilih' }),
  gender: z.enum(['male', 'female'], { message: 'Jenis kelamin wajib dipilih' }),

  level: z.enum(['siaga', 'penggalang', 'penegak', ''], { message: 'Level wajib dipilih' }),
});

export type MemberFormValues = z.infer<typeof memberFormSchema>;
