interface TkkFieldAllParams {
  search?: string;
  level?: string;
}

interface TkkFieldPaginatedParams extends BaseParams {
  level?: string;
}

interface TkkFieldPayload {
  name: string;
  level: string;
  color: string;
}

interface TkkFieldAllResponse {
  id: string;
  name: string;
  level: string;
}

interface TkkFieldPaginatedResponse extends TkkFieldAllResponse {
  color: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}
