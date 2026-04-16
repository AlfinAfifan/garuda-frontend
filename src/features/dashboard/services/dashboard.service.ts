import { AxiosInstance } from 'axios';

export async function getDashboard(api: AxiosInstance, params: DashboardParams): Promise<ApiResponse<DashboardResponse>> {
  const { data } = await api.get<ApiResponse<DashboardResponse>>('/dashboard/overview', {
    params,
  });

  return data;
}
