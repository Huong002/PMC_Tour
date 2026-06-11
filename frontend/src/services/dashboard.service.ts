import api from './api';
import { ApiResponse } from '../types';

export const dashboardService = {
  getSummary: async () => {
    const res = await api.get<ApiResponse<any>>('/admin/dashboard');
    return res.data;
  },
  getRevenue: async (params?: { fromDate?: string; toDate?: string }) => {
    const res = await api.get<ApiResponse<any>>('/admin/dashboard/revenue', { params });
    return res.data;
  },
};
