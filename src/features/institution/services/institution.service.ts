import { AxiosInstance } from 'axios';

export async function getInstitutionAll(api: AxiosInstance, params?: InstitutionAllParams): Promise<ApiResponse<InstitutionAllResponse[]>> {
  const { data } = await api.get<ApiResponse<InstitutionAllResponse[]>>('/institution/all', {
    params,
  });

  return data;
}

export async function getInstitutionPaginated(api: AxiosInstance, params: InstitutionPaginatedParams): Promise<PaginatedResponse<InstitutionPaginatedResponse>> {
  const { data } = await api.get<ApiResponse<PaginatedResponse<InstitutionPaginatedResponse>>>('/institution/paginated', {
    params,
  });

  return data;
}

export async function createInstitution(api: AxiosInstance, payload: InstitutionPayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.post<ApiResponse<BaseResponse>>('/institution/create', payload);

  return data;
}

export async function updateInstitution(api: AxiosInstance, id: string, payload: InstitutionPayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.put<ApiResponse<BaseResponse>>(`/institution/update/${id}`, payload);

  return data;
}

export async function deleteInstitution(api: AxiosInstance, id: string): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.delete<ApiResponse<BaseResponse>>(`/institution/delete/${id}`);
  return data;
}
