interface TkkTypeAllParams {
  search?: string;
  level?: string;
}

interface TkkTypePaginatedParams extends BaseParams {
  level?: string;
  tkk_field_id?: string;
}

interface TkkTypePayload {
  name: string;
  level: string;
  tkk_field_id: string;
}

interface TkkTypeAllResponse {
  id: string;
  name: string;
  level: string;
}

interface TkkTypePaginatedResponse extends TkkTypeAllResponse {
  tkk_field_id: string;
  tkk_field_name: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}
