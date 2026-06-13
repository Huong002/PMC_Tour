'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation } from '@tanstack/react-query';
import { bookingService } from '../../../services/registration.service';
import { customerService } from '../../../services/customer.service';
import { useAuth } from '../../../hooks/useAuth';
import { Navbar } from '../../../components/layout/Navbar';
import api from '../../../services/api';

export default function TourDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const tourId = Number(id);

  const [scrolled, setScrolled] = useState(false);
  const [travelers, setTravelers] = useState(2);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const { data: apiResponse, isLoading: isTourLoading } = useQuery({
    queryKey: ['tour', tourId],
    queryFn: async () => {
      const res = await api.get('/Tours/' + tourId);
      return res.data?.data;
    },
    enabled: !isNaN(tourId),
    retry: false,
  });

  const { data: reviews } = useQuery({
    queryKey: ['tourReviews', tourId],
    queryFn: async () => {
      const res = await api.get('/Reviews/tour/' + tourId);
      return res.data?.data || [];
    },
    enabled: !isNaN(tourId),
  });

  const defaultTour = {
    id: tourId,
    title: 'Tour',
    location: 'Việt Nam',
    price: 0,
    description: '',
    duration: '—',
    maxParticipants: 0,
    image: '',
    durationDays: 0, durationNights: 0,
    included: 'Hướng dẫn viên chuyên nghiệp, Tất cả bữa ăn',
    excluded: 'Chi phí cá nhân, Tiền tip',
    itinerary: [] as { title: string; description: string }[],
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const incrementTravelers = () => setTravelers((prev) => prev + 1);
  const decrementTravelers = () => setTravelers((prev) => (prev > 1 ? prev - 1 : 1));

  const t = apiResponse || defaultTour;
  const tourDetail = {
    id: t.id,
    title: t.name || t.title,
    location: t.location,
    price: t.priceAdult ?? t.price,
    description: t.description,
    maxParticipants: t.maxPeople ?? t.maxParticipants,
    duration: t.duration
      ? t.duration
      : `${t.durationDays || 0} Ngày ${t.durationNights || 0} Đêm`,
    image: t.images?.[0]?.imageUrl || t.image || 'https://via.placeholder.com/800x400?text=VietTour',
    itinerary: (t.itineraries || t.itinerary || []).map((i: any) => ({
      title: i.title || `Ngày ${i.dayNumber || 0}`,
      desc: i.description || i.desc || '',
    })),
    included: t.included || t.includedStr || '',
    excluded: t.excluded || t.excludedStr || '',
  };

  const pricePerPerson = tourDetail.price;
  const serviceFeePercent = 0.05;
  const subtotal = travelers * pricePerPerson;
  const serviceFee = subtotal * serviceFeePercent;
  const totalPrice = subtotal + serviceFee;

  // Kiểm tra trạng thái tour
  const isActive = t.isActive ?? true;
  const registeredCount = t.registeredCount ?? 0;
  const maxPeople = tourDetail.maxParticipants || 0;
  const isFull = maxPeople > 0 && registeredCount >= maxPeople;
  const canBook = isActive && !isFull;
  const availableSlots = Math.max(0, maxPeople - registeredCount);

  const bookMutation = useMutation({
    mutationFn: async () => {
      const customerRes = await customerService.getCurrent();
      const customerId = customerRes.data.id;

      const durationDays = t.durationDays || 7;
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + durationDays);

      return bookingService.create({
        customerId,
        tourId: tourDetail.id,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        numAdults: travelers,
        numChildren: 0,
      });
    },
    onSuccess: () => {
      setBookingStatus('success');
      setTimeout(() => {
        router.push('/registrations/my');
      }, 1500);
    },
    onError: (err: any) => {
      setBookingStatus('error');
      const msg = err?.response?.data?.message || err?.response?.data?.errors?.[0] || 'Đã xảy ra lỗi khi đặt tour! Vui lòng thử lại.';
      setErrorMessage(msg);
      setTimeout(() => setBookingStatus('idle'), 4000);
    }
  });

  const handleBookNow = () => {
    if (!user) {
      router.push(`/login?redirect=/tours/${tourId}`);
      return;
    }
    setBookingStatus('loading');
    bookMutation.mutate();
  };

  if (isTourLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center">
        <span className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></span>
        <p className="font-body-md text-on-surface-variant font-medium">Đang tải thông tin tour...</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col justify-between">
      {/* TopNavBar - Shared Component */}
      <Navbar />

      <main className="w-full max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop pt-lg flex-grow">
        {/* Hero Section */}
        <section className="relative rounded-xl overflow-hidden h-[400px] md:h-[600px] mb-xl shadow-custom">
          <img 
            className="w-full h-full object-cover" 
            alt={tourDetail.title} 
            src={tourDetail.image}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-xl">
            <div className="flex flex-wrap gap-sm mb-md">
              <span className="bg-tertiary/20 backdrop-blur-md text-tertiary-fixed font-label-sm text-label-sm px-3 py-1 rounded-full border border-tertiary-fixed/30">{tourDetail.duration}</span>
              <span className="bg-secondary/20 backdrop-blur-md text-secondary-fixed font-label-sm text-label-sm px-3 py-1 rounded-full border border-secondary-fixed/30">Trải nghiệm Sang trọng</span>
              <span className="bg-primary-container/40 backdrop-blur-md text-white font-label-sm text-label-sm px-3 py-1 rounded-full border border-white/20">Bán chạy nhất</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg md:text-display-lg font-bold text-white mb-sm">{tourDetail.title}</h1>
            <p className="text-white/90 font-body-lg text-body-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-fixed">location_on</span>
              {tourDetail.location}
            </p>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-xl relative justify-between items-start">
          {/* Left Column: Content */}
          <div className="w-full lg:w-[64%] space-y-xl">
            {/* Overview */}
            <section className="bg-surface-container-lowest rounded-xl p-xl shadow-custom border border-outline-variant" id="overview">
              <h2 className="font-headline-md text-headline-md mb-md text-primary font-bold">Tổng quan</h2>
              <p className="text-on-surface-variant font-body-md leading-relaxed">
                {tourDetail.description}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-md mt-xl">
                <div className="flex flex-col items-center p-md bg-surface rounded-lg">
                  <span className="material-symbols-outlined text-primary mb-2">schedule</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Thời gian</span>
                  <span className="font-label-md text-label-md font-bold">{tourDetail.duration}</span>
                </div>
                <div className="flex flex-col items-center p-md bg-surface rounded-lg">
                  <span className="material-symbols-outlined text-primary mb-2">group</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Số khách tối đa</span>
                  <span className="font-label-md text-label-md font-bold">{tourDetail.maxParticipants} Khách</span>
                </div>
                <div className="flex flex-col items-center p-md bg-surface rounded-lg">
                  <span className="material-symbols-outlined text-primary mb-2">translate</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Ngôn ngữ</span>
                  <span className="font-label-md text-label-md font-bold">VN / EN</span>
                </div>
                <div className="flex flex-col items-center p-md bg-surface rounded-lg">
                  <span className="material-symbols-outlined text-primary mb-2">verified_user</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">An toàn</span>
                  <span className="font-label-md text-label-md font-bold">Đã kiểm định</span>
                </div>
              </div>
            </section>

            {/* Detailed Itinerary */}
            <section className="bg-white rounded-3xl p-xl shadow-soft border border-outline-variant/30 text-left" id="itinerary">
              <h2 className="font-headline-md text-headline-md mb-xl text-primary font-bold">Lịch trình chi tiết</h2>
              <div className="space-y-0 pl-xs">
                {tourDetail.itinerary.map((item: any, idx: number) => (
                  <div key={idx} className="itinerary-line relative pb-xl flex gap-lg">
                    {/* Glowing Neon Node */}
                    <div className="z-10 bg-primary/10 border border-primary neon-glow-primary w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1">
                      <span className="text-[10px] font-black text-primary">{idx + 1}</span>
                    </div>
                    <div className="pt-1">
                      <h3 className="font-title-lg text-title-lg text-primary mb-xs font-bold">{item.title}</h3>
                      <p className="text-on-surface-variant font-body-md text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Services */}
            <section className="bg-white rounded-3xl p-xl shadow-soft border border-outline-variant/30 text-left" id="services">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
                <div>
                  <h3 className="font-title-lg text-title-lg text-primary mb-md flex items-center gap-2 font-bold">
                    <span className="material-symbols-outlined text-tertiary">check_circle</span>
                    Dịch vụ bao gồm
                  </h3>
                  <ul className="space-y-sm text-on-surface-variant font-body-md text-sm">
                    {(tourDetail.included ? tourDetail.included.split(',').map((i: string) => i.trim()).filter(Boolean) : [
                      'Hướng dẫn viên tiếng Việt/Anh chuyên nghiệp',
                      'Tất cả bữa ăn theo lịch trình',
                      'Vé tham quan và vé vào cổng',
                      'Phòng nghỉ du thuyền/khách sạn sang trọng'
                    ]).map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2"><span className="material-symbols-outlined text-tertiary text-[18px]">check</span> {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-title-lg text-title-lg text-primary mb-md flex items-center gap-2 font-bold">
                    <span className="material-symbols-outlined text-error">cancel</span>
                    Dịch vụ không bao gồm
                  </h3>
                  <ul className="space-y-sm text-on-surface-variant font-body-md text-sm">
                    {(tourDetail.excluded ? tourDetail.excluded.split(',').map((i: string) => i.trim()).filter(Boolean) : [
                      'Chi phí cá nhân (giặt ủi, điện thoại)',
                      'Tiền tip cho hướng dẫn viên và tài xế',
                      'Bảo hiểm du lịch',
                      'Vé máy bay quốc tế'
                    ]).map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2"><span className="material-symbols-outlined text-error text-[18px]">close</span> {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Reviews */}
            <section className="bg-white rounded-3xl p-xl shadow-soft border border-outline-variant/30 text-left" id="reviews">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-xl gap-sm">
                <h2 className="font-headline-md text-headline-md text-primary font-bold">Đánh Gia Từ Khách Hàng</h2>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-headline-md">
                    {reviews?.length ? (reviews.reduce((s: any, r: any) => s + r.rating, 0) / reviews.length).toFixed(1) : '5.0'}
                  </span>
                  <span className="text-on-surface-variant font-label-md text-xs">({reviews?.length || 0} đánh giá)</span>
                </div>
              </div>
              <div className="space-y-lg">
                {(reviews?.length > 0 ? reviews : [
                  { customerName: 'Sarah Jenkins', rating: 5, comment: 'Một trải nghiệm hoàn toàn kỳ diệu. Nhân viên chu đáo, đồ ăn tinh tế, và thức dậy với những núi đá vôi tuyệt đẹp ngoài cửa sổ phòng là một giấc mơ trở thành hiện thực.', createdAt: new Date().toISOString() }
                ]).map((r: any, idx: number) => {
                  const initials = (r.customerName || '??').split(' ').map((s: string) => s[0]).join('').toUpperCase().slice(0, 2);
                  return (
                    <div key={idx} className="border-b border-outline-variant/30 pb-lg">
                      <div className="flex justify-between mb-sm">
                        <div className="flex items-center gap-md">
                          <div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-sm">{initials}</div>
                          <div>
                            <p className="font-bold text-sm">{r.customerName}</p>
                            <p className="text-[10px] text-on-surface-variant font-medium">
                              {r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex text-secondary">
                          {[1,2,3,4,5].map((s) => (
                            <span key={s} className="material-symbols-outlined text-xs" style={{ fontVariationSettings: s <= r.rating ? "'FILL' 1" : '' }}>star</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-on-surface-variant font-body-md text-sm italic leading-relaxed">"{r.comment}"</p>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Sidebar (Booking Card) */}
          <div className="w-full lg:w-[32%] relative">
            <div className="sticky top-24 space-y-md">
              <div className="glass-panel p-xl rounded-3xl border border-white/25 shadow-glass text-left">
                <div className="mb-lg border-b border-outline-variant/30 pb-md">
                  <p className="text-on-surface-variant text-[10px] uppercase font-extrabold tracking-wider">Giá khởi điểm từ</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-headline-lg font-black text-primary">{pricePerPerson.toLocaleString('vi-VN')}đ</span>
                    <span className="text-on-surface-variant text-xs font-semibold">/ khách</span>
                  </div>
                </div>
                
                <div className="space-y-md">
                  {/* Date Picker */}
                  <div className="space-y-xs">
                    <label className="text-primary font-bold text-xs uppercase tracking-wider block">Ngày khởi hành</label>
                    <div className="relative">
                      <input 
                        className="w-full bg-surface/50 border border-outline-variant/60 rounded-2xl p-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-semibold" 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Travelers Selector */}
                  <div className="space-y-xs">
                    <label className="text-primary font-bold text-xs uppercase tracking-wider block">Số lượng khách</label>
                    <div className="flex items-center justify-between bg-surface/50 border border-outline-variant/60 rounded-2xl p-1.5">
                      <button 
                        className="w-9 h-9 flex items-center justify-center hover:bg-surface-variant rounded-xl text-primary active:scale-90 transition-transform font-black text-lg" 
                        onClick={decrementTravelers} 
                        type="button"
                      >
                        -
                      </button>
                      <span className="font-extrabold text-on-surface">{travelers}</span>
                      <button 
                        className="w-9 h-9 flex items-center justify-center hover:bg-surface-variant rounded-xl text-primary active:scale-90 transition-transform font-black text-lg" 
                        onClick={incrementTravelers} 
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Pricing breakdown */}
                  <div className="bg-primary/5 rounded-2xl p-md space-y-sm text-sm">
                    <div className="flex justify-between text-on-surface-variant font-medium">
                      <span>{pricePerPerson.toLocaleString('vi-VN')}đ x {travelers} khách</span>
                      <span>{subtotal.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div className="flex justify-between text-on-surface-variant font-medium">
                      <span>Phí dịch vụ (5%)</span>
                      <span>{serviceFee.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-primary/10 pt-sm mt-xs">
                      <span className="font-bold text-on-surface">Tổng cộng</span>
                      <span className="text-headline-md font-black text-primary">{totalPrice.toLocaleString('vi-VN')}đ</span>
                    </div>
                  </div>

                  {bookingStatus === 'error' && (
                    <div className="p-sm bg-error/10 border border-error/20 text-error rounded-xl text-xs font-semibold text-center neon-glow-error">
                      {errorMessage}
                    </div>
                  )}

                  {/* Booking Button - kiểm tra isActive và isFull */}
                  {!canBook ? (
                    <div className={`w-full py-4 rounded-2xl flex flex-col items-center justify-center gap-1 font-bold text-sm ${
                      isFull
                        ? 'bg-error/10 border border-error/20 text-error'
                        : 'bg-outline-variant/20 border border-outline-variant text-on-surface-variant'
                    }`}>
                      <span className="material-symbols-outlined text-[24px]">
                        {isFull ? 'group_off' : 'lock'}
                      </span>
                      <span>{isFull ? 'Đã đủ số lượng khách' : 'Tour đang đóng đăng ký'}</span>
                      {isFull && maxPeople > 0 && (
                        <span className="text-xs font-normal text-error/80">
                          Đã đăng ký: {registeredCount}/{maxPeople} chỗ
                        </span>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={handleBookNow}
                      disabled={bookingStatus === 'loading' || bookingStatus === 'success'}
                      className={`w-full font-bold py-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 active:scale-95 transition-bounce flex items-center justify-center gap-2 text-white ${
                        bookingStatus === 'success'
                          ? 'bg-tertiary neon-glow-tertiary'
                          : bookingStatus === 'error'
                          ? 'bg-error neon-glow-error'
                          : 'bg-secondary hover:bg-secondary-container shadow-natural'
                      }`}
                      type="button"
                    >
                      {bookingStatus === 'loading' ? (
                        <>
                          <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          <span>Đang đặt tour...</span>
                        </>
                      ) : bookingStatus === 'success' ? (
                        <>
                          <span className="material-symbols-outlined">check_circle</span>
                          <span>Đặt thành công!</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined">bolt</span>
                          <span>Đặt ngay</span>
                          {availableSlots > 0 && availableSlots <= 5 && (
                            <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">
                              Còn {availableSlots} chỗ
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  )}
                  <p className="text-center text-on-surface-variant text-[10px] italic">Chưa tính phí thanh toán</p>
                </div>

                <div className="mt-lg pt-lg border-t border-outline-variant/30 flex flex-col gap-md">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-tertiary">verified</span>
                    <span className="font-label-md text-on-surface-variant text-sm font-medium">Hủy miễn phí trước 48 giờ</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-tertiary">headset_mic</span>
                    <span className="font-label-md text-on-surface-variant text-sm font-medium">Hỗ trợ 24/7 luôn sẵn sàng</span>
                  </div>
                </div>
              </div>

              {/* Contact Expert Card */}
              <div className="bg-primary-container text-on-primary-container p-lg rounded-3xl flex items-center justify-between text-left">
                <div>
                  <p className="font-bold text-white text-sm">Cần hỗ trợ đặt tour?</p>
                  <p className="text-xs text-white/80">Trò chuyện với chuyên gia bản địa</p>
                </div>
                <button className="bg-white/20 hover:bg-white/30 p-2.5 rounded-full transition-bounce text-white active:scale-95">
                  <span className="material-symbols-outlined">call</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Tours Section */}
        <section className="mt-xl pt-xl border-t border-outline-variant mb-xl text-left">
          <div className="flex justify-between items-end mb-xl">
            <div>
              <h2 className="font-headline-md text-headline-md text-primary font-bold">Chuyến đi tương tự</h2>
              <p className="text-on-surface-variant font-body-md">Những tour du lịch được nhiều khách hàng yêu thích</p>
            </div>
            <Link href="/tours" className="text-primary font-bold flex items-center gap-1 hover:underline active:scale-95 transition-transform">
              Xem tất cả
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
            {/* Related Tour 1 */}
            <div className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-custom border border-outline-variant transition-transform hover:-translate-y-2 duration-300">
              <div className="h-48 overflow-hidden relative">
                <img 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  alt="Hà Giang Loop" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCw31B29BQiu-WFQ75W9Fo34Fq6que1RDarubVXF7ClsszWHZWckQmq1_T-wtoROox-5EePZpboEncve7Ldvvu2OCcI9VieJIVhKWGIpwAl_L4Szc13wnwT7-ZjZdMnwUO6oqAl8KxXjHmk8qMgfyDz9Aoe1akFO36SbSezra_ndj-R-NQIA2xjd2WlVlxhdaI3WxuZ97GZbTWhk_Chr9sD60qXpn8VeiOYez5-3nMG3-ZMNT5_2w8_KIwC0OqvYIyizGV5hRhc3BQ"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-primary font-bold text-[12px]">HÀ GIANG</div>
              </div>
              <div className="p-md">
                <h3 className="font-title-lg text-title-lg mb-xs group-hover:text-primary transition-colors font-semibold">Khám phá Vòng cung Hà Giang</h3>
                <div className="flex items-center gap-1 text-secondary-container mb-md">
                  <span className="material-symbols-outlined text-[16px] text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-bold text-xs text-on-surface">4.8</span>
                  <span className="text-xs text-on-surface-variant ml-1">(92 đánh giá)</span>
                </div>
                <div className="flex justify-between items-center border-t border-outline-variant pt-md">
                  <span className="font-label-md text-on-surface-variant text-sm">4 Ngày</span>
                  <span className="font-bold text-primary text-sm">7.900.000đ</span>
                </div>
              </div>
            </div>

            {/* Related Tour 2 */}
            <div className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-custom border border-outline-variant transition-transform hover:-translate-y-2 duration-300">
              <div className="h-48 overflow-hidden relative">
                <img 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  alt="Hội An ancient town" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXu2BWHLkLgKrBVdux3vw_5YWjmtOMA8TprVIALYDQNdUg8u2tvPHDBcr8wo_SnSihIhtd7ObU6XTMDljHAak2vqeJWU7m5bbmlyb5cwXNmNmfBRXAfbifWnbWBn2MBmPVhQUFsSF2iBmlcwF_yY1hhZlpqoj8ee3S1Oe8aRklPf3Xsi5s4DVZ72FSCNXmJwa1XbobWuGR4f7Z1ud0IKt28S8f7UJOAnMk2RA4amYT0mu0ReaYLiBaTF7jHh_x0j_P0y6MXGVkVwc1c"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-primary font-bold text-[12px]">HỘI AN</div>
              </div>
              <div className="p-md">
                <h3 className="font-title-lg text-title-lg mb-xs group-hover:text-primary transition-colors font-semibold">Văn hóa Phố cổ Hội An</h3>
                <div className="flex items-center gap-1 text-secondary-container mb-md">
                  <span className="material-symbols-outlined text-[16px] text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-bold text-xs text-on-surface">5.0</span>
                  <span className="text-xs text-on-surface-variant ml-1">(215 đánh giá)</span>
                </div>
                <div className="flex justify-between items-center border-t border-outline-variant pt-md">
                  <span className="font-label-md text-on-surface-variant text-sm">3 Ngày</span>
                  <span className="font-bold text-primary text-sm">6.900.000đ</span>
                </div>
              </div>
            </div>

            {/* Related Tour 3 */}
            <div className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-custom border border-outline-variant transition-transform hover:-translate-y-2 duration-300">
              <div className="h-48 overflow-hidden relative">
                <img 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  alt="Tràng An Ninh Bình" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcV9rq3xqVY9BNbREoZmXT4Ooh54folb-k0IVqD8Xa80RoMcbsvaTH1tMSaYj1smq6BOw7VCALXYeT1YRuXuZCs1YJIGeHM-W2GHsjeF4Yl0GQOBy2do1LzbeCvnpUz8TlnAcUzyY9RI_3WHARL--TB50TJYbOeJ2arHE-ybqcW2az_AL5e-OK4MJtLCh76g-GFJ1JWoRGx27mIep2bjSVMXyZ79Pq-kmo3oFBv3NV3bmHsAkff3tqRSJ_oKYJbYVRv7iHpdry_AY"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-primary font-bold text-[12px]">NINH BÌNH</div>
              </div>
              <div className="p-md">
                <h3 className="font-title-lg text-title-lg mb-xs group-hover:text-primary transition-colors font-semibold">Hành trình Tràng An & Hang động</h3>
                <div className="flex items-center gap-1 text-secondary-container mb-md">
                  <span className="material-symbols-outlined text-[16px] text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-bold text-xs text-on-surface">4.7</span>
                  <span className="text-xs text-on-surface-variant ml-1">(58 đánh giá)</span>
                </div>
                <div className="flex justify-between items-center border-t border-outline-variant pt-md">
                  <span className="font-label-md text-on-surface-variant text-sm">1 Ngày</span>
                  <span className="font-bold text-primary text-sm">2.500.000đ</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-inverse-surface dark:bg-surface-container-lowest text-white dark:text-primary full-width bottom-0 mt-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop py-xl w-full max-w-max-width mx-auto text-left">
          <div className="col-span-1 md:col-span-1">
            <span className="font-headline-md text-headline-md text-surface-bright font-bold mb-md block">VietTour</span>
            <p className="font-body-md text-surface-variant dark:text-on-surface-variant leading-relaxed text-sm">
              Mang đến trải nghiệm du lịch Chuyên nghiệp, Lôi cuốn và Năng động khắp những danh lam thắng cảnh đẹp nhất Việt Nam.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-md font-label-md text-sm">Công ty</h4>
            <ul className="space-y-sm text-sm">
              <li><Link className="text-surface-variant dark:text-on-surface-variant font-label-sm hover:text-secondary-fixed-dim transition-colors" href="/about">Về chúng tôi</Link></li>
              <li><Link className="text-surface-variant dark:text-on-surface-variant font-label-sm hover:text-secondary-fixed-dim transition-colors" href="/contact">Liên hệ</Link></li>
              <li><Link className="text-surface-variant dark:text-on-surface-variant font-label-sm hover:text-secondary-fixed-dim transition-colors" href="/tours">Trung tâm trợ giúp</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-md font-label-md text-sm">Pháp lý</h4>
            <ul className="space-y-sm text-sm">
              <li><Link className="text-surface-variant dark:text-on-surface-variant font-label-sm hover:text-secondary-fixed-dim transition-colors" href="/tours">Điều khoản dịch vụ</Link></li>
              <li><Link className="text-surface-variant dark:text-on-surface-variant font-label-sm hover:text-secondary-fixed-dim transition-colors" href="/tours">Chính sách bảo mật</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-md font-label-md text-sm">Bản tin</h4>
            <p className="text-surface-variant dark:text-on-surface-variant font-label-sm mb-md text-sm">Nhận thông tin cập nhật và ưu đãi du lịch.</p>
            <div className="flex gap-2">
              <input 
                className="bg-surface/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm w-full focus:outline-none focus:border-secondary" 
                placeholder="Email" 
                type="email"
              />
              <button className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-bold active:scale-95 transition-transform">Đăng ký</button>
            </div>
          </div>
        </div>
        <div className="px-margin-desktop py-md border-t border-white/10 w-full max-w-max-width mx-auto">
          <p className="font-label-sm text-label-sm text-surface-variant text-center text-xs">© 2024 VietTour. Bảo lưu mọi quyền. Trải nghiệm du lịch Chuyên nghiệp, Lôi cuốn và Năng động.</p>
        </div>
      </footer>
    </div>
  );
}
