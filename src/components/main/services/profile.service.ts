import { AxiosInstance } from "axios";

export async function changePassword(api: AxiosInstance, payload: ChangePasswordPayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.post<ApiResponse<BaseResponse>>('/auth/change-password', payload);

  return data;
}

export async function updateProfile(api: AxiosInstance, payload: UpdateProfilePayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.put<ApiResponse<BaseResponse>>('/auth/profile', payload);

  return data;
}