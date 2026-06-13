import api from './api';
import { ApiResponse, RegistrationDto, RegistrationDetailDto, PaginatedResult } from '../types';

// Enum BookingStatus phải khớp với backend Core.Enums.BookingStatus
// Pending=0, Confirmed=1, InProgress=2, Completed=3, Cancelled=4, Refunded=5
export const BookingStatusEnum = {
  Pending: 0,
  Confirmed: 1,
  InProgress: 2,
  Completed: 3,
  Cancelled: 4,
  Refunded: 5,
} as const;

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

// Legacy alias cho các trang hiện tại
export const registrationService = {
  create: (data: { customerId: number; tourId: number; startDate: string; endDate: string; numAdults: number; numChildren: number; notes?: string }) =>
    bookingService.create(data),
  getAll: bookingService.getAll,
  getMyRegistrations: (params?: Record<string, any>) => bookingService.getAll(params),
  getById: bookingService.getById,

  // BR-03: Nhân viên phê duyệt → Confirmed (1)
  approve: async (id: number) => bookingService.updateStatus(id, BookingStatusEnum.Confirmed),

  // BR-04: Từ chối → Cancelled (4)
  reject: async (id: number) => bookingService.updateStatus(id, BookingStatusEnum.Cancelled),

  // Xác nhận đang diễn ra → InProgress (2)
  confirmParticipation: async (id: number) => bookingService.updateStatus(id, BookingStatusEnum.InProgress),

  // Hoàn thành tour → Completed (3)
  complete: async (id: number) => bookingService.updateStatus(id, BookingStatusEnum.Completed),

  // Khách vắng mặt → Cancelled (4)
  noShow: async (id: number) => bookingService.updateStatus(id, BookingStatusEnum.Cancelled),

  // BR-07: Hủy + hoàn tiền → Cancelled trước, sau đó Refunded (5)
  cancel: async (id: number) => bookingService.updateStatus(id, BookingStatusEnum.Cancelled),

  // BR-07: Xử lý hoàn tiền → Refunded (5)
  refund: async (id: number) => bookingService.updateStatus(id, BookingStatusEnum.Refunded),
};
