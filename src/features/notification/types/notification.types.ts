interface NotificationPaginatedParams extends BaseParams {
  is_read?: boolean;
}

interface NotificationPayload {
  title: string;
  message: string;
  all_roles: boolean;
  roles?: string[];
}

interface NotificationPaginatedResponse {
  id: string;
  type?: string;
  title: string;
  message: string;
  payload?: null | {
    [key: string]: unknown;
  };
  is_read: boolean;
  can_update?: boolean;
  read_at?: string | null;
  all_roles?: boolean;
  roles?: string[];
  created_at?: string | null;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
}
