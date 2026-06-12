import api from './api';
import { ApiResponse } from '../types';

export const paymentService = {
  create: async (data: { bookingId: number; amount: number; paymentMethod: string }) => {
    const res = await api.post<ApiResponse<any>>('/Payments', data);
    return res.data;
  },
  getById: async (id: number) => {
    const res = await api.get<ApiResponse<any>>(`/Payments/${id}`);
    return res.data;
  },
  getAll: async (params?: Record<string, any>) => {
    const res = await api.get<ApiResponse<any>>('/Payments', { params });
    return res.data;
  },
};
