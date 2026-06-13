'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthGuard } from '../../components/layout/AuthGuard';
import { Sidebar } from '../../components/layout/Sidebar';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { dashboardService } from '../../services/dashboard.service';
import { registrationService } from '../../services/registration.service';
import api from '../../services/api';

interface BookingItem {
  id: number;
  bookingCode: string;
  customerName: string;
  tourName: string;
  startDate: string;
  status: string;
}

export default function DashboardPage() {
  const qc = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => dashboardService.getStats(),
    select: (res: any) => res.data,
  });

  const { data: pendingBookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['pendingBookings'],
    queryFn: async () => {
      const res = await api.get('/Bookings', { params: { Status: 0, PageSize: 20 } });
      return (res.data?.data?.items || []) as BookingItem[];
    },
    select: (items: BookingItem[]) => items,
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) => registrationService.approve(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pendingBookings'] }),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) => registrationService.reject(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pendingBookings'] }),
  });

  const isLoading = statsLoading || bookingsLoading;

  const filteredRequests = (pendingBookings || []).filter((req: BookingItem) =>
    (req.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (req.tourName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) =>
    name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <AuthGuard allowedRoles={['ADMIN', 'STAFF']}>
      <div className="bg-surface text-on-surface font-body-md min-h-screen flex">
        <Sidebar />

        <main className="flex-1 ml-64 p-margin-desktop bg-surface min-h-screen">
          <AdminHeader
            title="Bảng điều khiển Nhân viên"
            description="Chào mừng trở lại. Dưới đây là tổng quan về các chỉ số của VietTour hôm nay."
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Tìm kiếm yêu cầu..."
          />

          {/* Stats Bento Grid */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-xl">
            <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  <span className="material-symbols-outlined">confirmation_number</span>
                </div>
              </div>
              <div className="mt-md text-left">
                <p className="font-label-md text-label-md text-on-surface-variant mb-1">Số Booking</p>
                <p className="font-headline-md text-headline-md text-primary font-bold">
                  {isLoading ? '...' : (stats?.totalBookings ?? 0)}
                </p>
              </div>
            </div>

            <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
                  <span className="material-symbols-outlined">map</span>
                </div>
              </div>
              <div className="mt-md text-left">
                <p className="font-label-md text-label-md text-on-surface-variant mb-1">Tour Đang Hoạt Động</p>
                <p className="font-headline-md text-headline-md text-secondary font-bold">
                  {isLoading ? '...' : (stats?.activeTours ?? 0)}
                </p>
              </div>
            </div>

            <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-tertiary/10 rounded-lg text-tertiary">
                  <span className="material-symbols-outlined">people</span>
                </div>
              </div>
              <div className="mt-md text-left">
                <p className="font-label-md text-label-md text-on-surface-variant mb-1">Khách Hàng</p>
                <p className="font-headline-md text-headline-md text-primary font-bold">
                  {isLoading ? '...' : (stats?.totalCustomers ?? 0)}
                </p>
              </div>
            </div>

            <div className="bg-primary-fixed/30 p-lg rounded-xl custom-shadow border border-primary/20 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-primary rounded-lg text-on-primary">
                  <span className="material-symbols-outlined">pending_actions</span>
                </div>
              </div>
              <div className="mt-md text-left">
                <p className="font-label-md text-label-md text-primary font-bold mb-1">Chờ Duyệt</p>
                <p className="font-headline-md text-headline-md text-on-surface font-bold">
                  {isLoading ? '...' : (stats?.pendingBookings ?? 0)}
                </p>
              </div>
            </div>
          </section>

          {/* Pending Requests Table */}
          <section className="bg-white rounded-xl custom-shadow border border-outline-variant/30 overflow-hidden mb-xl">
            <div className="p-lg border-b border-outline-variant/50 flex flex-col md:flex-row md:items-center justify-between gap-md text-left">
              <h3 className="font-title-lg text-title-lg text-on-surface font-bold">Yêu Cầu Đang Chờ Duyệt</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low border-b border-outline-variant/50">
                  <tr>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Khách Hàng</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Tour</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Ngày Đi</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Trạng Thái</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((req: BookingItem) => (
                      <tr key={req.id} className="hover:bg-surface-container-lowest transition-all hover:translate-x-1 duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-md">
                            <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed font-bold text-xs">
                              {getInitials(req.customerName || '?')}
                            </div>
                            <span className="font-body-md text-sm font-semibold text-on-surface">{req.customerName || '—'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant font-medium">{req.tourName || '—'}</td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant font-medium">{formatDate(req.startDate)}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-primary/10 text-primary border-primary/20">
                            Chờ Duyệt
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-sm">
                            <button
                              onClick={() => approveMutation.mutate(req.id)}
                              disabled={approveMutation.isPending}
                              className="bg-primary hover:bg-primary-container text-white font-label-sm text-[11px] font-bold px-lg py-2 rounded-lg transition-all active:scale-95 shadow-sm disabled:opacity-50"
                            >
                              {approveMutation.isPending ? '...' : 'Duyệt'}
                            </button>
                            <button
                              onClick={() => rejectMutation.mutate(req.id)}
                              disabled={rejectMutation.isPending}
                              className="border border-outline-variant/65 text-on-surface-variant hover:text-white hover:bg-error font-label-sm text-[11px] font-bold px-lg py-2 rounded-lg transition-all active:scale-95 disabled:opacity-50"
                            >
                              Từ Chối
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-on-surface-variant">
                        {isLoading ? 'Đang tải...' : 'Không có yêu cầu nào đang chờ.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-lg bg-surface-container-low border-t border-outline-variant/50 flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant">
                {filteredRequests.length} yêu cầu đang chờ duyệt
              </span>
            </div>
          </section>

          {/* Staff Tip Card */}
          <section className="grid grid-cols-1 md:grid-cols-1 gap-gutter text-left">
            <div className="bg-primary-container text-on-primary-container p-lg rounded-xl shadow-glass flex flex-col justify-between overflow-hidden relative">
              <div className="z-10">
                <h3 className="font-title-lg text-title-lg text-white mb-sm font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined">tips_and_updates</span>
                  Lưu Ý Nhân Viên
                </h3>
                <p className="font-body-md text-body-md text-white/90 leading-relaxed">
                  Ưu tiên xử lý các yêu cầu có ngày khởi hành dưới 48 giờ để đảm bảo trải nghiệm tốt nhất cho khách hàng.
                </p>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-20 transform rotate-12 text-white">
                <span className="material-symbols-outlined text-[120px]">lightbulb</span>
              </div>
            </div>
          </section>

          <footer className="mt-xl border-t border-outline-variant/50 pt-lg pb-md flex flex-col sm:flex-row justify-between items-center gap-md text-on-surface-variant text-xs">
            <span className="font-medium">© 2024 VietTour. Bảo lưu mọi quyền. Cổng thông tin nhân viên chuyên nghiệp.</span>
            <div className="flex gap-lg font-bold">
              <Link className="hover:text-primary transition-colors" href="/contact">Trung tâm trợ giúp</Link>
              <Link className="hover:text-primary transition-colors" href="/dashboard">Trạng thái hệ thống</Link>
            </div>
          </footer>
        </main>
      </div>
    </AuthGuard>
  );
}
