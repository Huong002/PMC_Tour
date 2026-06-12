import api from './api';
import { ApiResponse, UserDto, UserDetailDto, UserCreateDto, UserUpdateDto, PaginatedResult } from '../types';

export const customerService = {
  getAll: async (params?: Record<string, any>) => {
    const res = await api.get<ApiResponse<PaginatedResult<UserDto>>>('/Customers', { params });
    return res.data;
  },
  getById: async (id: number) => {
    const res = await api.get<ApiResponse<UserDetailDto>>(`/Customers/${id}`);
    return res.data;
  },
  create: async (data: UserCreateDto) => {
    const res = await api.post<ApiResponse<UserDto>>('/Customers', data);
    return res.data;
  },
  update: async (id: number, data: UserUpdateDto) => {
    const res = await api.put<ApiResponse<UserDto>>(`/Customers/${id}`, data);
    return res.data;
  },
  delete: async (id: number) => {
    const res = await api.delete<ApiResponse<any>>(`/Customers/${id}`);
    return res.data;
  },
};
