import { AxiosInstance } from 'axios';

export async function getNotificationAll(api: AxiosInstance): Promise<ApiResponse<NotificationPaginatedResponse[]>> {
  const { data } = await api.get<ApiResponse<NotificationPaginatedResponse[]>>('/notification/all');

  return data;
}

export async function getNotificationPaginated(api: AxiosInstance, params: NotificationPaginatedParams): Promise<PaginatedResponse<NotificationPaginatedResponse>> {
  const { data } = await api.get<ApiResponse<PaginatedResponse<NotificationPaginatedResponse>>>('/notification/paginated', {
    params,
  });

  return data;
}

export async function createNotification(api: AxiosInstance, payload: NotificationPayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.post<ApiResponse<BaseResponse>>('/notification/create', payload);

  return data;
}

export async function updateNotification(api: AxiosInstance, id: string, payload: NotificationPayload): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.put<ApiResponse<BaseResponse>>(`/notification/update/${id}`, payload);

  return data;
}

export async function readByIdNotification(api: AxiosInstance, id: string): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.put<ApiResponse<BaseResponse>>(`/notification/read/${id}`);

  return data;
}

export async function readAllNotification(api: AxiosInstance): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.put<ApiResponse<BaseResponse>>('/notification/read-all');

  return data;
}

export async function deleteNotification(api: AxiosInstance, id: string): Promise<ApiResponse<BaseResponse>> {
  const { data } = await api.delete<ApiResponse<BaseResponse>>(`/notification/delete/${id}`);
  return data;
}
