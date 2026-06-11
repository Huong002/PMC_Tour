import api from './api';
import { ApiResponse, TourDto, TourDetailDto, CreateTourRequest, UpdateTourRequest, PaginatedResult } from '../types';

export const tourService = {
  getAll: async (params?: Record<string, any>) => {
    const res = await api.get<ApiResponse<PaginatedResult<TourDto>>>('/tours', { params });
    return res.data;
  },
  getById: async (id: number) => {
    const res = await api.get<ApiResponse<TourDetailDto>>(`/tours/${id}`);
    return res.data;
  },
  create: async (data: CreateTourRequest) => {
    const res = await api.post<ApiResponse<TourDto>>('/tours', data);
    return res.data;
  },
  update: async (id: number, data: UpdateTourRequest) => {
    const res = await api.put<ApiResponse<TourDto>>(`/tours/${id}`, data);
    return res.data;
  },
  updateStatus: async (id: number, data: { status: string }) => {
    const res = await api.patch<ApiResponse<TourDto>>(`/tours/${id}/status`, data);
    return res.data;
  },
  delete: async (id: number) => {
    const res = await api.delete<ApiResponse<any>>(`/tours/${id}`);
    return res.data;
  },
  getImages: async (id: number) => {
    const res = await api.get<ApiResponse<any[]>>(`/tours/${id}/images`);
    return res.data;
  },
  addImage: async (id: number, data: any) => {
    const res = await api.post<ApiResponse<any>>(`/tours/${id}/images`, data);
    return res.data;
  },
  deleteImage: async (id: number, imageId: number) => {
    const res = await api.delete<ApiResponse<any>>(`/tours/${id}/images/${imageId}`);
    return res.data;
  },
};
