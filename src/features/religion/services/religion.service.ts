import { AxiosInstance } from 'axios';

export async function getReligionAll(api: AxiosInstance): Promise<ApiResponse<ReligionAllResponse[]>> {
  const { data } = await api.get<ApiResponse<ReligionAllResponse[]>>('/religion/all');

  return data;
}

export async function getReligionPaginated(api: AxiosInstance, params: BaseParams): Promise<PaginatedResponse<ReligionPaginatedResponse>> {
  const { data } = await api.get<ApiResponse<PaginatedResponse<ReligionPaginatedResponse>>>('/religion/paginated', {
    params,
  });

  return data;
}

export async function createReligion(api: AxiosInstance, payload: ReligionPayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.post<ApiResponse<BaseResponse>>('/religion/create', payload);

  return data;
}

export async function updateReligion(api: AxiosInstance, id: string, payload: ReligionPayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.put<ApiResponse<BaseResponse>>(`/religion/update/${id}`, payload);

  return data;
}

export async function deleteReligion(api: AxiosInstance, id: string): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.delete<ApiResponse<BaseResponse>>(`/religion/delete/${id}`);
  return data;
}
