import api from './api';
import { ApiResponse, PaymentDto, CreatePaymentRequest, PaginatedResult } from '../types';

export const paymentService = {
  create: async (data: CreatePaymentRequest) => {
    const res = await api.post<ApiResponse<PaymentDto>>('/payments', data);
    return res.data;
  },
  getById: async (id: number) => {
    const res = await api.get<ApiResponse<PaymentDto>>(`/payments/${id}`);
    return res.data;
  },
  getAll: async (params?: Record<string, any>) => {
    const res = await api.get<ApiResponse<PaginatedResult<PaymentDto>>>('/payments', { params });
    return res.data;
  },
  confirm: async (id: number) => {
    const res = await api.patch<ApiResponse<PaymentDto>>(`/payments/${id}/confirm`);
    return res.data;
  },
  refund: async (id: number, data: { amount: number; reason: string }) => {
    const res = await api.patch<ApiResponse<PaymentDto>>(`/payments/${id}/refund`, data);
    return res.data;
  },
};
