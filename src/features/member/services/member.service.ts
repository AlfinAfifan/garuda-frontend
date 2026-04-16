import { AxiosInstance } from 'axios';

export async function getMemberPaginated(api: AxiosInstance, params: MemberPaginatedParams): Promise<PaginatedResponse<MemberPaginatedResponse>> {
  const { data } = await api.get<ApiResponse<PaginatedResponse<MemberPaginatedResponse>>>('/member/paginated', {
    params,
  });

  return data;
}

export async function createMember(api: AxiosInstance, payload: MemberPayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.post<ApiResponse<BaseResponse>>('/member/create', payload);

  return data;
}

export async function updateMember(api: AxiosInstance, id: string, payload: MemberPayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.put<ApiResponse<BaseResponse>>(`/member/update/${id}`, payload);

  return data;
}

export async function deleteMember(api: AxiosInstance, id: string): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.delete<ApiResponse<BaseResponse>>(`/member/delete/${id}`);
  return data;
}
