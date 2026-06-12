import api from './api';
import { ApiResponse, TourDto, TourDetailDto, CreateTourRequest, UpdateTourRequest, PaginatedResult } from '../types';

export const tourService = {
  getAll: async (params?: Record<string, any>) => {
    const res = await api.get<ApiResponse<PaginatedResult<TourDto>>>('/Tours', { params });
    return res.data;
  },
  getById: async (id: number) => {
    const res = await api.get<ApiResponse<TourDetailDto>>(`/Tours/${id}`);
    return res.data;
  },
  getBySlug: async (slug: string) => {
    const res = await api.get<ApiResponse<TourDetailDto>>(`/Tours/slug/${slug}`);
    return res.data;
  },
  create: async (data: CreateTourRequest) => {
    const res = await api.post<ApiResponse<TourDto>>('/Tours', data);
    return res.data;
  },
  update: async (id: number, data: UpdateTourRequest) => {
    const res = await api.put<ApiResponse<TourDto>>(`/Tours/${id}`, data);
    return res.data;
  },
  delete: async (id: number) => {
    const res = await api.delete<ApiResponse<any>>(`/Tours/${id}`);
    return res.data;
  },
};
