import api from './api';
import { ApiResponse, PaginatedResult } from '../types';

export interface ContactMessageDto {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface CreateContactRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const contactService = {
  getAll: async (params?: Record<string, any>) => {
    const res = await api.get<ApiResponse<PaginatedResult<ContactMessageDto>>>('/Contacts', { params });
    return res.data;
  },
  getById: async (id: number) => {
    const res = await api.get<ApiResponse<ContactMessageDto>>(`/Contacts/${id}`);
    return res.data;
  },
  create: async (data: CreateContactRequest) => {
    const res = await api.post<ApiResponse<ContactMessageDto>>('/Contacts', data);
    return res.data;
  },
  delete: async (id: number) => {
    const res = await api.delete<ApiResponse<any>>(`/Contacts/${id}`);
    return res.data;
  },
};
