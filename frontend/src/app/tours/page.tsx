'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Navbar } from '../../components/layout/Navbar';
import api from '../../services/api';

type ApiTour = {
  id: number; name: string; slug: string; location: string;
  priceAdult: number; salePrice: number | null; shortDescription: string;
  durationDays: number; durationNights: number;
  images: { imageUrl: string }[];
};

type DisplayTour = {
  id: number; name: string; duration: string; rating: string;
  price: number; location: string; image: string; description: string;
};

function mapTour(t: ApiTour): DisplayTour {
  const ratings: Record<string, string> = {
    '1': '4.9 (120 đánh giá)', '2': '4.8 (85 đánh giá)', '3': '4.9 (92 đánh giá)',
    '4': '4.5 (33 đánh giá)', '5': '4.6 (47 đánh giá)', '6': '4.8 (92 đánh giá)',
    '7': '5.0 (58 đánh giá)', '8': '4.7 (58 đánh giá)',
  };
  
  // Format duration nicely in Vietnamese
  let durationStr = '';
  if (t.durationDays > 0 && t.durationNights > 0) {
    durationStr = `${t.durationDays} Ngày ${t.durationNights} Đêm`;
  } else if (t.durationDays > 0) {
    durationStr = `${t.durationDays} Ngày`;
  } else {
    durationStr = 'Liên hệ';
  }

  return {
    id: t.id,
    name: t.name,
    duration: durationStr,
    rating: ratings[t.id] || '4.9 (50 đánh giá)',
    price: t.salePrice ?? t.priceAdult,
    location: t.location.split(',')[0].trim() || t.location,
    image: t.images?.[0]?.imageUrl || '',
    description: t.shortDescription || '',
  };
}

export default function ToursPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [priceRange, setPriceRange] = useState('ALL');

  const { data: apiData, isLoading } = useQuery({
    queryKey: ['publicTours', searchTerm, selectedLocation, priceRange],
    queryFn: async () => {
      const params: Record<string, any> = { Page: 1, PageSize: 50 };
      if (searchTerm) params.SearchTerm = searchTerm;
      const res = await api.get('/Tours', { params });
      return (res.data?.data?.items || []) as ApiTour[];
    },
  });

  let tours: DisplayTour[] = [];
  if (apiData) {
    tours = apiData.map(mapTour).filter((t) => {
      if (selectedLocation !== 'ALL' && t.location !== selectedLocation) return false;
      if (priceRange === 'UNDER_200' && t.price >= 5000000) return false;
      if (priceRange === '200_500' && (t.price < 5000000 || t.price > 10000000)) return false;
      if (priceRange === 'OVER_500' && t.price <= 10000000) return false;
      return true;
    });
  }

  return (
    <div className="bg-surface text-on-surface font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-xl w-full">
        <div className="mb-xl text-left">
          <span className="text-secondary font-bold text-label-sm uppercase tracking-widest block mb-xs">Hành trình chọn lọc</span>
          <h1 className="font-display-lg text-display-lg text-primary font-extrabold tracking-tight">Khám phá vẻ đẹp Việt Nam</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Tìm và đặt trải nghiệm du lịch mơ ước tiếp theo của bạn, được thiết kế riêng mang lại sự thoải mái và trải nghiệm văn hóa sâu sắc.</p>
        </div>

        {/* Mobile Filters */}
        <div className="lg:hidden mb-lg glass-panel p-md rounded-2xl border border-white/20 shadow-soft flex flex-col gap-sm">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-surface text-body-md outline-none" placeholder="Tìm kiếm tour..." type="text" />
          </div>
          <div className="flex gap-sm">
            <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}
              className="flex-1 px-md py-2 rounded-xl border border-outline-variant bg-surface text-label-md">
              <option value="ALL">Tất cả địa điểm</option>
              <option value="Ha Long">Vịnh Hạ Long</option>
              <option value="Da Nang">Đà Nẵng</option>
              <option value="Sapa">Sapa</option>
              <option value="Hoi An">Hội An</option>
              <option value="Ho Chi Minh">TP. Hồ Chí Minh</option>
            </select>
            <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}
              className="flex-1 px-md py-2 rounded-xl border border-outline-variant bg-surface text-label-md">
              <option value="ALL">Mọi mức giá</option>
              <option value="UNDER_200">Dưới 5 triệu</option>
              <option value="200_500">5 triệu - 10 triệu</option>
              <option value="OVER_500">Trên 10 triệu</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-xl items-start justify-between">
          {/* Desktop Filters */}
          <aside className="w-full lg:w-3/12 lg:block hidden sticky top-24 glass-panel p-lg rounded-3xl border border-white/20 shadow-glass space-y-md text-left shrink-0">
            <div className="border-b border-outline-variant pb-md">
              <h3 className="font-headline-md text-primary font-bold">Bộ lọc tìm kiếm</h3>
              <p className="text-xs text-on-surface-variant">Tinh chỉnh tìm kiếm du lịch của bạn</p>
            </div>
            <div className="space-y-xs">
              <label className="block text-xs font-bold text-primary uppercase tracking-wider">Tìm kiếm</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface/50 text-body-md outline-none transition-all" placeholder="Từ khóa..." type="text" />
              </div>
            </div>
            <div className="space-y-xs">
              <label className="block text-xs font-bold text-primary uppercase tracking-wider">Địa điểm</label>
              <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="w-full px-md py-3 rounded-2xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface/50 text-body-md outline-none transition-all">
                <option value="ALL">Tất cả địa điểm</option>
                <option value="Ha Long">Vịnh Hạ Long</option>
                <option value="Da Nang">Đà Nẵng</option>
                <option value="Sapa">Sapa</option>
                <option value="Hoi An">Hội An</option>
                <option value="Ho Chi Minh">TP. Hồ Chí Minh</option>
              </select>
            </div>
            <div className="space-y-xs">
              <label className="block text-xs font-bold text-primary uppercase tracking-wider">Khoảng giá</label>
              <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="w-full px-md py-3 rounded-2xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface/50 text-body-md outline-none transition-all">
                <option value="ALL">Mọi mức giá</option>
                <option value="UNDER_200">Dưới 5 triệu</option>
                <option value="200_500">5 triệu - 10 triệu</option>
                <option value="OVER_500">Trên 10 triệu</option>
              </select>
            </div>
          </aside>

          {/* Tour Grid */}
          <div className="w-full lg:w-8/12 flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
              {isLoading ? (
                <div className="col-span-3 py-2xl text-center text-on-surface-variant">Đang tải danh sách tour...</div>
              ) : tours.length > 0 ? (
                tours.map((tour, index) => {
                  const isFeatured = index === 0 && tours.length > 1;
                  return (
                    <div key={tour.id}
                       className={`group bg-white rounded-3xl overflow-hidden border border-outline-variant/30 shadow-soft hover-lift flex flex-col justify-between ${isFeatured ? 'md:col-span-2 flex-col md:flex-row' : ''}`}>
                      <div className={`relative overflow-hidden shrink-0 ${isFeatured ? 'h-64 md:h-full md:w-1/2 aspect-[4/3] md:aspect-auto' : 'h-64'}`}>
                        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" alt={tour.name} src={tour.image} />
                        <div className="absolute top-4 left-4 flex flex-col gap-xs items-start z-20">
                          <span className="bg-primary/90 backdrop-blur-md text-white font-label-sm text-label-sm px-3 py-1 rounded-full border border-white/20">{tour.duration}</span>
                          {tour.price > 8000000 && <span className="bg-secondary text-white font-label-sm text-label-sm px-3 py-1 rounded-full uppercase tracking-wider font-extrabold text-[9px] neon-glow-secondary">Bán chạy nhất</span>}
                          {tour.price <= 3000000 && <span className="bg-tertiary-container/95 text-on-tertiary-container font-label-sm text-label-sm px-3 py-1 rounded-full uppercase tracking-wider font-extrabold text-[9px] neon-glow-tertiary">Ưu đãi tốt nhất</span>}
                        </div>
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                          <Link href={`/tours/${tour.id}`}
                            className="bg-white hover:bg-primary text-primary hover:text-white px-xl py-3 rounded-2xl font-bold text-label-sm scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 shadow-lg pointer-events-none group-hover:pointer-events-auto">
                            Đặt ngay
                          </Link>
                        </div>
                      </div>
                      <div className="p-lg flex flex-col justify-between flex-grow text-left">
                        <div className="space-y-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-outline uppercase font-extrabold tracking-wider">{tour.location}</span>
                            <div className="flex items-center gap-xs text-secondary font-bold">
                              <span className="material-symbols-outlined text-[16px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                              <span className="text-label-md">{tour.rating.split(' ')[0]}</span>
                            </div>
                          </div>
                          <h3 className="font-headline-md text-headline-md text-primary font-bold line-clamp-2 leading-snug group-hover:text-secondary transition-colors duration-300">{tour.name}</h3>
                          <p className="text-on-surface-variant font-body-md text-sm line-clamp-3 leading-relaxed">{tour.description}</p>
                        </div>
                        <div className="mt-lg pt-md border-t border-outline-variant/30 flex justify-between items-center">
                          <div className="transition-all duration-300">
                            <span className="text-[10px] text-outline block uppercase tracking-wider font-semibold">Giá từ</span>
                            <span className="font-extrabold text-headline-md text-primary">{tour.price.toLocaleString('vi-VN')}đ</span>
                          </div>
                          <Link href={`/tours/${tour.id}`} className="flex items-center text-primary group-hover:text-secondary transition-colors duration-300">
                            <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-3 py-2xl text-center text-on-surface-variant bg-white rounded-3xl shadow-soft border border-outline-variant/30">
                  <span className="material-symbols-outlined text-outline text-[64px] mb-md">search_off</span>
                  <p className="font-extrabold text-title-lg text-primary mb-1">Không tìm thấy tour</p>
                  <p className="font-body-md text-body-md text-on-surface-variant">Chúng tôi không tìm thấy tour nào phù hợp với bộ lọc của bạn. Hãy thử thay đổi từ khóa hoặc bộ lọc.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-inverse-surface dark:bg-surface-container-lowest full-width bottom-0 mt-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop py-xl w-full max-w-max-width mx-auto text-left">
          <div className="space-y-md">
            <span className="font-headline-md text-headline-md text-surface-bright font-bold">VietTour</span>
            <p className="font-body-md text-surface-variant dark:text-on-surface-variant">© 2024 VietTour. Bảo lưu mọi quyền. Trải nghiệm du lịch Chuyên nghiệp, Lôi cuốn và Năng động.</p>
          </div>
          <div className="space-y-md">
            <h5 className="text-on-primary dark:text-primary font-bold">Khám phá</h5>
            <ul className="space-y-sm">
              <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/tours">Tour du lịch</Link></li>
              <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/tours">Điểm đến</Link></li>
              <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/tours">Khuyến mãi</Link></li>
            </ul>
          </div>
          <div className="space-y-md">
            <h5 className="text-on-primary dark:text-primary font-bold">Công ty</h5>
            <ul className="space-y-sm">
              <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/about">Về chúng tôi</Link></li>
              <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/contact">Liên hệ</Link></li>
              <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/tours">Điều khoản dịch vụ</Link></li>
            </ul>
          </div>
          <div className="space-y-md">
            <h5 className="text-on-primary dark:text-primary font-bold">Hỗ trợ</h5>
            <ul className="space-y-sm">
              <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/contact">Trung tâm trợ giúp</Link></li>
              <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/tours">FAQs</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
