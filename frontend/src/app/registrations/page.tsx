'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthGuard } from '../../components/layout/AuthGuard';
import { Sidebar } from '../../components/layout/Sidebar';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { registrationService } from '../../services/registration.service';
import { RegistrationDto } from '../../types/registration';

interface DisplayRegistration extends RegistrationDto {
  email?: string;
  depositAmount?: number;
  totalAmount?: number;
}

const MOCK_REGISTRATIONS: DisplayRegistration[] = [
  { id: 101, tourId: 1, tourTitle: 'Du Thuyền Cao Cấp Vịnh Hạ Long', userId: 3, userName: 'Nguyễn Văn An', email: 'an.nguyen@gmail.com', registeredAt: '2026-06-05T09:00:00Z', status: 'Approved', depositAmount: 5000000, totalAmount: 12500000 },
  { id: 102, tourId: 3, tourTitle: 'Trekking Sapa - Ruộng Bậc Thang', userId: 4, userName: 'Trần Văn Bình', email: 'binh.tran@gmail.com', registeredAt: '2026-06-08T10:15:00Z', status: 'Pending', depositAmount: 0, totalAmount: 8200000 },
  { id: 103, tourId: 5, tourTitle: 'Đà Lạt - Đồi Chè & Thông Reo', userId: 5, userName: 'Lê Văn Minh', email: 'minh.le@gmail.com', registeredAt: '2026-05-12T14:30:00Z', status: 'Completed', depositAmount: 4800000, totalAmount: 4800000 },
  { id: 104, tourId: 7, tourTitle: 'Phố Cổ Hội An - Di Sản Văn Hóa', userId: 6, userName: 'Phạm Văn Vũ', email: 'vu.pham@gmail.com', registeredAt: '2026-04-10T11:00:00Z', status: 'Cancelled', depositAmount: 0, totalAmount: 6900000 },
  { id: 105, tourId: 4, tourTitle: 'Sài Gòn Xưa & Nay', userId: 7, userName: 'Hoàng Thị Ánh', email: 'anh.hoang@gmail.com', registeredAt: '2026-06-09T08:30:00Z', status: 'Pending', depositAmount: 0, totalAmount: 1800000 },
  { id: 106, tourId: 2, tourTitle: 'Biển Xanh Đà Nẵng', userId: 8, userName: 'Trần Thị Thu', email: 'thu.tran@gmail.com', registeredAt: '2026-06-03T16:00:00Z', status: 'Confirmed', depositAmount: 2000000, totalAmount: 6800000 }
];

export default function RegistrationsPage() {
  const qc = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [localRegs, setLocalRegs] = useState<DisplayRegistration[]>(MOCK_REGISTRATIONS);

  // Fetch actual registrations
  const { data: apiResponse } = useQuery({
    queryKey: ['registrations', statusFilter],
    queryFn: () => registrationService.getAll({ status: statusFilter === 'ALL' ? undefined : statusFilter }),
    retry: false,
  });

  // Action mutations
  const approveMutation = useMutation({
    mutationFn: (id: number) => registrationService.approve(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['registrations'] })
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) => registrationService.reject(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['registrations'] })
  });

  const confirmMutation = useMutation({
    mutationFn: (id: number) => registrationService.confirmParticipation(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['registrations'] })
  });

  const completeMutation = useMutation({
    mutationFn: (id: number) => registrationService.complete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['registrations'] })
  });

  const noShowMutation = useMutation({
    mutationFn: (id: number) => registrationService.noShow(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['registrations'] })
  });

  const handleAction = async (id: number, action: string) => {
    // If backend is running, trigger mutations
    if (apiResponse?.data) {
      try {
        switch (action) {
          case 'approve':
            await approveMutation.mutateAsync(id);
            break;
          case 'reject':
            await rejectMutation.mutateAsync(id);
            break;
          case 'confirm':
            await confirmMutation.mutateAsync(id);
            break;
          case 'complete':
            await completeMutation.mutateAsync(id);
            break;
          case 'noShow':
            await noShowMutation.mutateAsync(id);
            break;
        }
      } catch (err) {
        console.error('Action failed:', err);
      }
    } else {
      // Fallback state update for MOCK data
      setLocalRegs(prev => prev.map(reg => {
        if (reg.id === id) {
          let newStatus = reg.status;
          switch (action) {
            case 'approve': newStatus = 'Approved'; break;
            case 'reject': newStatus = 'Rejected'; break;
            case 'confirm': newStatus = 'Confirmed'; break;
            case 'complete': newStatus = 'Completed'; break;
            case 'noShow': newStatus = 'No Show'; break;
          }
          return { ...reg, status: newStatus };
        }
        return reg;
      }));
    }
  };

  const rawItems = (apiResponse?.data?.items ?? localRegs) as DisplayRegistration[];

  const displayedRegs = rawItems.filter(reg => {
    const matchesSearch = reg.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          reg.tourTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          String(reg.id).includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || reg.status.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'APPROVED':
        return 'bg-primary-container/20 text-primary border-primary-container/30';
      case 'CONFIRMED':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'COMPLETED':
        return 'bg-tertiary/10 text-tertiary border-tertiary/20';
      case 'CANCELLED':
      case 'REJECTED':
      case 'NO SHOW':
      case 'NO_SHOW':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-outline-variant/30 text-outline border-outline-variant/50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'Chờ duyệt';
      case 'APPROVED': return 'Đã duyệt';
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'COMPLETED': return 'Hoàn thành';
      case 'CANCELLED': return 'Đã hủy';
      case 'REJECTED': return 'Từ chối';
      case 'NO SHOW':
      case 'NO_SHOW': return 'Vắng mặt';
      default: return status;
    }
  };

  return (
    <AuthGuard allowedRoles={['STAFF', 'ADMIN']}>
      <div className="bg-surface text-on-surface font-body-md min-h-screen flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Canvas Area */}
        <main className="flex-1 ml-64 p-margin-desktop bg-surface min-h-screen">
          {/* Header Section */}
          <AdminHeader
            title="Quản Lý Đăng Ký Tour"
            description="Duyệt, từ chối hoặc theo dõi việc đặt tour và trạng thái thanh toán của khách."
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Tìm kiếm theo tên, tour, ID..."
          />

          {/* Table Container */}
          <div className="bg-white rounded-xl custom-shadow border border-outline-variant/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low border-b border-outline-variant/50">
                  <tr>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Mã Đăng Ký</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Khách Hàng</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Tour Du Lịch</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Ngày Đăng Ký</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Trạng Thái</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {displayedRegs.length > 0 ? (
                    displayedRegs.map((reg) => {
                      const status = reg.status.toUpperCase();
                      return (
                        <tr key={reg.id} className="hover:bg-surface-container-lowest transition-all hover:translate-x-1 duration-200">
                          <td className="px-6 py-4 font-mono text-label-md font-bold text-primary">
                            <Link href={`/registrations/${reg.id}`} className="hover:underline">
                              REG-{reg.id}
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-left">
                            <span className="font-label-md text-label-md font-bold text-on-surface block">{reg.userName}</span>
                            <span className="text-[11px] text-on-surface-variant">{reg.email || 'customer@viettour.com'}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-primary font-bold">{reg.tourTitle}</td>
                          <td className="px-6 py-4 text-sm text-on-surface-variant font-medium">
                            {new Date(reg.registeredAt).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadgeClass(reg.status)}`}>
                              {getStatusLabel(reg.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end items-center gap-2">
                              <Link
                                href={`/registrations/${reg.id}`}
                                className="border border-outline-variant/65 text-on-surface-variant hover:bg-surface-variant/20 font-bold text-[11px] px-3 py-1.5 rounded-lg active:scale-95 transition-all shadow-sm"
                              >
                                Chi Tiết
                              </Link>
                              {status === 'PENDING' && (
                                <>
                                  <button
                                    onClick={() => handleAction(reg.id, 'approve')}
                                    className="bg-primary hover:bg-primary-container text-white font-bold text-[11px] px-3 py-1.5 rounded-lg active:scale-95 transition-all shadow-sm"
                                  >
                                    Duyệt
                                  </button>
                                  <button
                                    onClick={() => handleAction(reg.id, 'reject')}
                                    className="border border-outline-variant/65 text-on-surface-variant hover:text-white hover:bg-error font-bold text-[11px] px-3 py-1.5 rounded-lg active:scale-95 transition-all"
                                  >
                                    Từ chối
                                  </button>
                                </>
                              )}
                              {status === 'APPROVED' && (
                                <>
                                  <button
                                    onClick={() => handleAction(reg.id, 'confirm')}
                                    className="bg-secondary hover:bg-secondary/90 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg active:scale-95 transition-all shadow-sm"
                                  >
                                    Xác nhận cọc
                                  </button>
                                  <button
                                    onClick={() => handleAction(reg.id, 'cancel')}
                                    className="border border-outline-variant/65 text-on-surface-variant hover:bg-error/5 hover:text-error font-bold text-[11px] px-3 py-1.5 rounded-lg active:scale-95 transition-all"
                                  >
                                    Hủy
                                  </button>
                                </>
                              )}
                              {status === 'CONFIRMED' && (
                                <>
                                  <button
                                    onClick={() => handleAction(reg.id, 'complete')}
                                    className="bg-tertiary hover:bg-tertiary/95 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg active:scale-95 transition-all shadow-sm"
                                  >
                                    Hoàn thành
                                  </button>
                                  <button
                                    onClick={() => handleAction(reg.id, 'noShow')}
                                    className="border border-outline-variant/65 text-on-surface-variant hover:bg-error/5 hover:text-error font-bold text-[11px] px-3 py-1.5 rounded-lg active:scale-95 transition-all"
                                  >
                                    Vắng mặt
                                  </button>
                                </>
                              )}
                              {(status === 'COMPLETED' || status === 'CANCELLED' || status === 'REJECTED' || status === 'NO SHOW' || status === 'NO_SHOW') && (
                                <span className="text-xs text-on-surface-variant italic font-semibold px-2">Hồ sơ đã lưu</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-on-surface-variant">
                        Không tìm thấy yêu cầu đăng ký nào phù hợp với bộ lọc.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-outline-variant/50 flex items-center justify-between">
              <p className="font-label-sm text-label-sm text-on-surface-variant">Hiển thị {displayedRegs.length} bản ghi</p>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:cursor-not-allowed" disabled>
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-bold text-label-sm">1</button>
                <button className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="mt-lg flex flex-wrap gap-md text-left">
            <span className="text-on-surface-variant font-label-md self-center mr-2">Lọc trạng thái:</span>
            {[
              { code: 'ALL', label: 'Tất cả' },
              { code: 'PENDING', label: 'Chờ duyệt' },
              { code: 'APPROVED', label: 'Đã duyệt' },
              { code: 'CONFIRMED', label: 'Đã xác nhận cọc' },
              { code: 'COMPLETED', label: 'Hoàn thành' },
              { code: 'CANCELLED', label: 'Đã hủy' }
            ].map((tab) => (
              <button
                key={tab.code}
                onClick={() => setStatusFilter(tab.code)}
                className={`px-4 py-1.5 rounded-full text-label-sm font-medium border border-outline-variant/50 transition-all ${
                  statusFilter === tab.code 
                    ? 'bg-primary text-on-primary font-bold' 
                    : 'bg-surface-container-highest/50 hover:bg-primary-container hover:text-on-primary-container text-on-surface'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
