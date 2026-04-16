import { AxiosInstance } from 'axios';

export async function getProvinceAll(api: AxiosInstance): Promise<ApiResponse<ProvinceAllResponse[]>> {
  const { data } = await api.get<ApiResponse<ProvinceAllResponse[]>>('/region/province/all');

  return data;
}

export async function getProvincePaginated(api: AxiosInstance, params: BaseParams): Promise<PaginatedResponse<ProvincePaginatedResponse>> {
  const { data } = await api.get<ApiResponse<PaginatedResponse<ProvincePaginatedResponse>>>('/region/province/paginated', {
    params,
  });

  return data;
}

export async function createProvince(api: AxiosInstance, payload: ProvincePayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.post<ApiResponse<BaseResponse>>('/region/province/create', payload);

  return data;
}

export async function updateProvince(api: AxiosInstance, id: string, payload: ProvincePayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.put<ApiResponse<BaseResponse>>(`/region/province/update/${id}`, payload);

  return data;
}

export async function deleteProvince(api: AxiosInstance, id: string): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.delete<ApiResponse<BaseResponse>>(`/region/province/delete/${id}`);
  return data;
}
