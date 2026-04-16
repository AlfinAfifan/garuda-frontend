import { AxiosInstance } from 'axios';

export async function getUserAll(api: AxiosInstance, params: UserAllParams): Promise<ApiResponse<UserAllResponse[]>> {
  const { data } = await api.get<ApiResponse<UserAllResponse[]>>('/users/all', { params });

  return data;
}

export async function getUserPaginated(api: AxiosInstance, params: UserPaginatedParams): Promise<PaginatedResponse<UserPaginatedResponse>> {
  const { data } = await api.get<ApiResponse<PaginatedResponse<UserPaginatedResponse>>>('/users/paginated', {
    params,
  });

  return data;
}

export async function createUser(api: AxiosInstance, payload: UserPayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.post<ApiResponse<BaseResponse>>('/users/create', payload);

  return data;
}

export async function updateUser(api: AxiosInstance, id: string, payload: UserPayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.put<ApiResponse<BaseResponse>>(`/users/update/${id}`, payload);

  return data;
}

export async function updateStatusUser(api: AxiosInstance, id: string, payload: UpdateStatusUserPayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.put<ApiResponse<BaseResponse>>(`/users/update-status/${id}`, payload);

  return data;
}

export async function deleteUser(api: AxiosInstance, id: string): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.delete<ApiResponse<BaseResponse>>(`/users/delete/${id}`);
  return data;
}
