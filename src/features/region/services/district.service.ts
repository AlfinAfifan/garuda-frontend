import { AxiosInstance } from 'axios';

export async function getDistrictAll(api: AxiosInstance, params?: Record<string, any>): Promise<ApiResponse<DistrictAllResponse[]>> {
  const { data } = await api.get<ApiResponse<DistrictAllResponse[]>>('/region/district/all', {
    params,
  });

  return data;
}

export async function getDistrictPaginated(api: AxiosInstance, params: BaseParams): Promise<PaginatedResponse<DistrictPaginatedResponse>> {
  const { data } = await api.get<ApiResponse<PaginatedResponse<DistrictPaginatedResponse>>>('/region/district/paginated', {
    params,
  });

  return data;
}

export async function createDistrict(api: AxiosInstance, payload: DistrictPayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.post<ApiResponse<BaseResponse>>('/region/district/create', payload);

  return data;
}

export async function updateDistrict(api: AxiosInstance, id: string, payload: DistrictPayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.put<ApiResponse<BaseResponse>>(`/region/district/update/${id}`, payload);

  return data;
}

export async function deleteDistrict(api: AxiosInstance, id: string): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.delete<ApiResponse<BaseResponse>>(`/region/district/delete/${id}`);
  return data;
}
