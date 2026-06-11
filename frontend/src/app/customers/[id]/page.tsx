'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from '../../../components/layout/AuthGuard';
import { Sidebar } from '../../../components/layout/Sidebar';
import { AdminHeader } from '../../../components/layout/AdminHeader';
import { customerService } from '../../../services/customer.service';
import { UserDetailDto } from '../../../types/user';
import { StatusBadge } from '../../../components/ui/StatusBadge';

const MOCK_CUSTOMER: UserDetailDto = {
  id: 3,
  username: 'an.nguyen@gmail.com',
  fullName: 'An Nguyen',
  email: 'an.nguyen@gmail.com',
  phone: '0901234567',
  address: '123 Le Loi, District 1, HCMC',
  role: 'CUSTOMER',
  status: 'Active',
  createdAt: '2024-01-15T08:30:00Z',
  lastLoginAt: '2026-06-10T15:45:00Z',
  totalRegistrations: 4,
  approvedRegistrations: 2,
  completedRegistrations: 1,
  cancelledRegistrations: 1,
  totalSpent: 1274,
  recentRegistrations: [
    { id: 101, code: 'REG-101', tourTitle: 'Ha Long Bay Luxury Cruise', registeredAt: '2026-06-05T09:00:00Z', status: 'Approved', depositAmount: 200, totalAmount: 599 },
    { id: 102, code: 'REG-102', tourTitle: 'Sapa Highland Trekking', registeredAt: '2026-06-08T10:15:00Z', status: 'Pending', depositAmount: 0, totalAmount: 345 },
    { id: 103, code: 'REG-103', tourTitle: 'Da Lat Tea Hills Discovery', registeredAt: '2026-05-12T14:30:00Z', status: 'Completed', depositAmount: 210, totalAmount: 210 },
    { id: 104, code: 'REG-104', tourTitle: 'Hoi An Lantern Festival Night', registeredAt: '2026-04-10T11:00:00Z', status: 'Cancelled', depositAmount: 0, totalAmount: 120 }
  ],
  recentPayments: [
    { id: 501, amount: 200, status: 'Completed', paymentMethod: 'TRANSFER', paidAt: '2026-06-05T09:30:00Z' },
    { id: 502, amount: 210, status: 'Completed', paymentMethod: 'CARD', paidAt: '2026-05-12T14:45:00Z' }
  ]
};

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);
  const [activeTab, setActiveTab] = useState<'profile' | 'registrations' | 'payments'>('profile');

  // Query profile
  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerService.getById(id),
    enabled: !isNaN(id),
    retry: false,
  });

  const customerData: UserDetailDto = apiResponse?.data ?? MOCK_CUSTOMER;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center">
        <span className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></span>
        <p className="font-body-md text-on-surface-variant font-medium">Loading customer details...</p>
      </div>
    );
  }

  return (
    <AuthGuard allowedRoles={['ADMIN']}>
      <div className="bg-surface text-on-surface font-body-md min-h-screen flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Canvas Area */}
        <main className="flex-1 ml-64 p-margin-desktop bg-surface min-h-screen text-left">
          {/* Header Section */}
          <AdminHeader
            title={`Customer Profile: ${customerData.fullName}`}
            description={`Manage account stats and tracking for customer ID: USR-00${customerData.id}`}
            actionButton={
              <button 
                onClick={() => router.back()}
                className="bg-white hover:bg-surface-container border border-outline-variant/60 text-on-surface font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-soft"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Back
              </button>
            }
          />

          {/* Stats Summary Bento Grid */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-xl">
            <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30">
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">Total Spent</p>
              <p className="font-headline-md text-headline-md text-primary font-bold">${customerData.totalSpent}</p>
            </div>
            <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30">
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">Total Bookings</p>
              <p className="font-headline-md text-headline-md text-on-surface font-semibold">{customerData.totalRegistrations}</p>
            </div>
            <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30">
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">Completed Tours</p>
              <p className="font-headline-md text-headline-md text-tertiary font-semibold">{customerData.completedRegistrations}</p>
            </div>
            <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30">
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">Status</p>
              <div className="mt-1">
                <StatusBadge status={customerData.status} />
              </div>
            </div>
          </section>

          {/* Navigation Tabs */}
          <div className="border-b border-outline-variant/50 mb-lg flex gap-md">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-3 font-label-md text-label-md transition-all border-b-2 font-bold px-1 ${
                activeTab === 'profile'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-primary'
              }`}
            >
              Account Details
            </button>
            <button
              onClick={() => setActiveTab('registrations')}
              className={`pb-3 font-label-md text-label-md transition-all border-b-2 font-bold px-1 ${
                activeTab === 'registrations'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-primary'
              }`}
            >
              Booking History ({customerData.recentRegistrations?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`pb-3 font-label-md text-label-md transition-all border-b-2 font-bold px-1 ${
                activeTab === 'payments'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-primary'
              }`}
            >
              Payment Records ({customerData.recentPayments?.length || 0})
            </button>
          </div>

          {/* Tabs Content */}
          <div className="bg-white rounded-xl custom-shadow border border-outline-variant/30 p-lg">
            {activeTab === 'profile' && (
              <div className="space-y-lg">
                <h3 className="font-title-lg text-title-lg text-primary font-bold border-b border-outline-variant/40 pb-3">
                  Personal & Security Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg text-body-md">
                  <div className="space-y-1">
                    <span className="font-bold block text-on-surface-variant text-sm uppercase tracking-wider">Username / Email</span>
                    <span className="text-on-surface font-medium">{customerData.email}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold block text-on-surface-variant text-sm uppercase tracking-wider">Full Name</span>
                    <span className="text-on-surface font-medium">{customerData.fullName}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold block text-on-surface-variant text-sm uppercase tracking-wider">Phone Number</span>
                    <span className="text-on-surface font-medium">{customerData.phone || 'N/A'}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold block text-on-surface-variant text-sm uppercase tracking-wider">Address</span>
                    <span className="text-on-surface font-medium">{customerData.address || 'N/A'}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold block text-on-surface-variant text-sm uppercase tracking-wider">Created Date</span>
                    <span className="text-on-surface font-medium">{new Date(customerData.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold block text-on-surface-variant text-sm uppercase tracking-wider">Last Login At</span>
                    <span className="text-on-surface font-medium">
                      {customerData.lastLoginAt ? new Date(customerData.lastLoginAt).toLocaleString() : 'Never'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'registrations' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container-low border-b border-outline-variant/50">
                    <tr>
                      <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Booking ID</th>
                      <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Tour Title</th>
                      <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Booked Date</th>
                      <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {customerData.recentRegistrations && customerData.recentRegistrations.length > 0 ? (
                      customerData.recentRegistrations.map((reg: any) => {
                        let statusColor = 'bg-primary/10 text-primary border-primary/20';
                        if (reg.status === 'Completed') statusColor = 'bg-tertiary/10 text-tertiary border-tertiary/20';
                        else if (reg.status === 'Cancelled') statusColor = 'bg-error/10 text-error border-error/20';
                        else if (reg.status === 'Approved') statusColor = 'bg-primary-container/20 text-primary border-primary-container/30';

                        return (
                          <tr key={reg.id} className="hover:bg-surface-container-lowest transition-colors">
                            <td className="px-6 py-4 font-mono text-label-md font-bold text-on-surface-variant">{reg.code || `REG-${reg.id}`}</td>
                            <td className="px-6 py-4 font-bold text-primary">{reg.tourTitle}</td>
                            <td className="px-6 py-4 text-on-surface-variant text-sm font-semibold">{new Date(reg.registeredAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor}`}>
                                {reg.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-bold text-on-surface">${reg.totalAmount}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-on-surface-variant">
                          No bookings found for this customer.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container-low border-b border-outline-variant/50">
                    <tr>
                      <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Transaction ID</th>
                      <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Method</th>
                      <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Paid Date</th>
                      <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {customerData.recentPayments && customerData.recentPayments.length > 0 ? (
                      customerData.recentPayments.map((pay: any) => (
                        <tr key={pay.id} className="hover:bg-surface-container-lowest transition-colors">
                          <td className="px-6 py-4 font-mono text-label-md font-bold text-on-surface-variant">TXN-00{pay.id}</td>
                          <td className="px-6 py-4 font-semibold text-sm">{pay.paymentMethod}</td>
                          <td className="px-6 py-4 text-on-surface-variant text-sm font-semibold">{new Date(pay.paidAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full bg-tertiary/10 text-tertiary border-tertiary/20 text-[10px] font-bold uppercase tracking-wider border">
                              {pay.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-primary">${pay.amount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-on-surface-variant">
                          No transaction records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
