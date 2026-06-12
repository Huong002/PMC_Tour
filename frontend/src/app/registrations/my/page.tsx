'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from '../../../components/layout/AuthGuard';
import { useAuth } from '../../../hooks/useAuth';
import { Navbar } from '../../../components/layout/Navbar';
import api from '../../../services/api';

const STATUS_MAP: Record<number, { label: string; badgeClass: string }> = {
  0: { label: 'Chờ Duyệt',     badgeClass: 'bg-primary/10 text-primary border-primary/20' },
  1: { label: 'Đã Xác Nhận',   badgeClass: 'bg-secondary/10 text-secondary border-secondary/20' },
  2: { label: 'Đang Diễn Ra',  badgeClass: 'bg-secondary/10 text-secondary border-secondary/20' },
  3: { label: 'Hoàn Thành',     badgeClass: 'bg-tertiary/10 text-tertiary border-tertiary/20' },
  4: { label: 'Đã Hủy',        badgeClass: 'bg-error/10 text-error border-error/20' },
  5: { label: 'Hoàn Tiền',     badgeClass: 'bg-error/10 text-error border-error/20' },
};

export default function MyRegistrationsPage() {
  const { user } = useAuth();
  const [payingId, setPayingId] = useState<number | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  // Fetch current user's bookings
  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['myRegistrations', user?.userId],
    queryFn: async () => {
      const res = await api.get('/Bookings/my', { params: { PageSize: 50 } });
      return res.data?.data?.items || [];
    },
    enabled: !!user,
  });

  // Fetch tour images for display
  const { data: toursData } = useQuery({
    queryKey: ['allToursForImages'],
    queryFn: async () => {
      const res = await api.get('/Tours', { params: { PageSize: 50 } });
      const map: Record<number, string> = {};
      (res.data?.data?.items || []).forEach((t: any) => {
        if (t.id) map[t.id] = t.images?.[0]?.imageUrl || '';
      });
      return map;
    },
  });

  const tourImages: Record<number, string> = toursData || {};

  const bookings = (bookingsData || []).map((reg: any) => {
    const s = STATUS_MAP[reg.status] || STATUS_MAP[0];
    return {
      id: reg.id,
      code: reg.bookingCode || `REG-${reg.id}`,
      tourId: reg.tourId,
      tourName: reg.tourName || 'Tour',
      departureDate: reg.startDate
        ? new Date(reg.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '—',
      travelers: (reg.numAdults || 0) + (reg.numChildren || 0),
      totalPrice: reg.finalPrice || reg.totalPrice || 0,
      status: s.label,
      badgeClass: s.badgeClass,
      image: tourImages[reg.tourId] || ''
    };
  });

  return (
    <AuthGuard allowedRoles={['CUSTOMER', 'STAFF', 'ADMIN']}>
      <div className="bg-background text-on-surface font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col justify-between">
        <Navbar />

        <main className="flex-grow max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-xl w-full">
          <div className="mb-xl text-left">
            <span className="text-secondary font-bold text-label-sm uppercase tracking-widest block mb-xs">Customer Ledger</span>
            <h1 className="font-display-lg text-display-lg text-primary font-extrabold tracking-tight">My Bookings</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Track your registered adventure tours, invoices, and itineraries with ease.</p>
          </div>

          {isLoading ? (
            <div className="py-xl flex flex-col justify-center items-center">
              <span className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent mb-4"></span>
              <p className="text-on-surface-variant text-sm font-medium">Đang tải lịch sử đặt tour...</p>
            </div>
          ) : (
            <div className="space-y-md">
              {bookings.length > 0 ? (
                bookings.map((booking: any) => {
                  const isPaid = booking.status === 'Hoàn Thành';
                  const isPending = booking.status === 'Chờ Duyệt' || booking.status === 'Đã Xác Nhận';
                  
                  const neonClass = isPaid 
                    ? 'bg-emerald-500/5 text-emerald-600 border-emerald-500/20 neon-glow-tertiary' 
                    : isPending 
                    ? 'bg-amber-500/5 text-amber-600 border-amber-500/20 neon-glow-secondary' 
                    : 'bg-rose-500/5 text-rose-600 border-rose-500/20 neon-glow-error';

                  return (
                    <div key={booking.id} 
                      className="bg-white rounded-[2rem] p-lg border border-outline-variant/30 shadow-soft hover-lift flex flex-col lg:flex-row gap-lg justify-between items-stretch lg:items-center w-full animate-[fade-in_0.4s_ease-out]">
                      <div className="flex flex-col sm:flex-row gap-md items-start sm:items-center flex-1 text-left">
                        <div className="w-full sm:w-32 h-24 rounded-2xl overflow-hidden shrink-0">
                          {booking.image ? (
                            <img className="w-full h-full object-cover" alt={booking.tourName} src={booking.image} />
                          ) : (
                            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold">Tour</div>
                          )}
                        </div>
                        <div className="space-y-sm">
                          <div className="flex flex-wrap items-center gap-sm">
                            <button onClick={() => setSelectedInvoice(booking)}
                              className="font-mono text-xs text-primary hover:text-secondary hover:underline cursor-pointer flex items-center gap-1 font-bold">
                              <span className="material-symbols-outlined text-[14px]">receipt</span>
                              {booking.code}
                            </button>
                            <span className={`px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest border ${neonClass}`}>
                              {booking.status}
                            </span>
                          </div>
                          <h3 className="font-title-lg text-title-lg text-primary font-bold leading-snug line-clamp-1">{booking.tourName}</h3>
                          <div className="flex flex-wrap gap-x-lg gap-y-xs text-xs text-on-surface-variant font-medium">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm text-outline">calendar_month</span>
                              Khởi hành: <strong className="text-on-surface">{booking.departureDate}</strong>
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm text-outline">group</span>
                              Khách: <strong className="text-on-surface">{booking.travelers} KH</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t lg:border-t-0 pt-md lg:pt-0 border-outline-variant/30 flex flex-row lg:flex-col justify-between items-center lg:items-end gap-md shrink-0 text-left lg:text-right">
                        <div>
                          <span className="text-[10px] text-outline block uppercase tracking-wider font-semibold">Tổng Tiền</span>
                          <span className="font-extrabold text-headline-md text-primary">${booking.totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex gap-sm">
                          <Link href={`/tours/${booking.tourId}`}
                            className="px-md py-2 border border-outline-variant hover:bg-surface-variant/20 text-on-surface-variant font-bold text-xs rounded-2xl transition-smooth active:scale-95">
                            Chi Tiết
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-2xl text-center text-on-surface-variant bg-white rounded-3xl shadow-soft border border-outline-variant/30 max-w-2xl mx-auto">
                  <span className="material-symbols-outlined text-outline text-[64px] mb-md">receipt_long</span>
                  <p className="font-extrabold text-title-lg text-primary mb-1">Chưa Có Booking Nào</p>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-lg">Khám phá các điểm đến và đặt tour đầu tiên ngay hôm nay!</p>
                  <Link href="/tours" className="inline-block bg-primary hover:bg-primary-container text-white font-bold px-xl py-3 rounded-2xl transition-bounce shadow-md">
                    Khám Phá Tour
                  </Link>
                </div>
              )}
            </div>
          )}

          {selectedInvoice && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-md bg-black/40 backdrop-blur-md transition-opacity">
              <div className="bg-white rounded-3xl p-xl shadow-elevated border border-outline-variant/20 max-w-md w-full text-left space-y-lg relative animate-[subtle-zoom_0.4s_ease-out]">
                <button onClick={() => setSelectedInvoice(null)} 
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-variant transition-colors">
                  <span className="material-symbols-outlined text-outline">close</span>
                </button>
                <div className="text-center space-y-xs pb-md border-b border-dashed border-outline-variant">
                  <h4 className="font-headline-md text-primary font-bold tracking-tight">VIETTOUR RECEIPT</h4>
                  <p className="text-xs text-outline font-mono font-semibold">Hóa Đơn #{selectedInvoice.code}</p>
                  <p className="text-[10px] text-outline uppercase font-extrabold">KHỞI HÀNH: {selectedInvoice.departureDate}</p>
                </div>
                <div className="space-y-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm text-primary">{selectedInvoice.tourName}</p>
                      <p className="text-xs text-on-surface-variant font-semibold">{selectedInvoice.travelers} Khách</p>
                    </div>
                    <span className="font-bold text-sm text-primary">${(selectedInvoice.totalPrice / 1.05).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-on-surface-variant font-medium pt-sm border-t border-outline-variant/10">
                    <span>Phí Dịch Vụ (5%)</span>
                    <span>${(selectedInvoice.totalPrice - (selectedInvoice.totalPrice / 1.05)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold pt-md border-t border-dashed border-outline-variant">
                    <span className="text-primary font-extrabold uppercase text-xs">Tổng Cộng</span>
                    <span className="text-secondary text-lg font-black">${selectedInvoice.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <div className="p-sm rounded-xl bg-primary/5 text-center text-xs font-semibold text-primary flex items-center justify-center gap-xs">
                  <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
                  Trạng Thái: {selectedInvoice.status}
                </div>
                <div className="text-center text-[10px] text-outline italic pt-xs">
                  Cảm ơn bạn đã chọn VietTour. Chúc bạn có chuyến đi tuyệt vời!
                </div>
              </div>
            </div>
          )}
        </main>

        <footer className="bg-inverse-surface dark:bg-surface-container-lowest full-width bottom-0 mt-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop py-xl w-full max-w-max-width mx-auto text-left">
            <div className="space-y-md">
              <span className="font-headline-md text-headline-md text-surface-bright font-bold">VietTour</span>
              <p className="font-body-md text-surface-variant dark:text-on-surface-variant">© 2024 VietTour. All rights reserved.</p>
            </div>
            <div className="space-y-md">
              <h5 className="text-on-primary dark:text-primary font-bold">Explore</h5>
              <ul className="space-y-sm">
                <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/tours">Tours</Link></li>
                <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/tours">Destinations</Link></li>
              </ul>
            </div>
            <div className="space-y-md">
              <h5 className="text-on-primary dark:text-primary font-bold">Company</h5>
              <ul className="space-y-sm">
                <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/about">About Us</Link></li>
                <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="space-y-md">
              <h5 className="text-on-primary dark:text-primary font-bold">Support</h5>
              <ul className="space-y-sm">
                <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/contact">Help Center</Link></li>
                <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/tours">FAQs</Link></li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </AuthGuard>
  );
}
