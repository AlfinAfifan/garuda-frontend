import { AxiosInstance } from 'axios';

export async function getTkkSummary(api: AxiosInstance, params: TkkSummaryParams): Promise<ApiResponse<TkkSummaryResponse>> {
  const { data } = await api.get<ApiResponse<TkkSummaryResponse>>('/tkk/summary', {
    params,
  });

  return data;
}

export async function getTkkPaginated(api: AxiosInstance, params: TkkPaginatedParams): Promise<PaginatedResponse<TkkPaginatedResponse>> {
  const { data } = await api.get<ApiResponse<PaginatedResponse<TkkPaginatedResponse>>>('/tkk/paginated', {
    params,
  });

  return data;
}

export async function createTkk(api: AxiosInstance, payload: CreateTkkPayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.post<ApiResponse<BaseResponse>>('/tkk/create', payload);

  return data;
}

export async function createTkkBulk(api: AxiosInstance, payload: CreateTkkBulkPayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.post<ApiResponse<BaseResponse>>('/tkk/create/bulk', payload);

  return data;
}

export async function updateTkkLevel(api: AxiosInstance, id: string, payload: UpdateTkkLevelPayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.put<ApiResponse<BaseResponse>>(`/tkk/update-level/${id}`, payload);

  return data;
}

export async function updateTkkLevelBulk(api: AxiosInstance, payload: UpdateTkkLevelBulkPayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.put<ApiResponse<BaseResponse>>('/tkk/update-level/bulk', payload);

  return data;
}

export async function deleteTkk(api: AxiosInstance, id: string): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.delete<ApiResponse<BaseResponse>>(`/tkk/delete/${id}`);
  return data;
}
