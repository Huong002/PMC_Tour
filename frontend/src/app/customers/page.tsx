'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthGuard } from '../../components/layout/AuthGuard';
import { Sidebar } from '../../components/layout/Sidebar';
import { AdminHeader } from '../../components/layout/AdminHeader';

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [usersList, setUsersList] = useState([
    { id: 1, code: 'USR-001', name: 'Minh Nguyen', email: 'minh.nguyen@viettour.com', role: 'ADMIN', status: 'Active', badgeClass: 'bg-tertiary/10 text-tertiary border-tertiary/20' },
    { id: 2, code: 'USR-002', name: 'Lan Tran', email: 'lan.tran@viettour.com', role: 'STAFF', status: 'Active', badgeClass: 'bg-tertiary/10 text-tertiary border-tertiary/20' },
    { id: 3, code: 'USR-003', name: 'An Nguyen', email: 'an.nguyen@gmail.com', role: 'CUSTOMER', status: 'Active', badgeClass: 'bg-tertiary/10 text-tertiary border-tertiary/20' },
    { id: 4, code: 'USR-004', name: 'Binh Tran', email: 'binh.tran@gmail.com', role: 'CUSTOMER', status: 'Banned', badgeClass: 'bg-error/10 text-error border-error/20' },
    { id: 5, code: 'USR-005', name: 'Minh Le', email: 'minh.le@gmail.com', role: 'CUSTOMER', status: 'Active', badgeClass: 'bg-tertiary/10 text-tertiary border-tertiary/20' }
  ]);

  const toggleStatus = (id: number) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === id) {
        const newStatus = u.status === 'Active' ? 'Banned' : 'Active';
        const newBadge = newStatus === 'Active' ? 'bg-tertiary/10 text-tertiary border-tertiary/20' : 'bg-error/10 text-error border-error/20';
        return { ...u, status: newStatus, badgeClass: newBadge };
      }
      return u;
    }));
  };

  const filteredUsers = usersList.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()) || u.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <AuthGuard allowedRoles={['ADMIN']}>
      <div className="bg-surface text-on-surface font-body-md min-h-screen flex">
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Canvas Area */}
        <main className="flex-1 ml-64 p-margin-desktop bg-surface min-h-screen">
          {/* Header Section */}
          <AdminHeader
            title="User Management"
            description="Monitor user accounts, roles, and system access status."
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search name, email, ID..."
          />

          {/* Stats Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-xl">
            <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 text-left">
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">Total Users</p>
              <p className="font-headline-md text-headline-md text-primary font-semibold">1,250</p>
            </div>
            <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 text-left">
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">Administrators</p>
              <p className="font-headline-md text-headline-md text-primary font-semibold">3</p>
            </div>
            <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 text-left">
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">Staff Members</p>
              <p className="font-headline-md text-headline-md text-secondary font-semibold">12</p>
            </div>
            <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 text-left">
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">Registered Customers</p>
              <p className="font-headline-md text-headline-md text-primary font-semibold">1,235</p>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl custom-shadow border border-outline-variant/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low border-b border-outline-variant/50">
                  <tr>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">User ID</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-surface-container-lowest transition-all hover:translate-x-1 duration-200">
                        <td className="px-6 py-4 font-mono text-label-md text-on-surface-variant">{u.code}</td>
                        <td className="px-6 py-4 font-bold text-primary">{u.name}</td>
                        <td className="px-6 py-4 text-on-surface-variant">{u.email}</td>
                        <td className="px-6 py-4 font-semibold text-label-sm">{u.role}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${u.badgeClass}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/customers/${u.id}`} className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-primary/5 rounded-lg" title="View Detail">
                              <span className="material-symbols-outlined">visibility</span>
                            </Link>
                            <button
                              onClick={() => toggleStatus(u.id)}
                              className={`p-2 rounded-lg transition-colors hover:bg-surface-container ${
                                u.status === 'Active' ? 'text-error hover:text-error/85' : 'text-tertiary hover:text-tertiary/85'
                              }`}
                              title={u.status === 'Active' ? 'Ban User' : 'Activate User'}
                            >
                              <span className="material-symbols-outlined">
                                {u.status === 'Active' ? 'block' : 'check_circle'}
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-on-surface-variant">
                        No users found matching filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-outline-variant/50 flex items-center justify-between">
              <p className="font-label-sm text-label-sm text-on-surface-variant">Showing {filteredUsers.length} of {usersList.length} users</p>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:cursor-not-allowed" disabled>
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-bold text-label-sm">1</button>
                <button className="w-8 h-8 rounded-lg text-on-surface-variant font-bold text-label-sm hover:bg-surface-container-low">2</button>
                <button className="w-8 h-8 rounded-lg text-on-surface-variant font-bold text-label-sm hover:bg-surface-container-low">3</button>
                <span className="text-on-surface-variant px-2">...</span>
                <button className="w-8 h-8 rounded-lg text-on-surface-variant font-bold text-label-sm hover:bg-surface-container-low">50</button>
                <button className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="mt-lg flex flex-wrap gap-md text-left">
            <span className="text-on-surface-variant font-label-md self-center mr-2">Filter Role:</span>
            <button
              onClick={() => setRoleFilter('ALL')}
              className={`px-4 py-1 rounded-full text-label-sm font-medium border border-outline-variant/50 transition-all ${
                roleFilter === 'ALL' ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-highest/50 hover:bg-primary-container hover:text-on-primary-container text-on-surface'
              }`}
            >
              All Roles
            </button>
            <button
              onClick={() => setRoleFilter('ADMIN')}
              className={`px-4 py-1 rounded-full text-label-sm font-medium border border-outline-variant/50 transition-all ${
                roleFilter === 'ADMIN' ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-highest/50 hover:bg-primary-container hover:text-on-primary-container text-on-surface'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => setRoleFilter('STAFF')}
              className={`px-4 py-1 rounded-full text-label-sm font-medium border border-outline-variant/50 transition-all ${
                roleFilter === 'STAFF' ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-highest/50 hover:bg-primary-container hover:text-on-primary-container text-on-surface'
              }`}
            >
              Staff
            </button>
            <button
              onClick={() => setRoleFilter('CUSTOMER')}
              className={`px-4 py-1 rounded-full text-label-sm font-medium border border-outline-variant/50 transition-all ${
                roleFilter === 'CUSTOMER' ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-highest/50 hover:bg-primary-container hover:text-on-primary-container text-on-surface'
              }`}
            >
              Customer
            </button>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
