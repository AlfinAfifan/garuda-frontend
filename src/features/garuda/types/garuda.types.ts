interface GarudaSummaryParams {
  level: string
  is_approved?: boolean;
}

interface GarudaPaginatedParams extends BaseParams {
  level: string
  is_approved?: boolean;
  institution_id?: string;
}

interface GarudaSummaryResponse {
  total_data: number;
  total_approved: number;
  total_pending: number;
}

interface CreateGarudaBulkPayload {
  member_ids: string[];
}

interface UpdateApprovalGarudaPayload {
  is_approved: boolean;
}

interface UpdateApprovalGarudaBulkPayload {
  ids: string[];
  is_approved: boolean;
}

interface GarudaPaginatedResponse {
  id: string;

  total_tku: number;
  is_approved: boolean;

  level_tku: string;
  level: 'siaga' | 'penggalang' | 'penegak';

  member_id: string;
  member_name: string;

  approved_by: string;
  approved_by_label: string;

  created_at: string | null;
  created_by: string;
  updated_at: string | null;
  updated_by: string;
}
