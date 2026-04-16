import { z } from 'zod';

export const institutionFormSchema = z.object({
  name: z.string().trim().min(3, 'Nama lembaga minimal 3 karakter'),
  district_id: z.string().trim().min(1, 'Kecamatan wajib dipilih'),
  address: z.string().trim().min(3, 'Alamat minimal 3 karakter'),
  male_scout_unit_number: z.string().trim().min(1, 'Nomor gugus depan putra wajib diisi'),
  female_scout_unit_number: z.string().trim().min(1, 'Nomor gugus depan putri wajib diisi'),
  male_scout_unit_leader_name: z.string().trim().optional(),
  female_scout_unit_leader_name: z.string().trim().optional(),
  male_scout_unit_leader_nta: z.string().trim().optional(),
  female_scout_unit_leader_nta: z.string().trim().optional(),
  principal_name: z.string().trim().optional(),
  principal_nip: z.string().trim().optional(),
  level: z.string().trim().min(1, 'Level wajib dipilih'),
});

export type InstitutionFormValues = z.infer<typeof institutionFormSchema>;
