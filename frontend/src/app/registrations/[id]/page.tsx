'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthGuard } from '../../../components/layout/AuthGuard';
import { useAuth } from '../../../hooks/useAuth';
import { Navbar } from '../../../components/layout/Navbar';
import { Sidebar } from '../../../components/layout/Sidebar';
import { AdminHeader } from '../../../components/layout/AdminHeader';
import { registrationService, bookingService, BookingStatusEnum } from '../../../services/registration.service';
import { RegistrationDetailDto } from '../../../types/registration';
import { getPlaceholderImage } from '../../../utils/image';

// Enum BookingStatus: Pending=0, Confirmed=1, InProgress=2, Completed=3, Cancelled=4, Refunded=5
const STATUS_MAP: Record<number, { label: string; badgeClass: string; neonClass: string; icon: string }> = {
  0: { 
    label: 'Chờ Duyệt',
    icon: 'hourglass_top',
    badgeClass: 'bg-amber-500/10 text-amber-700 border-amber-400/30', 
    neonClass: 'bg-amber-500/5 text-amber-600 border-amber-500/20 neon-glow-secondary' 
  },
  1: { 
    label: 'Đã Xác Nhận',
    icon: 'check_circle',
    badgeClass: 'bg-blue-500/10 text-blue-700 border-blue-400/30', 
    neonClass: 'bg-indigo-500/5 text-indigo-600 border-indigo-500/20 neon-glow-primary' 
  },
  2: { 
    label: 'Đang Diễn Ra',
    icon: 'directions_run',
    badgeClass: 'bg-secondary/10 text-secondary border-secondary/30', 
    neonClass: 'bg-amber-500/5 text-amber-600 border-amber-500/20 neon-glow-secondary' 
  },
  3: { 
    label: 'Hoàn Thành',
    icon: 'verified',
    badgeClass: 'bg-emerald-500/10 text-emerald-700 border-emerald-400/30', 
    neonClass: 'bg-emerald-500/5 text-emerald-600 border-emerald-500/20 neon-glow-tertiary' 
  },
  4: { 
    label: 'Đã Hủy',
    icon: 'cancel',
    badgeClass: 'bg-rose-500/10 text-rose-700 border-rose-400/30', 
    neonClass: 'bg-rose-500/5 text-rose-600 border-rose-500/20 neon-glow-error' 
  },
  5: { 
    label: 'Hoàn Tiền',
    icon: 'currency_exchange',
    badgeClass: 'bg-purple-500/10 text-purple-700 border-purple-400/30', 
    neonClass: 'bg-purple-500/5 text-purple-600 border-purple-500/20 neon-glow-primary' 
  },
};

// Helper: parse status từ string hoặc number (API trả về int)
const getStatusNum = (status: any): number => {
  if (typeof status === 'number') return status;
  const map: Record<string, number> = {
    'pending': 0, 'confirmed': 1, 'inprogress': 2, 'in_progress': 2,
    'completed': 3, 'cancelled': 4, 'canceled': 4, 'refunded': 5,
  };
  return map[String(status).toLowerCase()] ?? 0;
};

export default function BookingDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = Number(params?.id);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const isAdminOrStaff = user?.role?.toUpperCase() === 'ADMIN' || user?.role?.toUpperCase() === 'STAFF';

  // Fetch Booking Detail
  const { data: apiResponse, isLoading, error } = useQuery({
    queryKey: ['booking', id],
    queryFn: async () => {
      const res = await registrationService.getById(id);
      return res.data as unknown as RegistrationDetailDto;
    },
    enabled: !isNaN(id),
    retry: false,
  });

  // Action Mutations
  const approveMutation = useMutation({
    mutationFn: (bookingId: number) => registrationService.approve(bookingId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['booking', id] })
  });

  const rejectMutation = useMutation({
    mutationFn: (bookingId: number) => registrationService.reject(bookingId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['booking', id] })
  });

  const confirmMutation = useMutation({
    mutationFn: (bookingId: number) => registrationService.confirmParticipation(bookingId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['booking', id] })
  });

  const completeMutation = useMutation({
    mutationFn: (bookingId: number) => registrationService.complete(bookingId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['booking', id] })
  });

  const noShowMutation = useMutation({
    mutationFn: (bookingId: number) => registrationService.noShow(bookingId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['booking', id] })
  });

  const cancelMutation = useMutation({
    mutationFn: (bookingId: number) => registrationService.cancel(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
      setCancelModalOpen(false);
      setCancelReason('');
    }
  });

  const refundMutation = useMutation({
    mutationFn: (bookingId: number) => registrationService.refund(bookingId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['booking', id] })
  });

  const handleAdminAction = async (action: string) => {
    try {
      switch (action) {
        case 'approve':
          // BR-03: Phê duyệt → Confirmed (1)
          await approveMutation.mutateAsync(id);
          break;
        case 'reject':
          // BR-04: Từ chối → Cancelled (4)
          await rejectMutation.mutateAsync(id);
          break;
        case 'confirm':
          // Confirmed → InProgress (2): bắt đầu tour
          await confirmMutation.mutateAsync(id);
          break;
        case 'complete':
          // InProgress → Completed (3)
          await completeMutation.mutateAsync(id);
          break;
        case 'noShow':
          await noShowMutation.mutateAsync(id);
          break;
        case 'cancel':
          await cancelMutation.mutateAsync(id);
          break;
        case 'refund':
          // BR-07: Hoàn tiền → Refunded (5)
          await refundMutation.mutateAsync(id);
          break;
      }
    } catch (err) {
      console.error('Action failed:', err);
    }
  };

  const handleCustomerCancel = () => {
    cancelMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center">
        <span className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></span>
        <p className="font-body-md text-on-surface-variant font-medium">Đang tải thông tin đăng ký tour...</p>
      </div>
    );
  }

  if (error || !apiResponse) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center p-md text-center">
        <span className="material-symbols-outlined text-error text-[64px] mb-md">error</span>
        <h2 className="font-headline-md text-primary font-bold mb-xs">Không tìm thấy thông tin đăng ký</h2>
        <p className="text-on-surface-variant mb-lg max-w-[450px]">Có vẻ liên kết bị lỗi hoặc bạn không có quyền truy cập thông tin đặt tour này.</p>
        <button 
          onClick={() => router.back()} 
          className="bg-primary hover:bg-primary/90 text-white font-bold px-lg py-2.5 rounded-xl transition-smooth active:scale-95 shadow-sm"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const booking = apiResponse;
  const tour = booking.tour || {
    title: 'Thông tin Tour đang được cập nhật',
    location: 'Việt Nam',
    price: 0,
    startDate: booking.registeredAt,
    endDate: booking.registeredAt,
    images: []
  };

  const statusNum = getStatusNum((booking as any).status ?? booking.status);
  const statusInfo = STATUS_MAP[statusNum] || { 
    label: String(booking.status), 
    icon: 'info',
    badgeClass: 'bg-outline-variant/30 text-outline border-outline-variant/50', 
    neonClass: 'bg-outline-variant/30 text-outline border-outline-variant/50' 
  };

  const tourImage = (tour as any).images?.[0]?.imageUrl || getPlaceholderImage(800, 400, 'VietTour');
  const displayDeparture = tour.startDate
    ? new Date(tour.startDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : 'Chưa xác định';
  const displayEnd = tour.endDate
    ? new Date(tour.endDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : 'Chưa xác định';

  const totalAmount = (booking as any).finalPrice ?? (booking as any).totalPrice ?? 0;
  const depositAmount = (booking as any).payments?.filter((p: any) => p.status?.toLowerCase() === 'success' || p.status?.toLowerCase() === 'paid').reduce((sum: number, p: any) => sum + p.amount, 0) || 0;

  // UI rendering based on Role
  if (isAdminOrStaff) {
    return (
      <AuthGuard allowedRoles={['STAFF', 'ADMIN']}>
        <div className="bg-surface text-on-surface font-body-md min-h-screen flex">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Canvas Area */}
          <main className="flex-grow ml-64 p-margin-desktop bg-surface min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-xl border-b border-outline-variant/20 pb-md text-left">
              <div>
                <div className="flex items-center gap-xs text-xs text-on-surface-variant font-semibold mb-xs">
                  <Link href="/registrations" className="hover:text-primary transition-colors">Danh sách đăng ký</Link>
                  <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                  <span className="text-primary font-bold">REG-{booking.id}</span>
                </div>
                <h1 className="font-display-lg text-headline-lg text-primary font-extrabold tracking-tight">Chi Tiết Đăng Ký REG-{booking.id}</h1>
              </div>
              <button 
                onClick={() => router.back()} 
                className="border border-outline-variant hover:bg-surface-variant/20 text-on-surface-variant font-bold text-xs px-md py-2.5 rounded-xl transition-smooth active:scale-95"
              >
                Quay lại
              </button>
            </div>

            {/* Dashboard grid for Admin */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl text-left">
              {/* Left Column: Details */}
              <div className="lg:col-span-2 space-y-lg">
                {/* Status Card & Actions */}
                <div className="bg-white rounded-3xl p-xl shadow-soft border border-outline-variant/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-lg">
                  <div>
                    <span className="text-[10px] text-outline block uppercase tracking-wider font-semibold mb-xs">Trạng thái đặt tour</span>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${statusInfo.badgeClass}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-sm">
                    {/* BR-03: Pending → Duyệt (Confirmed) */}
                    {statusNum === BookingStatusEnum.Pending && (
                      <>
                        <button
                          onClick={() => handleAdminAction('approve')}
                          className="bg-primary hover:bg-primary/90 text-white font-bold text-xs px-md py-2.5 rounded-xl active:scale-95 transition-all shadow-sm"
                        >
                          Duyệt Đăng Ký
                        </button>
                        {/* BR-04: Từ chối → Cancelled */}
                        <button
                          onClick={() => handleAdminAction('reject')}
                          className="border border-rose-300 hover:bg-rose-600 hover:text-white text-rose-600 font-bold text-xs px-md py-2.5 rounded-xl active:scale-95 transition-all"
                        >
                          Từ Chối
                        </button>
                      </>
                    )}
                    {/* Confirmed → Bắt đầu tour (InProgress) */}
                    {statusNum === BookingStatusEnum.Confirmed && (
                      <>
                        <button
                          onClick={() => handleAdminAction('confirm')}
                          className="bg-secondary hover:bg-secondary/90 text-white font-bold text-xs px-md py-2.5 rounded-xl active:scale-95 transition-all shadow-sm"
                        >
                          Bắt Đầu Tour
                        </button>
                        <button
                          onClick={() => handleAdminAction('cancel')}
                          className="border border-rose-300 hover:bg-rose-600 hover:text-white text-rose-600 font-bold text-xs px-md py-2.5 rounded-xl active:scale-95 transition-all"
                        >
                          Hủy Đăng Ký
                        </button>
                      </>
                    )}
                    {/* InProgress → Hoàn thành */}
                    {statusNum === BookingStatusEnum.InProgress && (
                      <button
                        onClick={() => handleAdminAction('complete')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-md py-2.5 rounded-xl active:scale-95 transition-all shadow-sm"
                      >
                        Hoàn Thành Tour
                      </button>
                    )}
                    {/* BR-07: Cancelled → Hoàn tiền (Refunded) */}
                    {statusNum === BookingStatusEnum.Cancelled && (
                      <button
                        onClick={() => handleAdminAction('refund')}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-md py-2.5 rounded-xl active:scale-95 transition-all shadow-sm"
                      >
                        Xử Lý Hoàn Tiền
                      </button>
                    )}
                    {(statusNum === BookingStatusEnum.Completed || statusNum === BookingStatusEnum.Refunded) && (
                      <span className="text-xs text-on-surface-variant italic font-semibold border border-outline-variant/30 px-md py-2 rounded-xl bg-surface-container-low">
                        Hồ sơ đã đóng, không thể thay đổi
                      </span>
                    )}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-white rounded-3xl p-xl shadow-soft border border-outline-variant/30 space-y-md">
                  <h3 className="font-title-lg text-title-lg text-primary font-bold border-b border-outline-variant/20 pb-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">person</span>
                    Thông Tin Khách Hàng
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md text-sm font-medium">
                    <div>
                      <p className="text-outline text-xs uppercase font-semibold mb-xs">Họ và tên</p>
                      <p className="text-on-surface text-base font-bold">{booking.user?.fullName || 'Không xác định'}</p>
                    </div>
                    <div>
                      <p className="text-outline text-xs uppercase font-semibold mb-xs">Tên tài khoản (username)</p>
                      <p className="text-on-surface text-base font-bold">@{booking.user?.username || 'user'}</p>
                    </div>
                    <div>
                      <p className="text-outline text-xs uppercase font-semibold mb-xs">Địa chỉ Email</p>
                      <p className="text-primary font-bold hover:underline">{booking.user?.email || 'customer@viettour.com'}</p>
                    </div>
                    <div>
                      <p className="text-outline text-xs uppercase font-semibold mb-xs">Số điện thoại</p>
                      <p className="text-on-surface text-base font-bold">{booking.user?.phone || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                </div>

                {/* Tour Info */}
                <div className="bg-white rounded-3xl p-xl shadow-soft border border-outline-variant/30 space-y-md">
                  <h3 className="font-title-lg text-title-lg text-primary font-bold border-b border-outline-variant/20 pb-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">tour</span>
                    Thông Tin Tour Đặt
                  </h3>
                  <div className="flex flex-col md:flex-row gap-md items-start md:items-center">
                    <div className="w-full md:w-36 h-24 rounded-2xl overflow-hidden shrink-0">
                      <img className="w-full h-full object-cover" alt={tour.title} src={tourImage} />
                    </div>
                    <div className="space-y-sm">
                      <h4 className="font-title-lg text-title-lg text-primary font-bold leading-snug">{tour.title}</h4>
                      <p className="text-on-surface-variant font-medium text-xs flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-outline">location_on</span>
                        Điểm đi: <strong className="text-on-surface">{(tour as any).location || 'Việt Nam'}</strong>
                      </p>
                      <div className="flex flex-wrap gap-x-lg gap-y-xs text-xs text-on-surface-variant font-medium">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm text-outline">calendar_month</span>
                          Khởi hành: <strong className="text-on-surface">{displayDeparture}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm text-outline">event</span>
                          Kết thúc: <strong className="text-on-surface">{displayEnd}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Bill Info */}
              <div className="space-y-lg">
                <div className="bg-white rounded-3xl p-xl shadow-soft border border-outline-variant/30 space-y-md">
                  <h3 className="font-title-lg text-title-lg text-primary font-bold border-b border-outline-variant/20 pb-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">receipt_long</span>
                    Thông Tin Thanh Toán
                  </h3>
                  
                  <div className="space-y-md text-sm">
                    {/* Bill breakdown */}
                    <div className="flex justify-between items-center py-xs border-b border-outline-variant/10">
                      <span className="text-on-surface-variant font-semibold">Ngày đăng ký:</span>
                      <span className="font-bold text-on-surface">
                        {booking.registeredAt ? new Date(booking.registeredAt).toLocaleDateString('vi-VN') : '—'}
                      </span>
                    </div>
                    
                    {booking.approvedAt && (
                      <div className="flex justify-between items-center py-xs border-b border-outline-variant/10">
                        <span className="text-on-surface-variant font-semibold">Ngày duyệt:</span>
                        <span className="font-bold text-on-surface">
                          {new Date(booking.approvedAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    )}

                    {booking.confirmedAt && (
                      <div className="flex justify-between items-center py-xs border-b border-outline-variant/10">
                        <span className="text-on-surface-variant font-semibold">Ngày đặt cọc:</span>
                        <span className="font-bold text-on-surface">
                          {new Date(booking.confirmedAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    )}

                    {booking.note && (
                      <div className="py-xs border-b border-outline-variant/10">
                        <span className="text-on-surface-variant font-semibold block mb-xs">Ghi chú của khách:</span>
                        <p className="text-xs text-on-surface bg-surface-container-low p-sm rounded-lg italic">
                          "{booking.note}"
                        </p>
                      </div>
                    )}

                    {booking.cancelReason && (
                      <div className="py-xs border-b border-outline-variant/10 bg-error/5 p-sm rounded-lg border border-error/10">
                        <span className="text-error font-bold block mb-xs">Lý do hủy đặt:</span>
                        <p className="text-xs text-error font-medium italic">
                          "{booking.cancelReason}"
                        </p>
                      </div>
                    )}

                    {/* Pricing */}
                    <div className="bg-primary/5 rounded-2xl p-md space-y-sm text-sm mt-md">
                      <div className="flex justify-between text-on-surface-variant font-medium">
                        <span>Giá tour / khách:</span>
                        <span>{tour.price?.toLocaleString('vi-VN')}đ</span>
                      </div>
                      <div className="flex justify-between text-on-surface-variant font-medium">
                        <span>Số tiền cọc:</span>
                        <span className="text-secondary font-bold">{depositAmount?.toLocaleString('vi-VN') || 0}đ</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-primary/10 pt-sm mt-xs">
                        <span className="font-bold text-on-surface">Tổng cộng</span>
                        <span className="text-headline-md font-black text-primary">{totalAmount?.toLocaleString('vi-VN') || 0}đ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </AuthGuard>
    );
  }

  // Customer UI
  return (
    <AuthGuard allowedRoles={['CUSTOMER', 'STAFF', 'ADMIN']}>
      <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col justify-between">
        <Navbar />

        <main className="flex-grow max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-xl w-full">
          {/* Header */}
          <div className="mb-xl text-left flex flex-col sm:flex-row sm:justify-between sm:items-end gap-md">
            <div>
              <span className="text-secondary font-bold text-label-sm uppercase tracking-widest block mb-xs">
                Mã Đăng Ký: {booking.id}
              </span>
              <h1 className="font-display-lg text-headline-lg md:text-display-lg text-primary font-extrabold tracking-tight">Chi Tiết Đặt Tour</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Chi tiết lịch trình du lịch và hóa đơn giao dịch của bạn.</p>
            </div>
            <button 
              onClick={() => router.push('/registrations/my')}
              className="border border-outline-variant hover:bg-surface-variant/20 text-on-surface-variant font-bold text-xs px-md py-2.5 rounded-xl transition-smooth active:scale-95 self-start sm:self-auto"
            >
              Lịch sử đặt tour
            </button>
          </div>

          {/* Banner Image */}
          <section className="relative rounded-3xl overflow-hidden h-[300px] md:h-[450px] mb-xl shadow-natural">
            <img 
              className="w-full h-full object-cover" 
              alt={tour.title} 
              src={tourImage}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-lg md:p-xl text-left">
              <div className="flex flex-wrap gap-xs mb-sm">
                <span className={`px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest border ${statusInfo.neonClass}`}>
                  {statusInfo.label}
                </span>
                <span className="bg-primary/20 backdrop-blur-md text-white font-label-sm text-xs px-3 py-1 rounded-full border border-white/20">
                  VietTour Premium
                </span>
              </div>
              <h2 className="font-headline-md text-white font-bold text-xl md:text-2xl mb-xs">{tour.title}</h2>
              <p className="text-white/80 font-body-md text-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-secondary-fixed text-sm">location_on</span>
                {(tour as any).location || 'Việt Nam'}
              </p>
            </div>
          </section>

          {/* Layout Grid */}
          <div className="flex flex-col lg:flex-row gap-xl relative justify-between items-start text-left">
            {/* Left side: Information */}
            <div className="w-full lg:w-[64%] space-y-xl">
              {/* Tour Overview */}
              <section className="bg-white rounded-3xl p-xl shadow-soft border border-outline-variant/30 space-y-md">
                <h3 className="font-title-lg text-title-lg text-primary font-bold border-b border-outline-variant/20 pb-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">info</span>
                  Thông Tin Lịch Trình
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md mt-md">
                  <div className="flex items-center gap-md p-md bg-surface rounded-2xl">
                    <span className="material-symbols-outlined text-primary text-[28px]">flight_takeoff</span>
                    <div>
                      <span className="font-label-sm text-xs text-on-surface-variant block">Ngày Khởi Hành</span>
                      <span className="font-label-md text-sm font-bold text-primary">{displayDeparture}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-md p-md bg-surface rounded-2xl">
                    <span className="material-symbols-outlined text-primary text-[28px]">flight_land</span>
                    <div>
                      <span className="font-label-sm text-xs text-on-surface-variant block">Ngày Kết Thúc</span>
                      <span className="font-label-md text-sm font-bold text-primary">{displayEnd}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-md p-md bg-surface rounded-2xl">
                    <span className="material-symbols-outlined text-primary text-[28px]">location_on</span>
                    <div>
                      <span className="font-label-sm text-xs text-on-surface-variant block">Điểm Đến</span>
                      <span className="font-label-md text-sm font-bold text-primary">{(tour as any).location || 'Việt Nam'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-md p-md bg-surface rounded-2xl">
                    <span className="material-symbols-outlined text-primary text-[28px]">group</span>
                    <div>
                      <span className="font-label-sm text-xs text-on-surface-variant block">Người Đặt Tour</span>
                      <span className="font-label-md text-sm font-bold text-primary">{booking.user?.fullName}</span>
                    </div>
                  </div>
                </div>

                {booking.note && (
                  <div className="mt-md bg-primary/5 p-lg rounded-2xl border border-primary/10">
                    <span className="text-primary font-bold text-sm block mb-xs">Ghi chú của bạn:</span>
                    <p className="text-on-surface-variant text-sm italic font-medium">"{booking.note}"</p>
                  </div>
                )}
              </section>

              {/* Detailed Tour Link */}
              <section className="bg-white rounded-3xl p-xl shadow-soft border border-outline-variant/30 flex justify-between items-center gap-md">
                <div>
                  <h4 className="font-title-lg text-primary font-bold mb-xs">Bạn muốn xem chi tiết thông tin Tour?</h4>
                  <p className="text-xs text-on-surface-variant font-medium">Lịch trình chi tiết, các dịch vụ đi kèm & đánh giá từ khách hàng.</p>
                </div>
                <Link href={`/tours/${booking.tour?.id || tour.id}`}
                  className="bg-primary hover:bg-primary-container text-white font-bold text-xs px-md py-2.5 rounded-2xl active:scale-95 transition-all shadow-sm shrink-0"
                >
                  Xem Lịch Trình Tour
                </Link>
              </section>
            </div>

            {/* Right side: Payment Invoice */}
            <div className="w-full lg:w-[32%] relative">
              <div className="sticky top-24 space-y-md">
                <div className="bg-white rounded-3xl p-xl shadow-soft border border-outline-variant/30 space-y-lg">
                  <div className="text-center space-y-xs pb-md border-b border-dashed border-outline-variant">
                    <h4 className="font-title-lg text-primary font-bold tracking-tight">HÓA ĐƠN ĐẶT TOUR</h4>
                    <p className="text-xs text-outline font-mono font-semibold">Mã Đăng Ký: REG-{booking.id}</p>
                    <p className="text-[10px] text-outline uppercase font-extrabold">Ngày đăng ký: {booking.registeredAt ? new Date(booking.registeredAt).toLocaleDateString('vi-VN') : '—'}</p>
                  </div>

                  <div className="space-y-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-sm text-primary">{tour.title}</p>
                        <p className="text-xs text-on-surface-variant font-semibold">Gói du lịch cao cấp</p>
                      </div>
                      <span className="font-bold text-sm text-primary">{tour.price?.toLocaleString('vi-VN')}đ</span>
                    </div>

                    <div className="flex justify-between items-center text-xs text-on-surface-variant font-medium pt-sm border-t border-outline-variant/10">
                      <span>Phí Đặt Cọc (Đã cọc)</span>
                      <span className="text-secondary font-bold">{depositAmount?.toLocaleString('vi-VN') || 0}đ</span>
                    </div>

                    <div className="flex justify-between items-center text-sm font-bold pt-md border-t border-dashed border-outline-variant">
                      <span className="text-primary font-extrabold uppercase text-xs">Tổng số tiền</span>
                      <span className="text-secondary text-lg font-black">{(totalAmount || 0).toLocaleString('vi-VN')}đ</span>
                    </div>
                  </div>

                  {booking.cancelReason && (
                    <div className="p-md rounded-2xl bg-error/5 border border-error/15 text-xs text-error font-medium italic">
                      <strong className="block not-italic mb-xs">Lý do hủy đặt:</strong>
                      "{booking.cancelReason}"
                    </div>
                  )}

                  {/* Customer Status badge */}
                  <div className={`p-sm rounded-xl border text-center text-xs font-semibold flex items-center justify-center gap-xs ${statusInfo.badgeClass}`}>
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    Trạng Thái: {statusInfo.label}
                  </div>

                  {/* Cancel Button for Customer */}
                  {statusNum === BookingStatusEnum.Pending && (
                    <button 
                      onClick={() => setCancelModalOpen(true)}
                      className="w-full bg-error/10 hover:bg-error hover:text-white text-error font-bold py-3.5 rounded-2xl transition-all active:scale-95 border border-error/20 flex items-center justify-center gap-2 text-xs"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm">cancel</span>
                      Hủy Yêu Cầu Đăng Ký
                    </button>
                  )}
                </div>

                <div className="bg-primary-container text-on-primary-container p-lg rounded-3xl flex items-center justify-between text-left shadow-sm">
                  <div>
                    <p className="font-bold text-white text-sm">Cần trợ giúp?</p>
                    <p className="text-xs text-white/80">Liên hệ hỗ trợ chăm sóc khách hàng</p>
                  </div>
                  <a href="tel:19001000" className="bg-white/20 hover:bg-white/30 p-2.5 rounded-full transition-bounce text-white active:scale-95 flex items-center justify-center">
                    <span className="material-symbols-outlined">call</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="bg-inverse-surface dark:bg-surface-container-lowest full-width bottom-0 mt-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop py-xl w-full max-w-max-width mx-auto text-left">
            <div className="space-y-md">
              <span className="font-headline-md text-headline-md text-surface-bright font-bold">VietTour</span>
              <p className="font-body-md text-surface-variant dark:text-on-surface-variant">© 2024 VietTour. Bảo lưu mọi quyền.</p>
            </div>
            <div className="space-y-md">
              <h5 className="text-on-primary dark:text-primary font-bold">Khám phá</h5>
              <ul className="space-y-sm">
                <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/tours">Tour du lịch</Link></li>
                <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/tours">Điểm đến</Link></li>
              </ul>
            </div>
            <div className="space-y-md">
              <h5 className="text-on-primary dark:text-primary font-bold">Công ty</h5>
              <ul className="space-y-sm">
                <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/about">Về chúng tôi</Link></li>
                <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/contact">Liên hệ</Link></li>
              </ul>
            </div>
            <div className="space-y-md">
              <h5 className="text-on-primary dark:text-primary font-bold">Hỗ trợ</h5>
              <ul className="space-y-sm">
                <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/contact">Trung tâm trợ giúp</Link></li>
                <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/tours">FAQs</Link></li>
              </ul>
            </div>
          </div>
        </footer>

        {/* Customer Cancel Booking Modal */}
        {cancelModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-md bg-black/40 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-3xl p-xl shadow-elevated border border-outline-variant/20 max-w-[450px] w-full text-left space-y-lg relative animate-[subtle-zoom_0.4s_ease-out]">
              <button 
                onClick={() => setCancelModalOpen(false)} 
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined text-outline">close</span>
              </button>
              <h4 className="font-headline-md text-primary font-bold tracking-tight">HỦY YÊU CẦU ĐẶT TOUR</h4>
              <p className="text-sm text-on-surface-variant font-medium">Bạn có chắc chắn muốn hủy yêu cầu đặt tour này? Vui lòng cho chúng tôi biết lý do hủy của bạn:</p>
              
              <textarea 
                className="w-full bg-surface border border-outline-variant/65 rounded-xl p-3 text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[100px] font-semibold"
                placeholder="Nhập lý do hủy đặt tour (không bắt buộc)..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />

              <div className="flex gap-sm">
                <button 
                  onClick={handleCustomerCancel}
                  className="flex-1 bg-error hover:bg-error/95 text-white font-bold py-2.5 rounded-xl transition-smooth active:scale-95 text-xs flex justify-center items-center gap-1 shadow-sm"
                >
                  {cancelMutation.isPending ? (
                    <>
                      <span className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></span>
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <span>Xác nhận Hủy</span>
                  )}
                </button>
                <button 
                  onClick={() => setCancelModalOpen(false)}
                  className="flex-1 border border-outline-variant hover:bg-surface-variant/20 text-on-surface-variant font-bold py-2.5 rounded-xl transition-smooth active:scale-95 text-xs"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
