import { AxiosInstance } from 'axios';

export async function getTkkTypeAll(api: AxiosInstance, params?: TkkTypeAllParams): Promise<ApiResponse<TkkTypeAllResponse[]>> {
  const { data } = await api.get<ApiResponse<TkkTypeAllResponse[]>>('/tkk/type/all', {
    params,
  });

  return data;
}

export async function getTkkTypePaginated(api: AxiosInstance, params: TkkTypePaginatedParams): Promise<PaginatedResponse<TkkTypePaginatedResponse>> {
  const { data } = await api.get<ApiResponse<PaginatedResponse<TkkTypePaginatedResponse>>>('/tkk/type/paginated', {
    params,
  });

  return data;
}

export async function createTkkType(api: AxiosInstance, payload: TkkTypePayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.post<ApiResponse<BaseResponse>>('/tkk/type/create', payload);

  return data;
}

export async function updateTkkType(api: AxiosInstance, id: string, payload: TkkTypePayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.put<ApiResponse<BaseResponse>>(`/tkk/type/update/${id}`, payload);

  return data;
}

export async function deleteTkkType(api: AxiosInstance, id: string): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.delete<ApiResponse<BaseResponse>>(`/tkk/type/delete/${id}`);
  return data;
}
