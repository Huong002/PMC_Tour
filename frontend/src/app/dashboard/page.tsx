'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthGuard } from '../../components/layout/AuthGuard';
import { Sidebar } from '../../components/layout/Sidebar';
import { AdminHeader } from '../../components/layout/AdminHeader';

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState([
    { id: 1, name: 'An Nguyen', avatar: 'AN', tour: 'Ha Long Bay Luxury Cruise', date: 'Oct 12, 2024', status: 'Pending', badgeClass: 'bg-primary/10 text-primary border-primary/20' },
    { id: 2, name: 'Binh Tran', avatar: 'BT', tour: 'Sapa Mountain Trekking', date: 'Oct 14, 2024', status: 'Pending', badgeClass: 'bg-primary/10 text-primary border-primary/20' },
    { id: 3, name: 'Minh Le', avatar: 'ML', tour: 'Da Nang Marble Mountains', date: 'Oct 15, 2024', status: 'Pending', badgeClass: 'bg-primary/10 text-primary border-primary/20' },
    { id: 4, name: 'Vu Pham', avatar: 'VP', tour: 'Hue Imperial City Tour', date: 'Oct 16, 2024', status: 'Pending', badgeClass: 'bg-primary/10 text-primary border-primary/20' }
  ]);

  const handleApprove = (id: number) => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        return { ...req, status: 'Approved', badgeClass: 'bg-tertiary/10 text-tertiary border-tertiary/20' };
      }
      return req;
    }));
  };

  const handleReject = (id: number) => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        return { ...req, status: 'Rejected', badgeClass: 'bg-error/10 text-error border-error/20' };
      }
      return req;
    }));
  };

  const filteredRequests = requests.filter(req => 
    req.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    req.tour.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AuthGuard allowedRoles={['ADMIN', 'STAFF']}>
      <div className="bg-surface text-on-surface font-body-md min-h-screen flex">
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 ml-64 p-margin-desktop bg-surface min-h-screen">
          {/* Header Component */}
          <AdminHeader
            title="Staff Dashboard"
            description="Welcome back. Here's an overview of VietTour's metrics today."
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search requests..."
          />

          {/* Stats Bento Grid */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-xl">
            {/* New Bookings */}
            <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  <span className="material-symbols-outlined">confirmation_number</span>
                </div>
                <span className="text-xs font-bold text-tertiary">+12% vs last week</span>
              </div>
              <div className="mt-md text-left">
                <p className="font-label-md text-label-md text-on-surface-variant mb-1">New Bookings</p>
                <p className="font-headline-md text-headline-md text-primary font-bold">254</p>
              </div>
            </div>

            {/* Total Tours */}
            <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
                  <span className="material-symbols-outlined">map</span>
                </div>
                <span className="text-xs font-bold text-on-surface-variant">Active Portfolios</span>
              </div>
              <div className="mt-md text-left">
                <p className="font-label-md text-label-md text-on-surface-variant mb-1">Total Tours</p>
                <p className="font-headline-md text-headline-md text-secondary font-bold">48</p>
              </div>
            </div>

            {/* Revenue */}
            <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-tertiary/10 rounded-lg text-tertiary">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <span className="text-xs font-bold text-tertiary">+8% this month</span>
              </div>
              <div className="mt-md text-left">
                <p className="font-label-md text-label-md text-on-surface-variant mb-1">Revenue (USD)</p>
                <p className="font-headline-md text-headline-md text-primary font-bold">$128,450</p>
              </div>
            </div>

            {/* Pending Requests */}
            <div className="bg-primary-fixed/30 p-lg rounded-xl custom-shadow border border-primary/20 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-primary rounded-lg text-on-primary">
                  <span className="material-symbols-outlined">pending_actions</span>
                </div>
                <span className="text-xs font-bold text-primary">Priority Attention</span>
              </div>
              <div className="mt-md text-left">
                <p className="font-label-md text-label-md text-primary font-bold mb-1">Pending Requests</p>
                <p className="font-headline-md text-headline-md text-on-surface font-bold">18</p>
              </div>
            </div>
          </section>

          {/* Requests Section */}
          <section className="bg-white rounded-xl custom-shadow border border-outline-variant/30 overflow-hidden mb-xl">
            <div className="p-lg border-b border-outline-variant/50 flex flex-col md:flex-row md:items-center justify-between gap-md text-left">
              <h3 className="font-title-lg text-title-lg text-on-surface font-bold">Pending Registration Requests</h3>
              <button className="flex items-center gap-xs px-md py-2 border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-colors active:scale-95">
                <span className="material-symbols-outlined">filter_list</span>
                Filter
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low border-b border-outline-variant/50">
                  <tr>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Customer Name</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Tour</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((req) => {
                      const isPending = req.status === 'Pending';
                      return (
                        <tr key={req.id} className="hover:bg-surface-container-lowest transition-all hover:translate-x-1 duration-200">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-md">
                              <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed font-bold text-xs">
                                {req.avatar}
                              </div>
                              <span className="font-body-md text-sm font-semibold text-on-surface">{req.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-on-surface-variant font-medium">{req.tour}</td>
                          <td className="px-6 py-4 text-sm text-on-surface-variant font-medium">{req.date}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${req.badgeClass}`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-sm">
                              {isPending ? (
                                <>
                                  <button
                                    onClick={() => handleApprove(req.id)}
                                    className="bg-primary hover:bg-primary-container text-white font-label-sm text-[11px] font-bold px-lg py-2 rounded-lg transition-all active:scale-95 shadow-sm"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleReject(req.id)}
                                    className="border border-outline-variant/65 text-on-surface-variant hover:text-white hover:bg-error font-label-sm text-[11px] font-bold px-lg py-2 rounded-lg transition-all active:scale-95"
                                  >
                                    Reject
                                  </button>
                                </>
                              ) : (
                                <span className="text-xs text-on-surface-variant italic font-semibold">Processed</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-on-surface-variant">
                        No pending requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-lg bg-surface-container-low border-t border-outline-variant/50 flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant">
                Showing {filteredRequests.length} of {requests.length} pending requests
              </span>
              <div className="flex gap-sm">
                <button className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:cursor-not-allowed" disabled>
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-bold text-label-sm">1</button>
                <button className="w-8 h-8 rounded-lg text-on-surface-variant font-bold text-label-sm hover:bg-surface-container-low">2</button>
                <button className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </section>

          {/* Dynamic Insights Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter text-left">
            {/* Booking Trends Chart Card */}
            <div className="md:col-span-2 bg-white border border-outline-variant/30 p-lg rounded-xl custom-shadow">
              <div className="flex items-center justify-between mb-lg">
                <h3 className="font-title-lg text-title-lg text-on-surface font-bold">Booking Trends</h3>
                <div className="flex gap-sm">
                  <span className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant font-medium">
                    <span className="w-3 h-3 rounded-full bg-primary"></span> Luxury
                  </span>
                  <span className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant font-medium">
                    <span className="w-3 h-3 rounded-full bg-secondary"></span> Eco-tour
                  </span>
                </div>
              </div>
              
              <div className="h-48 w-full relative flex items-end gap-md pb-md">
                {/* Fake Chart Bars with light mode styling */}
                <div className="flex-grow bg-surface-container rounded-t-lg h-24 hover:h-28 transition-all duration-300 relative group cursor-pointer">
                  <div className="absolute inset-0 bg-primary/40 rounded-t-lg"></div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-surface text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold">84</div>
                </div>
                <div className="flex-grow bg-surface-container rounded-t-lg h-32 hover:h-36 transition-all duration-300 relative group cursor-pointer">
                  <div className="absolute inset-0 bg-primary/40 rounded-t-lg"></div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-surface text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold">112</div>
                </div>
                <div className="flex-grow bg-surface-container rounded-t-lg h-40 hover:h-44 transition-all duration-300 relative group cursor-pointer">
                  <div className="absolute inset-0 bg-primary rounded-t-lg shadow-sm"></div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-surface text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold">156</div>
                </div>
                <div className="flex-grow bg-surface-container rounded-t-lg h-28 hover:h-32 transition-all duration-300 relative group cursor-pointer">
                  <div className="absolute inset-0 bg-secondary/40 rounded-t-lg"></div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-surface text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold">98</div>
                </div>
                <div className="flex-grow bg-surface-container rounded-t-lg h-36 hover:h-40 transition-all duration-300 relative group cursor-pointer">
                  <div className="absolute inset-0 bg-primary/40 rounded-t-lg"></div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-surface text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold">124</div>
                </div>
              </div>
              <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant pt-2 border-t border-outline-variant font-bold uppercase tracking-wider">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
              </div>
            </div>

            {/* Staff Tip Card */}
            <div className="bg-primary-container text-on-primary-container p-lg rounded-xl shadow-glass flex flex-col justify-between overflow-hidden relative">
              <div className="z-10">
                <h3 className="font-title-lg text-title-lg text-white mb-sm font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined">tips_and_updates</span>
                  Staff Tip
                </h3>
                <p className="font-body-md text-body-md text-white/90 leading-relaxed">
                  Remember to prioritize pending requests with tour dates less than 48 hours away to ensure optimal guest fulfillment.
                </p>
              </div>
              <button className="mt-lg z-10 w-fit bg-surface-container-lowest text-primary font-bold px-lg py-2.5 rounded-lg shadow-md hover:scale-105 transition-transform active:scale-95 text-xs">
                View Guidelines
              </button>
              <div className="absolute -bottom-10 -right-10 opacity-20 transform rotate-12 text-white">
                <span className="material-symbols-outlined text-[120px]">lightbulb</span>
              </div>
            </div>
          </section>

          {/* Footer Area */}
          <footer className="mt-xl border-t border-outline-variant/50 pt-lg pb-md flex flex-col sm:flex-row justify-between items-center gap-md text-on-surface-variant text-xs">
            <span className="font-medium">© 2024 VietTour. All rights reserved. Professional Staff Portal.</span>
            <div className="flex gap-lg font-bold">
              <Link className="hover:text-primary transition-colors" href="/contact">Help Center</Link>
              <Link className="hover:text-primary transition-colors" href="/dashboard">System Status</Link>
            </div>
          </footer>
        </main>
      </div>
    </AuthGuard>
  );
}
