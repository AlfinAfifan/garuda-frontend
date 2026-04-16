interface TkuSummaryParams {
  level: string;
}

interface TkuPaginatedParams extends BaseParams {
  institution_id: string;
  member_id: string;
  level: string;
  level_tku: string;
}

interface CreateTkuPayload {
  member_id: string;
}

interface CreateTkuBulkPayload {
  member_ids: string[];
}

interface UpdateTkuLevelPayload {
  level_tku: string;
}

interface UpdateTkuLevelBulkPayload {
  ids: string[];
  level_tku: string;
}

interface TkuSummaryResponse {
  [key: string]: number | undefined;
  total_mula?: number;
  total_bantu?: number;
  total_tata?: number;
  total_ramu?: number;
  total_rakit?: number;
  total_terap?: number;
  total_bantara?: number;
  total_laksana?: number;
}

interface TkuPaginatedResponse {
  id: string;
  sk_number: string;
  sk_date: string;
  level_tku: string;
  level: string;
  member_id: string;
  member_name: string;
  created_at: string | null;
  created_by: string;
  updated_at: string | null;
  updated_by: string;
}
