import { AxiosInstance } from 'axios';

export async function getGarudaSummary(api: AxiosInstance, params: GarudaSummaryParams): Promise<ApiResponse<GarudaSummaryResponse>> {
  const { data } = await api.get<ApiResponse<GarudaSummaryResponse>>('/garuda/summary', {
    params,
  });

  return data;
}

export async function getGarudaPaginated(api: AxiosInstance, params: GarudaPaginatedParams): Promise<PaginatedResponse<GarudaPaginatedResponse>> {
  const { data } = await api.get<ApiResponse<PaginatedResponse<GarudaPaginatedResponse>>>('/garuda/paginated', {
    params,
  });

  return data;
}

export async function createGarudaBulk(api: AxiosInstance, payload: CreateGarudaBulkPayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.post<ApiResponse<BaseResponse>>('/garuda/create/bulk', payload);

  return data;
}

export async function updateApprovalGaruda(api: AxiosInstance, id: string, payload: UpdateApprovalGarudaPayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.put<ApiResponse<BaseResponse>>(`/garuda/update-approval/${id}`, payload);

  return data;
}

export async function updateApprovalGarudaBulk(api: AxiosInstance, payload: UpdateApprovalGarudaBulkPayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.put<ApiResponse<BaseResponse>>('/garuda/update-approval/bulk', payload);

  return data;
}

export async function deleteGaruda(api: AxiosInstance, id: string): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.delete<ApiResponse<BaseResponse>>(`/garuda/delete/${id}`);
  return data;
}
