interface ReligionAllResponse {
  id: string;
  name: string;
}

interface ReligionPaginatedResponse extends ReligionAllResponse {
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

interface ReligionPayload {
  name: string;
}
