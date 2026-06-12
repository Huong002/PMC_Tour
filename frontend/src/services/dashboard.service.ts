import api from './api';
import { ApiResponse } from '../types';

export const dashboardService = {
  getStats: async () => {
    const res = await api.get<ApiResponse<{
      totalTours: number; activeTours: number; totalBookings: number;
      pendingBookings: number; confirmedBookings: number;
      totalCustomers: number; totalReviews: number;
    }>>('/Dashboard/stats');
    return res.data;
  },
  getRevenue: async (params?: { fromDate?: string; toDate?: string }) => {
    const res = await api.get<ApiResponse<any>>('/Reports/revenue', { params });
    return res.data;
  },
  getTourReport: async (params?: { fromDate?: string; toDate?: string }) => {
    const res = await api.get<ApiResponse<any>>('/Reports/tours', { params });
    return res.data;
  },
  getBookingReport: async (params?: { fromDate?: string; toDate?: string }) => {
    const res = await api.get<ApiResponse<any>>('/Reports/bookings', { params });
    return res.data;
  },
};
