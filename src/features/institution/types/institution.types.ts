interface InstitutionAllParams {
  search?: string;
  limit: number;
  district_id?: string;
  level?: string;
}

interface InstitutionPaginatedParams extends BaseParams {
  district_id?: string;
  level?: string;
}

interface InstitutionPayload {
  name: string;
  district_id: string;
  address: string;
  male_scout_unit_number: string;
  female_scout_unit_number: string;
  male_scout_unit_leader_name?: string;
  female_scout_unit_leader_name?: string;
  male_scout_unit_leader_nta?: string;
  female_scout_unit_leader_nta?: string;
  principal_name?: string;
  principal_nip?: string;
  level: string;
}

interface InstitutionAllResponse {
  id: string;
  name: string;
  district_id: string;
  district_name: string;
}

interface InstitutionPaginatedResponse {
  id: string;
  name: string;
  district_id: string;
  district_name: string;
  address: string;

  male_scout_unit_number: string;
  female_scout_unit_number: string;

  male_scout_unit_leader_name: string;
  female_scout_unit_leader_name: string;

  male_scout_unit_leader_nta: string;
  female_scout_unit_leader_nta: string;

  principal_name: string;
  principal_nip: string;

  level: 'siaga' | 'penggalang' | 'penegak';

  createdAt?: string | null;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;

  created_at?: string | null;
  created_by?: string | null;
  updated_at?: string | null;
  updated_by?: string | null;
}
