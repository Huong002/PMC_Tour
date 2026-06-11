import api from './api';
import { ApiResponse, UserDto } from '../types';

export const authService = {
  login: async (data: any) => {
    const res = await api.post<ApiResponse<{ token: string; user: UserDto }>>('/auth/login', data);
    return res.data;
  },
  register: async (data: any) => {
    const res = await api.post<ApiResponse<{ token: string; user: UserDto }>>('/auth/register', data);
    return res.data;
  },
  logout: async () => {
    const res = await api.post<ApiResponse<any>>('/auth/logout');
    return res.data;
  },
  getProfile: async () => {
    const res = await api.get<ApiResponse<UserDto>>('/auth/profile');
    return res.data;
  },
  updateProfile: async (data: any) => {
    const res = await api.put<ApiResponse<UserDto>>('/auth/profile', data);
    return res.data;
  },
  changePassword: async (data: any) => {
    const res = await api.put<ApiResponse<any>>('/auth/password', data);
    return res.data;
  },
};
