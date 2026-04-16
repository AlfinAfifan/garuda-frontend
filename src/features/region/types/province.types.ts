interface ProvinceAllResponse {
  id: string;
  name: string;
}

interface ProvincePaginatedResponse extends ProvinceAllResponse {
  is_active: boolean;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

interface ProvincePayload {
  name: string;
}
