'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const menuItems = [
    {
      href: '/dashboard',
      label: 'Bảng điều khiển',
      icon: 'dashboard',
    },
    {
      href: '/tours/manage',
      label: 'Quản lý Tour',
      icon: 'travel_explore',
    },
    {
      href: '/customers',
      label: 'Quản lý Người dùng',
      icon: 'group',
    },
    {
      href: '/registrations',
      label: 'Đăng ký Tour',
      icon: 'pending_actions',
    },
    {
      href: '/contacts',
      label: 'Quản lý Liên hệ',
      icon: 'mail',
    },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant/30 shadow-sm flex flex-col p-md z-50">
      {/* Brand logo */}
      <div className="flex items-center gap-3 px-2 mb-8 mt-2">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-sm">
          <span className="material-symbols-outlined">explore</span>
        </div>
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">VietTour</h1>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Cổng nhân viên</p>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-container text-on-primary-container font-bold translate-x-1'
                  : 'text-on-surface-variant hover:bg-surface-variant/40 font-medium'
              }`}
            >
              <span 
                className="material-symbols-outlined" 
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : undefined }}
              >
                {item.icon}
              </span>
              <span className="font-label-md text-label-md">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer action and user profile */}
      <div className="pt-4 border-t border-outline-variant/50 mt-auto">
        <Link 
          href="/tours/create" 
          className="w-full bg-secondary hover:bg-secondary/90 text-on-secondary hover:text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-soft mb-6"
        >
          <span className="material-symbols-outlined">add</span>
          Tạo Tour mới
        </Link>
        <div className="flex items-center justify-between gap-2 px-2">
          <Link href="/profile" className="flex items-center gap-3 overflow-hidden hover:opacity-85 transition-opacity flex-grow">
            <img
              alt="Admin Avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-primary/20 shrink-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcF4b0HjIQOggo9jnI7hO1MlazKWKTYP9nhl0JNZsEQzT2BRElZohOzjJ1aLjE6qW5Rlb9AThQcn0XdzMhkW3WQcoTIhHYLLwZh_V6mZ9Ua9okcWzFQCep21D69qPWVOW_bT8FJ4fLn9tzsiE6pXoJ-KH2TcnqBOqyn-RPD0WaQfc9KywCOIPlSSj6pR_KiIPJ5Rka4QUSh6wieXF2mgru7UwFUbmo6glFONLyF-xcz4QTOjR1rgyzRS5Wj9Vu4XXd355N7vn_yjE"
            />
            <div className="overflow-hidden text-left">
              <p className="font-label-md text-label-md font-bold text-on-surface truncate">
                {user?.fullName || 'Quản trị viên'}
              </p>
              <p className="text-[11px] text-on-surface-variant truncate font-medium">
                {user?.role || 'Quản trị viên VietTour'}
              </p>
            </div>
          </Link>
          <button 
            onClick={handleLogout} 
            className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg transition-colors"
            title="Đăng xuất"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
