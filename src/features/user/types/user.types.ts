interface UserAllParams {
  search?: string;
  institution_id?: string;
  district_id?: string;
  role?: string;
  level?: string;
}

interface UserPaginatedParams extends BaseParams {
  institution_id?: string;
  district_id?: string;
  role?: string;
  level?: string;
}

interface UserPayload {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'kwarran' | 'institution';
  level: 'siaga' | 'penggalang' | 'penegak';
  institution_id: string;
  district_id: string;
}

interface UpdateStatusUserPayload {
  is_active: boolean;
}

interface UserAllResponse {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'kwarran' | 'institution';
  level: 'siaga' | 'penggalang' | 'penegak';
  is_active: boolean;
  institution_id: string;
  district_id: string;
  institution_name: string | null;
  district_name: string | null;
}

interface UserPaginatedResponse {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'kwarran' | 'institution';
  level: 'siaga' | 'penggalang' | 'penegak';
  is_active: boolean;
  can_update?: boolean;
  institution_id: string;
  district_id: string;
  institution_name: string | null;
  district_name: string | null;
  createdAt?: string | null;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;
  created_at?: string | null;
  created_by?: string | null;
  updated_at?: string | null;
  updated_by?: string | null;
}
