import api from './api';
import { ApiResponse } from '../types';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const contactService = {
  create: async (data: ContactFormData) => {
    const res = await api.post<ApiResponse<any>>('/Contact', data);
    return res.data;
  },
  getAll: async (params?: Record<string, any>) => {
    const res = await api.get<ApiResponse<any>>('/Contact', { params });
    return res.data;
  },
  getById: async (id: number) => {
    const res = await api.get<ApiResponse<any>>(`/Contact/${id}`);
    return res.data;
  },
  delete: async (id: number) => {
    const res = await api.delete<ApiResponse<any>>(`/Contact/${id}`);
    return res.data;
  },
};
