'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthGuard } from '../../components/layout/AuthGuard';
import { Sidebar } from '../../components/layout/Sidebar';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { Navbar } from '../../components/layout/Navbar';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/auth.service';
import api from '../../services/api';

interface CustomerInfo {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  nationality?: string;
  passportNumber?: string;
  idCard?: string;
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');


  
  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [nationality, setNationality] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [idCard, setIdCard] = useState('');

  // Password change states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Show toast utility
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Get customer info (extended details)
  const { data: customerData, isLoading: isCustomerLoading } = useQuery({
    queryKey: ['currentCustomer'],
    queryFn: async () => {
      const res = await api.get('/Customers/current');
      return res.data?.data as CustomerInfo;
    },
    enabled: !!user,
  });

  // Populate form fields once user or customer data is loaded
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    if (customerData) {
      if (customerData.fullName) setFullName(customerData.fullName);
      if (customerData.email) setEmail(customerData.email);
      setPhone(customerData.phone || '');
      setAddress(customerData.address || '');
      if (customerData.dateOfBirth) {
        // Format ISO date to YYYY-MM-DD for date input
        const date = new Date(customerData.dateOfBirth);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        setDateOfBirth(`${yyyy}-${mm}-${dd}`);
      } else {
        setDateOfBirth('');
      }
      setNationality(customerData.nationality || '');
      setPassportNumber(customerData.passportNumber || '');
      setIdCard(customerData.idCard || '');
    }
  }, [customerData]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      return await authService.updateProfile(data);
    },
    onSuccess: (res) => {
      if (res.success) {
        showToast('Cập nhật thông tin cá nhân thành công!', 'success');
        qc.invalidateQueries({ queryKey: ['authUser'] });
        qc.invalidateQueries({ queryKey: ['currentCustomer'] });
      } else {
        showToast(res.message || 'Cập nhật thất bại', 'error');
      }
    },
    onError: (err: any) => {
      showToast(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật', 'error');
    }
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: any) => {
      return await authService.changePassword(data);
    },
    onSuccess: (res) => {
      if (res.success) {
        showToast('Thay đổi mật khẩu thành công!', 'success');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast(res.message || 'Thay đổi mật khẩu thất bại', 'error');
      }
    },
    onError: (err: any) => {
      showToast(err.response?.data?.message || 'Mật khẩu cũ không chính xác hoặc có lỗi xảy ra', 'error');
    }
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return showToast('Họ và tên không được để trống', 'error');
    if (!email.trim()) return showToast('Email không được để trống', 'error');

    updateProfileMutation.mutate({
      fullName,
      email,
      phone,
      address,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : null,
      nationality,
      passportNumber,
      idCard
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword) return showToast('Vui lòng nhập mật khẩu hiện tại', 'error');
    if (newPassword.length < 6) return showToast('Mật khẩu mới phải từ 6 ký tự trở lên', 'error');
    if (newPassword !== confirmPassword) return showToast('Xác nhận mật khẩu mới không khớp', 'error');

    changePasswordMutation.mutate({
      oldPassword,
      newPassword
    });
  };

  const isAdminOrStaff = user?.role === 'Admin' || user?.role === 'Staff';

  const renderFormInfo = () => (
    <form onSubmit={handleUpdateProfile} className="space-y-lg text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        {/* Username (Readonly) */}
        <div>
          <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-xs">Tên đăng nhập (Tài khoản)</label>
          <input 
            type="text" 
            value={user?.username || ''} 
            disabled 
            className="w-full px-md py-3 rounded-2xl border border-outline-variant bg-surface-container-low text-on-surface-variant font-medium cursor-not-allowed outline-none"
          />
        </div>

        {/* FullName */}
        <div>
          <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-xs">Họ và tên <span className="text-error">*</span></label>
          <input 
            type="text" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-md py-3 rounded-2xl border border-outline-variant bg-white text-on-surface font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Nhập họ và tên"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-xs">Email <span className="text-error">*</span></label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-md py-3 rounded-2xl border border-outline-variant bg-white text-on-surface font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="example@mail.com"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-xs">Số điện thoại</label>
          <input 
            type="tel" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-md py-3 rounded-2xl border border-outline-variant bg-white text-on-surface font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Nhập số điện thoại"
          />
        </div>

        {/* Các trường bổ sung nếu là khách hàng hoặc admin muốn điền */}
        <div>
          <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-xs">Ngày sinh</label>
          <input 
            type="date" 
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="w-full px-md py-3 rounded-2xl border border-outline-variant bg-white text-on-surface font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-xs">Quốc tịch</label>
          <input 
            type="text" 
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            className="w-full px-md py-3 rounded-2xl border border-outline-variant bg-white text-on-surface font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Ví dụ: Việt Nam"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-xs">Số CMND/CCCD</label>
          <input 
            type="text" 
            value={idCard}
            onChange={(e) => setIdCard(e.target.value)}
            className="w-full px-md py-3 rounded-2xl border border-outline-variant bg-white text-on-surface font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Nhập số CMND hoặc CCCD"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-xs">Số Hộ chiếu (Passport)</label>
          <input 
            type="text" 
            value={passportNumber}
            onChange={(e) => setPassportNumber(e.target.value)}
            className="w-full px-md py-3 rounded-2xl border border-outline-variant bg-white text-on-surface font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Nhập số hộ chiếu"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-xs">Địa chỉ thường trú</label>
        <textarea 
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          className="w-full px-md py-3 rounded-2xl border border-outline-variant bg-white text-on-surface font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
          placeholder="Nhập địa chỉ của bạn"
        />
      </div>

      <div className="flex justify-end pt-md">
        <button 
          type="submit"
          disabled={updateProfileMutation.isPending}
          className="bg-primary hover:bg-primary-container text-white px-xl py-3 rounded-2xl font-bold text-label-md transition-all duration-300 shadow-md flex items-center gap-xs disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
        >
          {updateProfileMutation.isPending ? (
            <>
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-xs"></span>
              Đang lưu...
            </>
          ) : 'Lưu thay đổi'}
        </button>
      </div>
    </form>
  );

  const renderFormPassword = () => (
    <form onSubmit={handleChangePassword} className="space-y-lg text-left w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        <div>
          <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-xs">Mật khẩu hiện tại</label>
          <input 
            type="password" 
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full px-md py-3 rounded-2xl border border-outline-variant bg-white text-on-surface font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="••••••••"
            required
          />
        </div>

        {/* Dùng div trống để chiếm cột thứ 2 ở hàng đầu tiên */}
        <div className="hidden md:block"></div>

        <div>
          <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-xs">Mật khẩu mới (tối thiểu 6 ký tự)</label>
          <input 
            type="password" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-md py-3 rounded-2xl border border-outline-variant bg-white text-on-surface font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="••••••••"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-xs">Xác nhận mật khẩu mới</label>
          <input 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-md py-3 rounded-2xl border border-outline-variant bg-white text-on-surface font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="••••••••"
            required
          />
        </div>
      </div>

      <div className="flex justify-end pt-md">
        <button 
          type="submit"
          disabled={changePasswordMutation.isPending}
          className="bg-primary hover:bg-primary-container text-white px-xl py-3 rounded-2xl font-bold text-label-md transition-all duration-300 shadow-md flex items-center gap-xs disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
        >
          {changePasswordMutation.isPending ? (
            <>
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-xs"></span>
              Đang đổi mật khẩu...
            </>
          ) : 'Đổi mật khẩu'}
        </button>
      </div>
    </form>
  );

  // Main UI Content (Inside standard layout grids)
  const renderProfileContent = () => (
    <div className="space-y-xl">
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-lg border border-outline-variant/30 shadow-soft flex flex-col md:flex-row gap-lg items-center md:items-start text-center md:text-left">
        <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center font-extrabold text-[28px] uppercase shrink-0">
          {user?.fullName?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'VT'}
        </div>
        <div className="space-y-xs flex-grow">
          <h2 className="font-headline-md text-headline-md text-primary font-bold">{user?.fullName}</h2>
          <p className="text-on-surface-variant font-body-md">Vai trò: <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">{user?.role === 'Admin' ? 'Quản trị viên' : user?.role === 'Staff' ? 'Nhân viên' : 'Khách hàng'}</span></p>
          <p className="text-outline text-xs">Tham gia hệ thống VietTour</p>
        </div>
        {!isAdminOrStaff && (
          <button 
            onClick={logout}
            className="border border-error text-error hover:bg-error/10 px-md py-2.5 rounded-2xl font-bold text-label-sm transition-all"
          >
            Đăng xuất
          </button>
        )}
      </div>

      {/* Tabs list */}
      <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-soft overflow-hidden">
        <div className="flex border-b border-outline-variant/30">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-lg text-center font-bold text-label-md border-b-2 transition-all duration-300 ${activeTab === 'info' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-outline hover:text-primary'}`}
          >
            <span className="flex items-center justify-center gap-xs">
              <span className="material-symbols-outlined text-[20px]">person</span>
              Thông tin cá nhân
            </span>
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-lg text-center font-bold text-label-md border-b-2 transition-all duration-300 ${activeTab === 'password' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-outline hover:text-primary'}`}
          >
            <span className="flex items-center justify-center gap-xs">
              <span className="material-symbols-outlined text-[20px]">lock</span>
              Đổi mật khẩu
            </span>
          </button>
        </div>

        <div className="p-lg md:p-xl">
          {activeTab === 'info' ? renderFormInfo() : renderFormPassword()}
        </div>
      </div>
    </div>
  );

  return (
    <AuthGuard>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-fade-in flex items-center gap-sm px-xl py-4 rounded-2xl shadow-lg border border-outline-variant bg-white">
          <span className={`material-symbols-outlined ${toast.type === 'success' ? 'text-green-500' : 'text-error'}`}>
            {toast.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span className="font-bold text-sm text-primary">{toast.message}</span>
        </div>
      )}

      {isAdminOrStaff ? (
        // Layout Admin
        <div className="flex h-screen bg-surface-container-lowest overflow-hidden">
          <Sidebar />
          <div className="flex-grow flex flex-col min-w-0 overflow-y-auto">
            <AdminHeader title="Thông Tin Cá Nhân" description="Xem và cập nhật thông tin cá nhân của bạn trên hệ thống VietTour." />
            <main className="flex-grow p-gutter md:p-margin-desktop w-full max-w-max-width mx-auto pb-2xl">
              {renderProfileContent()}
            </main>
          </div>
        </div>
      ) : (
        // Layout Customer/User thường
        <div className="min-h-screen bg-surface-container-lowest flex flex-col justify-between">
          <div>
            <Navbar />
            <main className="px-margin-mobile md:px-margin-desktop py-xl w-full max-w-max-width mx-auto">
              {renderProfileContent()}
            </main>
          </div>
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
                </ul>
              </div>
              <div className="space-y-md">
                <h5 className="text-on-primary dark:text-primary font-bold">Công ty</h5>
                <ul className="space-y-sm">
                  <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/about">Về chúng tôi</Link></li>
                </ul>
              </div>
              <div className="space-y-md">
                <h5 className="text-on-primary dark:text-primary font-bold">Hỗ trợ</h5>
                <ul className="space-y-sm">
                  <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/contact">Trung tâm trợ giúp</Link></li>
                </ul>
              </div>
            </div>
          </footer>
        </div>
      )}
    </AuthGuard>
  );
}
