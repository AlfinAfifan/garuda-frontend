interface TkkSummaryParams {
  level: string;
}

interface TkkPaginatedParams extends BaseParams {
  institution_id: string;
  member_id: string;
  tkk_type_id: string;
  level: string;
  level_tkk: string;
}

interface CreateTkkPayload {
  member_id: string;
  tkk_type_id: string;
  level_tkk: string;
}

interface CreateTkkBulkPayload {
  member_ids: string[];
  tkk_type_id: string;
  level_tkk: string;
}

interface UpdateTkkLevelPayload {
  level_tkk: string;
}

interface UpdateTkkLevelBulkPayload {
  ids: string[];
  level_tkk: string;
}

interface TkkSummaryResponse {
  [key: string]: number | undefined;
  siaga: number;
  purwa: number;
  madya: number;
  utama: number;
}

interface TkkPaginatedResponse {
  id: string;
  sk_number: string;
  sk_date: string;
  level_tkk: string;
  level: string;
  member_id: string;
  member_name: string;
  tkk_type_id: string;
  tkk_type_name: string;
  created_at: string | null;
  created_by: string;
  updated_at: string | null;
  updated_by: string;
}
