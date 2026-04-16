import { AxiosInstance } from 'axios';

export async function getTkuSummary(api: AxiosInstance, params: TkuSummaryParams): Promise<ApiResponse<TkuSummaryResponse>> {
  const { data } = await api.get<ApiResponse<TkuSummaryResponse>>('/tku/summary', {
    params,
  });

  return data;
}

export async function getTkuPaginated(api: AxiosInstance, params: TkuPaginatedParams): Promise<PaginatedResponse<TkuPaginatedResponse>> {
  const { data } = await api.get<ApiResponse<PaginatedResponse<TkuPaginatedResponse>>>('/tku/paginated', {
    params,
  });

  return data;
}

export async function createTku(api: AxiosInstance, payload: CreateTkuPayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.post<ApiResponse<BaseResponse>>('/tku/create', payload);

  return data;
}

export async function createTkuBulk(api: AxiosInstance, payload: CreateTkuBulkPayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.post<ApiResponse<BaseResponse>>('/tku/create/bulk', payload);

  return data;
}

export async function updateTkuLevel(api: AxiosInstance, id: string, payload: UpdateTkuLevelPayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.put<ApiResponse<BaseResponse>>(`/tku/update-level/${id}`, payload);

  return data;
}

export async function updateTkuLevelBulk(api: AxiosInstance, payload: UpdateTkuLevelBulkPayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.put<ApiResponse<BaseResponse>>('/tku/update-level/bulk', payload);

  return data;
}

export async function deleteTku(api: AxiosInstance, id: string): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.delete<ApiResponse<BaseResponse>>(`/tku/delete/${id}`);
  return data;
}
