import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between">
      <div className="text-gray-700">Chào mừng, {user?.fullName || 'Khách'}</div>
      {user && (
        <button onClick={() => logout()} className="text-sm text-red-600 hover:text-red-800">
          Đăng xuất
        </button>
      )}
    </header>
  );
}
