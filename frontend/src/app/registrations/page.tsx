'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthGuard } from '../../components/layout/AuthGuard';
import { Sidebar } from '../../components/layout/Sidebar';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { bookingService, BookingStatusEnum } from '../../services/registration.service';

// Enum BookingStatus phải khớp backend: Pending=0, Confirmed=1, InProgress=2, Completed=3, Cancelled=4, Refunded=5
const STATUS_CONFIG: Record<number, { label: string; badgeClass: string; icon: string }> = {
  0: { label: 'Chờ Duyệt',     badgeClass: 'bg-amber-500/10 text-amber-700 border-amber-400/30',   icon: 'hourglass_top' },
  1: { label: 'Đã Xác Nhận',   badgeClass: 'bg-blue-500/10 text-blue-700 border-blue-400/30',       icon: 'check_circle' },
  2: { label: 'Đang Diễn Ra',  badgeClass: 'bg-secondary/10 text-secondary border-secondary/30',    icon: 'directions_run' },
  3: { label: 'Hoàn Thành',    badgeClass: 'bg-emerald-500/10 text-emerald-700 border-emerald-400/30', icon: 'verified' },
  4: { label: 'Đã Hủy',        badgeClass: 'bg-rose-500/10 text-rose-700 border-rose-400/30',       icon: 'cancel' },
  5: { label: 'Hoàn Tiền',     badgeClass: 'bg-purple-500/10 text-purple-700 border-purple-400/30', icon: 'currency_exchange' },
};

const FILTER_TABS = [
  { code: 'ALL',   label: 'Tất cả',         status: undefined },
  { code: '0',     label: 'Chờ duyệt',      status: 0 },
  { code: '1',     label: 'Đã xác nhận',    status: 1 },
  { code: '2',     label: 'Đang diễn ra',   status: 2 },
  { code: '3',     label: 'Hoàn thành',     status: 3 },
  { code: '4',     label: 'Đã hủy',         status: 4 },
  { code: '5',     label: 'Hoàn tiền',      status: 5 },
];

// Mock data dùng khi API chưa trả về
const MOCK_BOOKINGS = [
  { id: 101, bookingCode: 'BK20260605-01', tourId: 1, tourName: 'Du Thuyền Cao Cấp Vịnh Hạ Long', customerName: 'Nguyễn Văn An', numAdults: 2, numChildren: 1, startDate: '2026-06-15T08:00:00Z', totalPrice: 12500000, finalPrice: 12500000, status: 0 },
  { id: 102, bookingCode: 'BK20260608-02', tourId: 3, tourName: 'Trekking Sapa - Ruộng Bậc Thang', customerName: 'Trần Văn Bình', numAdults: 1, numChildren: 0, startDate: '2026-06-20T07:00:00Z', totalPrice: 8200000, finalPrice: 8200000, status: 0 },
  { id: 103, bookingCode: 'BK20260512-03', tourId: 5, tourName: 'Đà Lạt - Đồi Chè & Thông Reo', customerName: 'Lê Văn Minh', numAdults: 2, numChildren: 0, startDate: '2026-05-20T08:00:00Z', totalPrice: 4800000, finalPrice: 4800000, status: 3 },
  { id: 104, bookingCode: 'BK20260410-04', tourId: 7, tourName: 'Phố Cổ Hội An - Di Sản Văn Hóa', customerName: 'Phạm Văn Vũ', numAdults: 1, numChildren: 1, startDate: '2026-04-18T09:00:00Z', totalPrice: 6900000, finalPrice: 690000, status: 4 },
  { id: 105, bookingCode: 'BK20260609-05', tourId: 4, tourName: 'Sài Gòn Xưa & Nay', customerName: 'Hoàng Thị Ánh', numAdults: 1, numChildren: 0, startDate: '2026-06-22T08:00:00Z', totalPrice: 1800000, finalPrice: 1800000, status: 1 },
  { id: 106, bookingCode: 'BK20260603-06', tourId: 2, tourName: 'Biển Xanh Đà Nẵng', customerName: 'Trần Thị Thu', numAdults: 2, numChildren: 2, startDate: '2026-06-18T07:00:00Z', totalPrice: 6800000, finalPrice: 6800000, status: 2 },
];

const getStatusNum = (status: any): number => {
  if (typeof status === 'number') return status;
  const map: Record<string, number> = {
    'pending': 0, 'confirmed': 1, 'inprogress': 2, 'in_progress': 2,
    'completed': 3, 'cancelled': 4, 'canceled': 4, 'refunded': 5,
  };
  return map[String(status).toLowerCase()] ?? 0;
};

interface ConfirmModal {
  id: number;
  action: string;
  label: string;
  description: string;
  confirmClass: string;
  nextStatus: number;
}

export default function RegistrationsPage() {
  const qc = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [confirmModal, setConfirmModal] = useState<ConfirmModal | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch bookings
  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ['bookings', statusFilter],
    queryFn: () => bookingService.getAll({
      PageSize: 100,
      Status: statusFilter !== 'ALL' ? parseInt(statusFilter) : undefined,
    }),
    retry: false,
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) =>
      bookingService.updateStatus(id, status),
    onSuccess: (data, vars) => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      const config = STATUS_CONFIG[vars.status];
      showToast(`Đã cập nhật trạng thái: ${config?.label}`, 'success');
      setConfirmModal(null);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Cập nhật thất bại';
      showToast(msg, 'error');
      setConfirmModal(null);
    },
  });

  const handleAction = (id: number, nextStatus: number, label: string, description: string, confirmClass: string) => {
    setConfirmModal({ id, action: label, label, description, confirmClass, nextStatus });
  };

  const executeAction = () => {
    if (!confirmModal) return;
    updateStatusMutation.mutate({ id: confirmModal.id, status: confirmModal.nextStatus });
  };

  // Dùng data API nếu có, fallback về mock
  const rawItems: any[] = (apiResponse as any)?.data?.items ?? MOCK_BOOKINGS;

  const displayedItems = rawItems.filter((item: any) => {
    const name = (item.customerName || item.customer?.fullName || item.userName || '').toLowerCase();
    const tourName = (item.tourName || item.tour?.name || item.tourTitle || '').toLowerCase();
    const code = (item.bookingCode || String(item.id)).toLowerCase();
    const term = searchTerm.toLowerCase();
    const matchSearch = !term || name.includes(term) || tourName.includes(term) || code.includes(term);
    const matchStatus = statusFilter === 'ALL' || String(getStatusNum(item.status)) === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AuthGuard allowedRoles={['STAFF', 'ADMIN']}>
      <div className="bg-surface text-on-surface font-body-md min-h-screen flex">
        <Sidebar />

        <main className="flex-1 ml-64 p-margin-desktop bg-surface min-h-screen">
          <AdminHeader
            title="Quản Lý Đăng Ký Tour"
            description="Duyệt, xác nhận hoặc từ chối yêu cầu đặt tour theo quy trình nghiệp vụ."
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Tìm theo tên KH, tour, mã booking..."
          />

          {/* Toast */}
          {toast && (
            <div className={`fixed top-6 right-6 z-[200] px-5 py-3 rounded-2xl shadow-elevated text-sm font-bold flex items-center gap-2 animate-[fade-in_0.3s_ease-out] ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
              <span className="material-symbols-outlined text-[18px]">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
              {toast.msg}
            </div>
          )}

          {/* Filter tabs */}
          <div className="mb-lg flex flex-wrap gap-2">
            {FILTER_TABS.map(tab => (
              <button
                key={tab.code}
                onClick={() => setStatusFilter(tab.code)}
                className={`px-4 py-1.5 rounded-full text-label-sm font-medium border transition-all ${
                  statusFilter === tab.code
                    ? 'bg-primary text-white font-bold border-primary shadow-sm'
                    : 'bg-surface-container-highest/50 hover:bg-primary/10 hover:border-primary/30 text-on-surface border-outline-variant/50'
                }`}
              >
                {tab.label}
                {tab.code !== 'ALL' && (() => {
                  const cnt = rawItems.filter((i: any) => String(getStatusNum(i.status)) === tab.code).length;
                  return cnt > 0 ? <span className="ml-1.5 bg-white/20 rounded-full px-1.5 py-0.5 text-[10px] font-black">{cnt}</span> : null;
                })()}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl custom-shadow border border-outline-variant/30 overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center py-16 gap-3">
                <span className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></span>
                <span className="text-on-surface-variant text-sm font-medium">Đang tải dữ liệu...</span>
              </div>
            ) : (
              <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container-low border-b border-outline-variant/50">
                    <tr>
                      <th className="px-5 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Mã Booking</th>
                      <th className="px-5 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Khách Hàng</th>
                      <th className="px-5 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Tour Du Lịch</th>
                      <th className="px-5 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Ngày Khởi Hành</th>
                      <th className="px-5 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Số Khách</th>
                      <th className="px-5 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Tổng Tiền</th>
                      <th className="px-5 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Trạng Thái</th>
                      <th className="px-5 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right whitespace-nowrap">Hành Động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {displayedItems.length > 0 ? (
                      displayedItems.map((item: any) => {
                        const statusNum = getStatusNum(item.status);
                        const statusCfg = STATUS_CONFIG[statusNum] || STATUS_CONFIG[0];
                        const code = item.bookingCode || `BK-${item.id}`;
                        const customerName = item.customerName || item.customer?.fullName || item.userName || '—';
                        const tourName = item.tourName || item.tour?.name || item.tourTitle || '—';
                        const startDate = item.startDate ? new Date(item.startDate).toLocaleDateString('vi-VN') : '—';
                        const numPeople = (item.numAdults || 0) + (item.numChildren || 0);
                        const totalPrice = item.finalPrice ?? item.totalPrice ?? 0;

                        return (
                          <tr key={item.id} className="hover:bg-surface-container-lowest transition-all duration-200">
                            <td className="px-5 py-4">
                              <Link href={`/registrations/${item.id}`} className="font-mono text-xs font-bold text-primary hover:underline">
                                {code}
                              </Link>
                            </td>
                            <td className="px-5 py-4">
                              <span className="font-label-md text-label-md font-bold text-on-surface block">{customerName}</span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-sm text-primary font-semibold line-clamp-1 max-w-[200px] block">{tourName}</span>
                            </td>
                            <td className="px-5 py-4 text-sm text-on-surface-variant font-medium whitespace-nowrap">{startDate}</td>
                            <td className="px-5 py-4 text-sm text-on-surface font-semibold">{numPeople || '—'}</td>
                            <td className="px-5 py-4 text-sm font-bold text-on-surface whitespace-nowrap">
                              {totalPrice > 0 ? totalPrice.toLocaleString('vi-VN') + 'đ' : '—'}
                            </td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap ${statusCfg.badgeClass}`}>
                                <span className="material-symbols-outlined text-[12px]">{statusCfg.icon}</span>
                                {statusCfg.label}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <div className="flex justify-end items-center gap-1.5 flex-nowrap">
                                <Link
                                  href={`/registrations/${item.id}`}
                                  className="border border-outline-variant/65 text-on-surface-variant hover:bg-surface-variant/20 font-bold text-[11px] px-2.5 py-1.5 rounded-lg active:scale-95 transition-all shadow-sm whitespace-nowrap"
                                >
                                  Chi Tiết
                                </Link>

                                {/* BR-03: Pending → Duyệt (Confirmed) */}
                                {statusNum === BookingStatusEnum.Pending && (
                                  <>
                                    <button
                                      onClick={() => handleAction(item.id, BookingStatusEnum.Confirmed, 'Duyệt', `Xác nhận đơn đặt tour "${tourName}" của khách "${customerName}"?`, 'bg-blue-600 hover:bg-blue-700 text-white')}
                                      className="bg-primary hover:bg-primary/90 text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg active:scale-95 transition-all shadow-sm whitespace-nowrap"
                                    >
                                      Duyệt
                                    </button>
                                    {/* BR-04: Từ chối → Cancelled */}
                                    <button
                                      onClick={() => handleAction(item.id, BookingStatusEnum.Cancelled, 'Từ Chối', `Từ chối đơn đặt tour của "${customerName}"? Tour sẽ quay về trạng thái mở đăng ký.`, 'bg-rose-600 hover:bg-rose-700 text-white')}
                                      className="border border-rose-300 text-rose-600 hover:bg-rose-600 hover:text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg active:scale-95 transition-all whitespace-nowrap"
                                    >
                                      Từ chối
                                    </button>
                                  </>
                                )}

                                {/* Confirmed → InProgress (tour bắt đầu) */}
                                {statusNum === BookingStatusEnum.Confirmed && (
                                  <>
                                    <button
                                      onClick={() => handleAction(item.id, BookingStatusEnum.InProgress, 'Bắt Đầu Tour', `Xác nhận tour "${tourName}" đã bắt đầu khởi hành?`, 'bg-secondary hover:bg-secondary/90 text-white')}
                                      className="bg-secondary hover:bg-secondary/90 text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg active:scale-95 transition-all shadow-sm whitespace-nowrap"
                                    >
                                      Bắt đầu
                                    </button>
                                    {/* Hủy từ Confirmed → Cancelled (BR-06 penalty áp dụng nếu trễ) */}
                                    <button
                                      onClick={() => handleAction(item.id, BookingStatusEnum.Cancelled, 'Hủy Đặt Tour', `Hủy đặt tour của "${customerName}"? Nếu trong vòng 3 ngày trước khởi hành, sẽ áp dụng phí phạt 10%.`, 'bg-rose-600 hover:bg-rose-700 text-white')}
                                      className="border border-rose-300 text-rose-600 hover:bg-rose-600 hover:text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg active:scale-95 transition-all whitespace-nowrap"
                                    >
                                      Hủy
                                    </button>
                                  </>
                                )}

                                {/* InProgress → Completed */}
                                {statusNum === BookingStatusEnum.InProgress && (
                                  <button
                                    onClick={() => handleAction(item.id, BookingStatusEnum.Completed, 'Hoàn Thành', `Đánh dấu tour "${tourName}" đã hoàn thành?`, 'bg-emerald-600 hover:bg-emerald-700 text-white')}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg active:scale-95 transition-all shadow-sm whitespace-nowrap"
                                  >
                                    Hoàn thành
                                  </button>
                                )}

                                {/* BR-07: Cancelled → Refunded (hoàn tiền) */}
                                {statusNum === BookingStatusEnum.Cancelled && (
                                  <button
                                    onClick={() => handleAction(item.id, BookingStatusEnum.Refunded, 'Hoàn Tiền', `Xác nhận đã hoàn tiền cho "${customerName}" theo chính sách BR-07?`, 'bg-purple-600 hover:bg-purple-700 text-white')}
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg active:scale-95 transition-all shadow-sm whitespace-nowrap"
                                  >
                                    Hoàn tiền
                                  </button>
                                )}

                                {/* Completed / Refunded → Hồ sơ đã lưu */}
                                {(statusNum === BookingStatusEnum.Completed || statusNum === BookingStatusEnum.Refunded) && (
                                  <span className="text-xs text-on-surface-variant italic font-semibold px-2 whitespace-nowrap">Hồ sơ đã lưu</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center">
                          <span className="material-symbols-outlined text-outline text-[48px] block mb-3">search_off</span>
                          <p className="text-on-surface-variant font-medium">Không tìm thấy đăng ký nào phù hợp</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer count */}
            <div className="px-6 py-3 border-t border-outline-variant/50 flex items-center justify-between bg-surface-container-low/30">
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Hiển thị <strong>{displayedItems.length}</strong> / {rawItems.length} bản ghi
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-xl shadow-elevated border border-outline-variant/20 max-w-[450px] w-full animate-[subtle-zoom_0.3s_ease-out]">
            <h3 className="font-headline-sm text-headline-sm text-primary font-bold mb-sm">{confirmModal.label}</h3>
            <p className="text-on-surface-variant text-sm mb-lg">{confirmModal.description}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-5 py-2 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-variant/20 font-bold text-sm transition-all"
              >
                Hủy bỏ
              </button>
              <button
                onClick={executeAction}
                disabled={updateStatusMutation.isPending}
                className={`px-5 py-2 rounded-xl font-bold text-sm transition-all disabled:opacity-60 ${confirmModal.confirmClass}`}
              >
                {updateStatusMutation.isPending ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}
