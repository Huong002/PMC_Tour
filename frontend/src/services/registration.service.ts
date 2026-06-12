import api from './api';
import { ApiResponse, RegistrationDto, RegistrationDetailDto, PaginatedResult } from '../types';

export const bookingService = {
  getAll: async (params?: Record<string, any>) => {
    const res = await api.get<ApiResponse<PaginatedResult<RegistrationDto>>>('/Bookings', { params });
    return res.data;
  },
  getById: async (id: number) => {
    const res = await api.get<ApiResponse<RegistrationDetailDto>>(`/Bookings/${id}`);
    return res.data;
  },
  create: async (data: { customerId: number; tourId: number; startDate: string; endDate: string; numAdults: number; numChildren: number; notes?: string; discountCode?: string }) => {
    const res = await api.post<ApiResponse<RegistrationDto>>('/Bookings', data);
    return res.data;
  },
  updateStatus: async (id: number, status: number) => {
    const res = await api.put<ApiResponse<RegistrationDto>>(`/Bookings/${id}/status`, status);
    return res.data;
  },
};

// Legacy alias for backward compatibility with existing pages
export const registrationService = {
  create: (data: { customerId: number; tourId: number; startDate: string; endDate: string; numAdults: number; numChildren: number; notes?: string }) => bookingService.create(data),
  getAll: bookingService.getAll,
  getMyRegistrations: (params?: Record<string, any>) => bookingService.getAll(params),
  getById: bookingService.getById,
  approve: async (id: number) => bookingService.updateStatus(id, 1),
  reject: async (id: number) => bookingService.updateStatus(id, 4),
  confirmParticipation: async (id: number) => bookingService.updateStatus(id, 2),
  complete: async (id: number) => bookingService.updateStatus(id, 3),
  noShow: async (id: number) => bookingService.updateStatus(id, 4),
  cancel: async (id: number, _data: { reason: string }) => bookingService.updateStatus(id, 4),
};
