'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthGuard } from '../../../components/layout/AuthGuard';
import { Sidebar } from '../../../components/layout/Sidebar';
import { AdminHeader } from '../../../components/layout/AdminHeader';
import { tourService } from '../../../services/tour.service';
import { getPlaceholderImage } from '../../../utils/image';

interface ApiTour {
  id: number;
  tourTypeId: number;
  tourTypeName: string;
  name: string;
  slug: string;
  durationDays: number;
  durationNights: number;
  location: string;
  priceAdult: number;
  priceChild: number;
  maxPeople: number;
  registeredCount: number;
  isActive: boolean;
  isFeatured: boolean;
  description?: string;
  images: { id: number; imageUrl: string; altText?: string }[];
}

export default function ManageToursPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Tours
  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ['adminTours', searchTerm],
    queryFn: async () => {
      const res = await tourService.getAll({ SearchTerm: searchTerm || undefined, PageSize: 100 });
      return (res.data?.items || []) as unknown as ApiTour[];
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => tourService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTours'] });
    }
  });

  // Toggle Active Mutation
  const toggleMutation = useMutation({
    mutationFn: (id: number) => tourService.toggleActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTours'] });
    }
  });

  const handleArchive = (id: number, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn XÓA vĩnh viễn tour "${name}"?\nTour sẽ bị ẩn khỏi hệ thống (soft delete).`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleActive = (tour: ApiTour) => {
    const action = tour.isActive ? 'ĐÓNG đăng ký' : 'MỞ đăng ký';
    if (confirm(`Bạn có chắc chắn muốn ${action} cho tour "${tour.name}"?`)) {
      toggleMutation.mutate(tour.id);
    }
  };

  const tours = apiResponse || [];

  return (
    <AuthGuard allowedRoles={['STAFF', 'ADMIN']}>
      <div className="bg-surface text-on-surface font-body-md min-h-screen flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Canvas Area */}
        <main className="flex-1 ml-64 p-margin-desktop bg-surface min-h-screen">
          {/* Header Section */}
          <AdminHeader
            title="Quản Lý Tour Du Lịch"
            description="Quản lý và theo dõi các sản phẩm du lịch và lịch trình hiện tại của bạn."
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Tìm kiếm tour..."
            actionButton={
              <Link
                href="/tours/create"
                className="bg-primary hover:bg-primary-container text-on-primary font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-soft"
              >
                <span className="material-symbols-outlined">add_circle</span>
                Thêm Tour
              </Link>
            }
          />

          {/* Stats Overview Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-xl">
            <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 text-left">
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">Tổng Số Tour</p>
              <p className="font-headline-md text-headline-md text-primary font-semibold">{tours.length}</p>
              <div className="mt-2 flex items-center gap-1 text-tertiary">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                <span className="text-[12px] font-bold">Dữ liệu hệ thống</span>
              </div>
            </div>
            <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 text-left">
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">Đang hoạt động</p>
              <p className="font-headline-md text-headline-md text-primary font-semibold">
                {tours.filter(t => t.isActive).length}
              </p>
              <div className="mt-2 flex items-center gap-1 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span className="text-[12px]">Được khách hàng nhìn thấy</span>
              </div>
            </div>
            <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 text-left">
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">Tạm dừng nhận khách</p>
              <p className="font-headline-md text-headline-md text-secondary font-semibold">
                {tours.filter(t => !t.isActive).length}
              </p>
              <div className="mt-2 flex items-center gap-1 text-secondary">
                <span className="material-symbols-outlined text-[16px]">pause_circle</span>
                <span className="text-[12px] font-bold">Cần kiểm tra lại</span>
              </div>
            </div>
            <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 text-left">
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">Tour Nổi Bật</p>
              <p className="font-headline-md text-headline-md text-primary font-semibold">
                {tours.filter(t => t.isFeatured).length}
              </p>
              <div className="mt-2 flex items-center gap-1 text-tertiary">
                <span className="material-symbols-outlined text-[16px]">star</span>
                <span className="text-[12px]">Hiển thị trang chủ</span>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl custom-shadow border border-outline-variant/30 overflow-hidden text-left">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low border-b border-outline-variant/50">
                  <tr>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Mã Tour</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Tên Tour</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Địa Điểm</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Thời Gian</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Đăng Ký</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Trạng Thái</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Giá Người Lớn</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-on-surface-variant">
                        <div className="flex justify-center items-center gap-md">
                          <span className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
                          <span>Đang tải danh sách tour du lịch...</span>
                        </div>
                      </td>
                    </tr>
                  ) : tours.length > 0 ? (
                    tours.map((tour) => {
                      const image = tour.images?.[0]?.imageUrl || getPlaceholderImage(80, 50, 'Tour');
                      return (
                        <tr key={tour.id} className="hover:bg-surface-container-lowest transition-all hover:translate-x-1 duration-200">
                          <td className="px-6 py-4 font-mono text-label-md text-on-surface-variant">TOUR-{tour.id}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img alt={tour.name} className="w-12 h-8 rounded object-cover flex-shrink-0" src={image} />
                              <div>
                                <span className="font-label-md text-label-md text-on-surface font-bold line-clamp-1 block">
                                  {tour.name}
                                </span>
                                {tour.isFeatured && (
                                  <span className="text-[10px] text-tertiary font-bold flex items-center gap-0.5">
                                    <span className="material-symbols-outlined text-[11px]">star</span>
                                    Nổi bật
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-on-surface-variant">
                            <div className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px] text-outline">location_on</span>
                              {tour.location}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-on-surface-variant">
                            {tour.durationDays} Ngày {tour.durationNights} Đêm
                          </td>
                          <td className="px-6 py-4">
                             {(() => {
                               const registered = tour.registeredCount ?? 0;
                               const max = tour.maxPeople || 1;
                               const isFull = registered >= max;
                               const pct = Math.min(100, Math.round(registered / max * 100));
                               return (
                                 <div className="space-y-1 min-w-[100px]">
                                   <div className="flex justify-between text-[11px] font-bold">
                                     <span className={isFull ? 'text-error' : 'text-on-surface-variant'}>
                                       {registered}/{max}
                                     </span>
                                     {isFull && <span className="text-error">Đủ chỗ</span>}
                                   </div>
                                   <div className="h-1.5 rounded-full bg-outline-variant/30 overflow-hidden">
                                     <div
                                       className={`h-full rounded-full transition-all ${
                                         isFull ? 'bg-error' : pct >= 80 ? 'bg-secondary' : 'bg-tertiary'
                                       }`}
                                       style={{ width: `${pct}%` }}
                                     />
                                   </div>
                                 </div>
                               );
                             })()}
                           </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap ${
                              tour.isActive
                                ? 'bg-tertiary/10 text-tertiary border-tertiary/20'
                                : 'bg-error/10 text-error border-error/20'
                            }`}>
                              {tour.isActive ? 'Mở đăng ký' : 'Đã đóng'}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-body-md text-body-md text-on-surface font-bold">
                            {tour.priceAdult.toLocaleString('vi-VN')}đ
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-1">

                              <button
                                 onClick={() => handleToggleActive(tour)}
                                 disabled={toggleMutation.isPending}
                                 className={`p-2 transition-colors rounded-lg flex items-center active:scale-95 disabled:opacity-50 ${
                                   tour.isActive
                                     ? 'text-on-surface-variant hover:text-secondary hover:bg-secondary/5'
                                     : 'text-on-surface-variant hover:text-tertiary hover:bg-tertiary/5'
                                 }`}
                                 title={tour.isActive ? 'Đóng đăng ký' : 'Mở đăng ký'}
                               >
                                 <span className="material-symbols-outlined text-[20px]">
                                   {tour.isActive ? 'lock' : 'lock_open'}
                                 </span>
                               </button>
                              <Link
                                href={`/tours/edit/${tour.id}`}
                                className="p-2 text-on-surface-variant hover:text-secondary transition-colors hover:bg-secondary/5 rounded-lg flex items-center"
                                title="Chỉnh sửa"
                              >
                                <span className="material-symbols-outlined text-[20px]">edit</span>
                              </Link>
                              <button
                                onClick={() => handleArchive(tour.id, tour.name)}
                                disabled={deleteMutation.isPending}
                                className="p-2 text-on-surface-variant hover:text-error transition-colors hover:bg-error/5 rounded-lg flex items-center active:scale-95 disabled:opacity-50"
                                title="Xóa (Soft Delete)"
                              >
                                <span className="material-symbols-outlined text-[20px]">delete_forever</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-sm text-on-surface-variant">
                          <span className="material-symbols-outlined text-[48px] text-outline">travel_explore</span>
                          <p className="font-label-md">Không tìm thấy tour du lịch nào.</p>
                          {searchTerm && (
                            <button
                              onClick={() => setSearchTerm('')}
                              className="text-primary font-bold text-label-sm hover:underline"
                            >
                              Xóa bộ lọc
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-outline-variant/50 flex items-center justify-between">
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Hiển thị <span className="font-bold text-on-surface">{tours.length}</span> tour du lịch
              </p>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:cursor-not-allowed" disabled>
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-bold text-label-sm">1</button>
                <button className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors" disabled>
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="mt-lg flex flex-wrap gap-md text-left">
            <span className="text-on-surface-variant font-label-md self-center mr-2">Bộ lọc nhanh địa điểm:</span>
            {['Hạ Long', 'Sapa', 'Đà Nẵng', 'Hội An', 'Ninh Bình', 'Đà Lạt'].map((loc) => (
              <button
                key={loc}
                onClick={() => setSearchTerm(loc)}
                className={`px-4 py-1.5 rounded-full text-label-sm font-medium border transition-all ${
                  searchTerm === loc
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container-highest/50 text-on-surface border-outline-variant/50 hover:bg-primary-container hover:text-on-primary-container'
                }`}
              >
                {loc}
              </button>
            ))}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="bg-error/5 text-error px-4 py-1.5 rounded-full text-label-sm font-bold border border-error/20 hover:bg-error hover:text-white transition-all flex items-center gap-xs"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
                Xóa lọc
              </button>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
