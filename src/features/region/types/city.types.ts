interface CityAllParams {
  search?: string;
  province_id?: string;
}

interface CityPaginatedParams extends BaseParams {
  province_id?: string;
}

interface CityPayload {
  name: string;
  province_id: string;
}

interface CityAllResponse {
  id: string;
  name: string;
  province_id: string;
  province_name: string;
}

interface CityPaginatedResponse extends CityAllResponse {
  is_active: boolean;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}
