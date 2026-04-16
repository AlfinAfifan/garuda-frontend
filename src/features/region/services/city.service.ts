import { AxiosInstance } from 'axios';

export async function getCityAll(api: AxiosInstance): Promise<ApiResponse<CityAllResponse[]>> {
  const { data } = await api.get<ApiResponse<CityAllResponse[]>>('/region/city/all');

  return data;
}

export async function getCityPaginated(api: AxiosInstance, params: BaseParams): Promise<PaginatedResponse<CityPaginatedResponse>> {
  const { data } = await api.get<ApiResponse<PaginatedResponse<CityPaginatedResponse>>>('/region/city/paginated', {
    params,
  });

  return data;
}

export async function createCity(api: AxiosInstance, payload: CityPayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.post<ApiResponse<BaseResponse>>('/region/city/create', payload);

  return data;
}

export async function updateCity(api: AxiosInstance, id: string, payload: CityPayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.put<ApiResponse<BaseResponse>>(`/region/city/update/${id}`, payload);

  return data;
}

export async function deleteCity(api: AxiosInstance, id: string): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.delete<ApiResponse<BaseResponse>>(`/region/city/delete/${id}`);
  return data;
}
