'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthGuard } from '../../components/layout/AuthGuard';
import { Sidebar } from '../../components/layout/Sidebar';
import { AdminHeader } from '../../components/layout/AdminHeader';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { ConfirmDeleteModal, ConfirmDeleteConfig } from '../../components/ui/ConfirmDeleteModal';

interface CustomerItem {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  bookingCount?: number;
}

export default function CustomersPage() {
  const qc = useQueryClient();
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  // Modal xóa/khóa tài khoản
  const [lockModal, setLockModal] = useState<{
    isOpen: boolean;
    config: ConfirmDeleteConfig | null;
    targetUser: CustomerItem | null;
  }>({ isOpen: false, config: null, targetUser: null });

  const { data, isLoading } = useQuery({
    queryKey: ['customers', page, searchTerm],
    queryFn: async () => {
      const params: any = { Page: page, PageSize: 10 };
      if (searchTerm) params.SearchTerm = searchTerm;
      const res = await api.get('/Customers', { params });
      return res.data?.data;
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.patch(`/Customers/${id}/toggle-active`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] });
      setLockModal({ isOpen: false, config: null, targetUser: null });
    },
  });

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [roleInput, setRoleInput] = useState('Customer');

  const roleMutation = useMutation({
    mutationFn: async () => {
      if (!selectedCustomer) return;
      const res = await api.put(`/Customers/${selectedCustomer.id}`, {
        Role: roleInput,
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] });
      setIsRoleModalOpen(false);
      setSelectedCustomer(null);
      alert('Đã phân quyền người dùng thành công!');
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || 'Có lỗi xảy ra khi phân quyền người dùng.');
    }
  });

  const items: CustomerItem[] = data?.items || [];
  const totalCount: number = data?.totalCount || 0;

  const getStatusBadge = (isActive: boolean) =>
    isActive
      ? 'bg-tertiary/10 text-tertiary border-tertiary/20'
      : 'bg-error/10 text-error border-error/20';

  const getRoleBadge = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN': return 'bg-primary/10 text-primary border-primary/20';
      case 'STAFF': return 'bg-secondary/10 text-secondary border-secondary/20';
      default: return 'bg-outline-variant/30 text-outline border-outline-variant/50';
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  return (
    <AuthGuard allowedRoles={['ADMIN']}>
      <div className="bg-surface text-on-surface font-body-md min-h-screen flex">
        <Sidebar />

        <main className="flex-1 ml-64 p-margin-desktop bg-surface min-h-screen">
          <AdminHeader
            title="Quản Lý Người Dùng"
            description="Theo dõi tài khoản, phân quyền và trạng thái truy cập."
            searchTerm={searchTerm}
            onSearchChange={(val: string) => { setSearchTerm(val); setPage(1); }}
            searchPlaceholder="Tìm tên, email..."
          />

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-xl">
            <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 text-left">
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">Tổng Người Dùng</p>
              <p className="font-headline-md text-headline-md text-primary font-semibold">
                {isLoading ? '...' : totalCount}
              </p>
            </div>
            <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 text-left">
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">Đang Hoạt Động</p>
              <p className="font-headline-md text-headline-md text-tertiary font-semibold">
                {isLoading ? '...' : items.filter((u: CustomerItem) => u.isActive).length}
              </p>
            </div>
            <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 text-left">
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">Đã Khóa</p>
              <p className="font-headline-md text-headline-md text-error font-semibold">
                {isLoading ? '...' : items.filter((u: CustomerItem) => !u.isActive).length}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl custom-shadow border border-outline-variant/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low border-b border-outline-variant/50">
                  <tr>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Họ Tên</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Vai Trò</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Trạng Thái</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {items.length > 0 ? (
                    items.map((u: CustomerItem) => (
                      <tr key={u.id} className="hover:bg-surface-container-lowest transition-all hover:translate-x-1 duration-200">
                        <td className="px-6 py-4 font-mono text-label-md text-on-surface-variant">USR-{String(u.id).padStart(3, '0')}</td>
                        <td className="px-6 py-4 font-bold text-primary">{u.fullName}</td>
                        <td className="px-6 py-4 text-on-surface-variant">{u.email}</td>
                        <td className="px-6 py-4 font-semibold text-label-sm">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getRoleBadge(u.role)}`}>
                            {u.role?.toUpperCase() === 'ADMIN' ? 'Quản trị viên' : u.role?.toUpperCase() === 'STAFF' ? 'Nhân viên' : 'Khách hàng'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getStatusBadge(u.isActive)}`}>
                            {u.isActive ? 'Hoạt Động' : 'Đã Khóa'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/customers/${u.id}`} className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-primary/5 rounded-lg" title="Xem Chi Tiết">
                              <span className="material-symbols-outlined">visibility</span>
                            </Link>
                            {u.email?.toLowerCase() !== currentUser?.email?.toLowerCase() && (
                              <button
                                onClick={() => {
                                  setSelectedCustomer(u);
                                  setRoleInput(u.role || 'Customer');
                                  setIsRoleModalOpen(true);
                                }}
                                className="p-2 text-on-surface-variant hover:text-secondary transition-colors hover:bg-secondary/5 rounded-lg"
                                title="Phân Quyền"
                              >
                                <span className="material-symbols-outlined">key</span>
                              </button>
                            )}
                            {u.email?.toLowerCase() === currentUser?.email?.toLowerCase() ? (
                              <button
                                disabled
                                className="p-2 rounded-lg text-outline-variant cursor-not-allowed opacity-40"
                                title="Không thể tự khóa tài khoản của chính mình"
                              >
                                <span className="material-symbols-outlined">lock</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setLockModal({
                                    isOpen: true,
                                    targetUser: u,
                                    config: {
                                      itemName: u.fullName,
                                      itemType: 'tài khoản',
                                      icon: u.isActive ? 'lock' : 'lock_open',
                                      variant: u.isActive ? 'danger' : 'warning',
                                      description: u.isActive
                                        ? `Tài khoản "${u.fullName}" sẽ bị khóa và không thể đăng nhập vào hệ thống.`
                                        : `Tài khoản "${u.fullName}" sẽ được mở khóa và có thể đăng nhập trở lại.`,
                                    },
                                  });
                                }}
                                disabled={toggleMutation.isPending}
                                className={`p-2 rounded-lg transition-colors hover:bg-surface-container ${u.isActive ? 'text-error hover:text-error/85 hover:bg-error/5' : 'text-tertiary hover:text-tertiary/85 hover:bg-tertiary/5'}`}
                                title={u.isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                              >
                                <span className="material-symbols-outlined">
                                  {u.isActive ? 'lock' : 'lock_open'}
                                </span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-on-surface-variant">
                        {isLoading ? 'Đang tải...' : 'Không tìm thấy người dùng nào.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-outline-variant/50 flex items-center justify-between">
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Trang {page} / {Math.max(1, Math.ceil(totalCount / 10))} — {totalCount} người dùng
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p: number) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <span className="w-8 h-8 rounded-lg bg-primary text-on-primary font-bold text-label-sm flex items-center justify-center">{page}</span>
                <button
                  onClick={() => setPage((p: number) => p + 1)}
                  disabled={page >= Math.ceil(totalCount / 10)}
                  className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Role Edit Modal */}
          {isRoleModalOpen && selectedCustomer && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-md bg-black/40 backdrop-blur-sm transition-opacity">
              <div className="bg-white rounded-3xl p-xl max-w-[450px] w-full border border-outline-variant/30 shadow-natural space-y-md text-left">
                <div className="flex items-center justify-between border-b border-outline-variant/25 pb-sm">
                  <h3 className="font-title-lg text-title-lg text-primary font-extrabold flex items-center gap-sm">
                    <span className="material-symbols-outlined">key</span>
                    Phân Quyền Người Dùng
                  </h3>
                  <button 
                    onClick={() => setIsRoleModalOpen(false)} 
                    className="p-1 rounded-full hover:bg-surface-variant/20 transition-all text-outline"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="space-y-sm text-xs">
                  <p className="text-on-surface-variant font-medium">
                    Thay đổi vai trò hệ thống của tài khoản <strong>{selectedCustomer.fullName}</strong> ({selectedCustomer.email}).
                  </p>
                  <div>
                    <label className="font-bold text-outline uppercase tracking-wider block mb-2">Vai Trò Hệ Thống</label>
                    <div className="relative">
                      <select
                        value={roleInput}
                        onChange={(e) => setRoleInput(e.target.value)}
                        className="w-full px-md py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md appearance-none"
                      >
                        <option value="Customer">Khách hàng (Customer)</option>
                        <option value="Staff">Nhân viên (Staff)</option>
                        <option value="Admin">Quản trị viên (Admin)</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                        keyboard_arrow_down
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-sm border-t border-outline-variant/25 pt-md">
                  <button
                    onClick={() => setIsRoleModalOpen(false)}
                    disabled={roleMutation.isPending}
                    className="flex-1 py-3 border border-outline hover:bg-surface-variant/20 font-bold rounded-2xl transition-all text-xs"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={() => roleMutation.mutate()}
                    disabled={roleMutation.isPending}
                    className="flex-1 bg-primary hover:bg-primary-container text-white font-bold py-3 rounded-2xl transition-bounce active:scale-95 text-xs flex justify-center items-center gap-1.5 shadow-sm"
                  >
                    {roleMutation.isPending ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">save</span>
                        Lưu thay đổi
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Lock/Unlock Account Modal */}
      <ConfirmDeleteModal
        isOpen={lockModal.isOpen}
        config={lockModal.config}
        isPending={toggleMutation.isPending}
        onConfirm={() => lockModal.targetUser && toggleMutation.mutate(lockModal.targetUser.id)}
        onCancel={() => setLockModal({ isOpen: false, config: null, targetUser: null })}
      />
    </AuthGuard>
  );
}
