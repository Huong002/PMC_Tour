import api from './api';
import { ApiResponse, UserDto, UserDetailDto, UserCreateDto, UserUpdateDto, PaginatedResult } from '../types';

export const customerService = {
  getAll: async (params?: Record<string, any>) => {
    const res = await api.get<ApiResponse<PaginatedResult<UserDto>>>('/admin/users', { params });
    return res.data;
  },
  getById: async (id: number) => {
    const res = await api.get<ApiResponse<UserDetailDto>>(`/admin/users/${id}`);
    return res.data;
  },
  create: async (data: UserCreateDto) => {
    const res = await api.post<ApiResponse<UserDto>>('/admin/users', data);
    return res.data;
  },
  update: async (id: number, data: UserUpdateDto) => {
    const res = await api.put<ApiResponse<UserDto>>(`/admin/users/${id}`, data);
    return res.data;
  },
  toggleStatus: async (id: number) => {
    const res = await api.patch<ApiResponse<UserDto>>(`/admin/users/${id}/status`);
    return res.data;
  },
  resetPassword: async (id: number, data: { newPassword: string }) => {
    const res = await api.post<ApiResponse<any>>(`/admin/users/${id}/reset-password`, data);
    return res.data;
  },
  getRegistrations: async (id: number, params?: Record<string, any>) => {
    const res = await api.get<ApiResponse<PaginatedResult<any>>>(`/admin/users/${id}/registrations`, { params });
    return res.data;
  },
};
