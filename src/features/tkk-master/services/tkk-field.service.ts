import { AxiosInstance } from 'axios';

export async function getTkkFieldAll(api: AxiosInstance, params?: TkkFieldAllParams): Promise<ApiResponse<TkkFieldAllResponse[]>> {
  const { data } = await api.get<ApiResponse<TkkFieldAllResponse[]>>('/tkk/field/all', {
    params,
  });

  return data;
}

export async function getTkkFieldPaginated(api: AxiosInstance, params: TkkFieldPaginatedParams): Promise<PaginatedResponse<TkkFieldPaginatedResponse>> {
  const { data } = await api.get<ApiResponse<PaginatedResponse<TkkFieldPaginatedResponse>>>('/tkk/field/paginated', {
    params,
  });

  return data;
}

export async function createTkkField(api: AxiosInstance, payload: TkkFieldPayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.post<ApiResponse<BaseResponse>>('/tkk/field/create', payload);

  return data;
}

export async function updateTkkField(api: AxiosInstance, id: string, payload: TkkFieldPayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.put<ApiResponse<BaseResponse>>(`/tkk/field/update/${id}`, payload);

  return data;
}

export async function deleteTkkField(api: AxiosInstance, id: string): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.delete<ApiResponse<BaseResponse>>(`/tkk/field/delete/${id}`);
  return data;
}
