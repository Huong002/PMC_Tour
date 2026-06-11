import api from './api';
import { ApiResponse, RegistrationDto, RegistrationDetailDto, PaginatedResult } from '../types';

export const registrationService = {
  create: async (data: { tourId: number }) => {
    const res = await api.post<ApiResponse<RegistrationDto>>('/registrations', data);
    return res.data;
  },
  getAll: async (params?: Record<string, any>) => {
    const res = await api.get<ApiResponse<PaginatedResult<RegistrationDto>>>('/registrations', { params });
    return res.data;
  },
  getMyRegistrations: async (params?: Record<string, any>) => {
    const res = await api.get<ApiResponse<PaginatedResult<RegistrationDto>>>('/registrations/my', { params });
    return res.data;
  },
  getById: async (id: number) => {
    const res = await api.get<ApiResponse<RegistrationDetailDto>>(`/registrations/${id}`);
    return res.data;
  },
  approve: async (id: number, data?: { note?: string }) => {
    const res = await api.patch<ApiResponse<RegistrationDto>>(`/registrations/${id}/approve`, data);
    return res.data;
  },
  reject: async (id: number, data?: { note?: string }) => {
    const res = await api.patch<ApiResponse<RegistrationDto>>(`/registrations/${id}/reject`, data);
    return res.data;
  },
  cancel: async (id: number, data: { reason: string }) => {
    const res = await api.patch<ApiResponse<RegistrationDto>>(`/registrations/${id}/cancel`, data);
    return res.data;
  },
  confirmParticipation: async (id: number) => {
    const res = await api.patch<ApiResponse<RegistrationDto>>(`/registrations/${id}/confirm-participation`);
    return res.data;
  },
  complete: async (id: number) => {
    const res = await api.patch<ApiResponse<RegistrationDto>>(`/registrations/${id}/complete`);
    return res.data;
  },
  noShow: async (id: number) => {
    const res = await api.patch<ApiResponse<RegistrationDto>>(`/registrations/${id}/no-show`);
    return res.data;
  },
};
