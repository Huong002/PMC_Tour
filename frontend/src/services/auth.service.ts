import api from './api';
import { ApiResponse, UserDto } from '../types';

export const authService = {
  login: async (data: { username: string; password: string }) => {
    const res = await api.post<ApiResponse<{ token: string; refreshToken: string; userId: number; username: string; fullName: string; roles: string[] }>>('/Auth/login', data);
    return res.data;
  },
  register: async (data: { username: string; email: string; password: string; fullName: string; phone: string }) => {
    const res = await api.post<ApiResponse<{ token: string; refreshToken: string; userId: number; username: string; fullName: string; roles: string[] }>>('/Auth/register', data);
    return res.data;
  },
  refresh: async (refreshToken: string) => {
    const res = await api.post<ApiResponse<{ token: string; refreshToken: string }>>('/Auth/refresh', { refreshToken });
    return res.data;
  },
  getProfile: async () => {
    const res = await api.get<ApiResponse<UserDto>>('/Auth/profile');
    return res.data;
  },
  changePassword: async (data: { oldPassword: string; newPassword: string }) => {
    const res = await api.post<ApiResponse<boolean>>('/Auth/change-password', data);
    return res.data;
  },
};
