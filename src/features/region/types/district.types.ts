interface DistrictAllParams {
  search?: string;
  city_id?: string;
}

interface DistrictPaginatedParams extends BaseParams {
  city_id?: string;
}

interface DistrictPayload {
  name: string;
  city_id: string;
}

interface DistrictAllResponse {
  id: string;
  name: string;
  city_id: string;
  city_name: string;
}

interface DistrictPaginatedResponse extends DistrictAllResponse {
  is_active: boolean;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}
