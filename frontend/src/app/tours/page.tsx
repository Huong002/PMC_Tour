'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Navbar } from '../../components/layout/Navbar';
import api from '../../services/api';

type ApiTour = {
  id: number; name: string; slug: string; location: string;
  priceAdult: number; salePrice: number | null; shortDescription: string;
  durationDays: number; durationNights: number;
  images: { imageUrl: string }[];
  tourTypeId: number;
  isFeatured?: boolean;
};

type DisplayTour = {
  id: number; name: string; duration: string; rating: string;
  price: number; location: string; image: string; description: string;
  tourTypeId: number;
  isFeatured: boolean;
  durationDays: number;
  durationNights: number;
};

function mapTour(t: ApiTour): DisplayTour {
  const ratings: Record<string, string> = {
    '1': '4.9 (120 đánh giá)', '2': '4.8 (85 đánh giá)', '3': '4.9 (92 đánh giá)',
    '4': '4.5 (33 đánh giá)', '5': '4.6 (47 đánh giá)', '6': '4.8 (92 đánh giá)',
    '7': '5.0 (58 đánh giá)', '8': '4.7 (58 đánh giá)',
  };
  
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
    tourTypeId: t.tourTypeId,
    isFeatured: t.isFeatured ?? false,
    durationDays: t.durationDays,
    durationNights: t.durationNights,
  };
}

function getTourHighlights(name: string, location: string): string[] {
  const nameLower = name.toLowerCase();
  const locLower = location.toLowerCase();
  if (nameLower.includes('ha long') || locLower.includes('quang ninh') || locLower.includes('ha long')) {
    return ['Du thuyền 5★ đẳng cấp', 'Chèo kayak Hang Luồn', 'Khám phá Hang Sửng Sốt'];
  }
  if (nameLower.includes('da nang') || locLower.includes('da nang')) {
    return ['Vui chơi Bà Nà Hills', 'Check-in Cầu Vàng', 'Thư giãn biển Mỹ Khê'];
  }
  if (nameLower.includes('sapa') || locLower.includes('lao cai') || locLower.includes('sapa') || locLower.includes('sa pa')) {
    return ['Trekking bản Tả Van', 'Chinh phục Fansipan', 'Nghỉ dưỡng mây núi'];
  }
  if (nameLower.includes('hoi an') || locLower.includes('quang nam') || locLower.includes('hoi an')) {
    return ['Thả hoa đăng Thu Bồn', 'Workshop làm đèn lồng', 'Khám phá phố cổ'];
  }
  if (nameLower.includes('sai gon') || nameLower.includes('ho chi minh') || locLower.includes('ho chi minh') || locLower.includes('sai gon')) {
    return ['Dinh Độc Lập cổ kính', 'Nhà thờ Đức Bà', 'Café vỉa hè Sài Gòn'];
  }
  if (nameLower.includes('da lat') || locLower.includes('lam dong') || locLower.includes('da lat')) {
    return ['Đồi chè Cầu Đất xanh mướt', 'Nhà thờ Domain De Marie', 'Hồ Xuân Hương thơ mộng'];
  }
  if (nameLower.includes('ha giang') || locLower.includes('ha giang')) {
    return ['Đèo Mã Pí Lèng kỳ vĩ', 'Dạo thuyền sông Nho Quế', 'Cao nguyên đá Đồng Văn'];
  }
  if (nameLower.includes('trang an') || locLower.includes('ninh binh') || nameLower.includes('ninh binh')) {
    return ['Danh thắng Tràng An', 'Ngắm cảnh từ Hang Múa', 'Thăm Cố đô Hoa Lư'];
  }
  return ['Khách sạn tiện nghi', 'Hướng dẫn viên địa phương', 'Vé tham quan trọn gói'];
}

import { Suspense } from 'react';

function ToursPageContent() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [priceRange, setPriceRange] = useState('ALL');
  const [durationFilter, setDurationFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    if (searchParams) {
      const search = searchParams.get('search') || '';
      const price = searchParams.get('price') || 'ALL';
      setSearchTerm(search);
      setPriceRange(price);
    }
  }, [searchParams]);

  const { data: apiData, isLoading } = useQuery({
    queryKey: ['publicTours'],
    queryFn: async () => {
      const res = await api.get('/Tours', { params: { Page: 1, PageSize: 100 } });
      return (res.data?.data?.items || []) as ApiTour[];
    },
  });

  const normalize = (str: string) =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

  let tours: DisplayTour[] = [];
  if (apiData) {
    tours = apiData.map(mapTour).filter((t) => {
      // 0. Lọc theo Tab trên cùng
      if (activeTab === 'FEATURED' && !t.isFeatured) return false;
      if (activeTab === 'RESORT') {
        const isResort = t.tourTypeId === 3 || t.description.toLowerCase().includes('resort') || t.description.toLowerCase().includes('nghị dưỡng');
        if (!isResort) return false;
      }
      if (activeTab === 'TREKKING') {
        const isTrekking = t.name.toLowerCase().includes('trekking') || t.description.toLowerCase().includes('trekking') || t.tourTypeId === 5;
        if (!isTrekking) return false;
      }
      if (activeTab === 'DOMESTIC' && t.tourTypeId !== 1) return false;
      if (activeTab === 'INTERNATIONAL' && t.tourTypeId !== 2) return false;

      // 1. Tìm kiếm fuzzy
      if (searchTerm) {
        const term = normalize(searchTerm);
        const nameMatch = normalize(t.name).includes(term);
        const descMatch = normalize(t.description).includes(term);
        const locMatch = normalize(t.location).includes(term);
        if (!nameMatch && !descMatch && !locMatch) return false;
      }

      // 2. Lọc địa điểm
      if (selectedLocation !== 'ALL') {
        const loc = normalize(t.location);
        const filter = normalize(selectedLocation);
        let isMatch = false;

        if (filter === 'ha long') {
          isMatch = loc.includes('quang ninh') || loc.includes('ha long') || loc.includes('vinh ha long');
        } else if (filter === 'da nang') {
          isMatch = loc.includes('da nang');
        } else if (filter === 'sapa') {
          isMatch = loc.includes('lao cai') || loc.includes('sapa') || loc.includes('sa pa');
        } else if (filter === 'hoi an') {
          isMatch = loc.includes('quang nam') || loc.includes('hoi an');
        } else if (filter === 'ho chi minh') {
          isMatch = loc.includes('ho chi minh') || loc.includes('sai gon') || loc.includes('hcm');
        } else {
          isMatch = loc.includes(filter);
        }

        if (!isMatch) return false;
      }

      // 3. Lọc khoảng giá
      if (priceRange === 'UNDER_200' && t.price >= 5000000) return false;
      if (priceRange === '200_500' && (t.price < 5000000 || t.price > 10000000)) return false;
      if (priceRange === 'OVER_500' && t.price <= 10000000) return false;

      // 4. Lọc thời lượng
      if (durationFilter !== 'ALL') {
        if (durationFilter === '1_DAY' && t.durationDays !== 1) return false;
        if (durationFilter === '2_3_DAYS' && (t.durationDays < 2 || t.durationDays > 3)) return false;
        if (durationFilter === '4_7_DAYS' && (t.durationDays < 4 || t.durationDays > 7)) return false;
      }

      // 5. Lọc loại hình
      if (categoryFilter !== 'ALL' && t.tourTypeId !== Number(categoryFilter)) return false;

      return true;
    });

    // Sắp xếp đưa Tour nổi bật hoặc Bán chạy nhất lên đầu để làm Banner Hallmark Card
    tours.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;

      const aBest = a.price > 8000000;
      const bBest = b.price > 8000000;
      if (aBest && !bBest) return -1;
      if (!aBest && bBest) return 1;

      return 0;
    });
  }

  return (
    <div className="bg-[#F8FAFC] text-slate-800 font-body-md selection:bg-cyan-100 selection:text-cyan-900 min-h-screen flex flex-col justify-between" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 py-10 w-full">
        {/* Banner Title */}
        <div className="mb-10 text-left">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0E7490] mb-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Khám phá những hành trình đáng nhớ
          </h1>
          <p className="text-slate-500 text-sm md:text-base max-w-3xl leading-relaxed">
            Hơn 500+ tour du lịch trong và ngoài nước được thiết kế dành riêng cho gia đình, cặp đôi và doanh nghiệp. Hãy chọn hành trình tiếp theo của bạn ngay hôm nay!
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-4 justify-start">
          {[
            { id: 'ALL', label: 'Tất cả tour' },
            { id: 'FEATURED', label: 'Tour nổi bật 🌟' },
            { id: 'RESORT', label: 'Nghỉ dưỡng 🏖' },
            { id: 'TREKKING', label: 'Trekking & Khám phá 🧗' },
            { id: 'DOMESTIC', label: 'Trong nước 🇻🇳' },
            { id: 'INTERNATIONAL', label: 'Quốc tế ✈' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-[#0E7490] text-white shadow-md shadow-cyan-900/10'
                  : 'bg-white text-slate-600 hover:text-[#0E7490] border border-slate-200 hover:border-[#0E7490]/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile Filters Toggle Area */}
        <div className="lg:hidden mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none"
              placeholder="Tìm kiếm tour..."
              type="text"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
            >
              <option value="ALL">Tất cả địa điểm</option>
              <option value="Ha Long">Vịnh Hạ Long</option>
              <option value="Da Nang">Đà Nẵng</option>
              <option value="Sapa">Sapa</option>
              <option value="Hoi An">Hội An</option>
              <option value="Ho Chi Minh">TP. Hồ Chí Minh</option>
            </select>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
            >
              <option value="ALL">Mọi mức giá</option>
              <option value="UNDER_200">Dưới 5 triệu</option>
              <option value="200_500">5 - 10 triệu</option>
              <option value="OVER_500">Trên 10 triệu</option>
            </select>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
          
          {/* Desktop Filter Sidebar (Card style) */}
          <aside className="w-full lg:w-[300px] lg:block hidden sticky top-24 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-left space-y-6 shrink-0">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-[#0E7490] flex items-center gap-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                <span className="material-symbols-outlined">tune</span>
                Bộ lọc tìm kiếm
              </h3>
              <p className="text-xs text-slate-400 mt-1">Tinh chỉnh tìm kiếm du lịch của bạn</p>
            </div>

            {/* Keyword Search */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Từ khóa</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0E7490] focus:ring-1 focus:ring-[#0E7490] bg-slate-50/50 text-sm outline-none transition-all placeholder:text-slate-400"
                  placeholder="Tên tour, địa điểm..."
                  type="text"
                />
              </div>
            </div>

            {/* Destination Dropdown */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Điểm đến</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">location_on</span>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0E7490] focus:ring-1 focus:ring-[#0E7490] bg-slate-50/50 text-sm outline-none appearance-none transition-all cursor-pointer"
                >
                  <option value="ALL">Tất cả địa điểm</option>
                  <option value="Ha Long">Vịnh Hạ Long</option>
                  <option value="Da Nang">Đà Nẵng</option>
                  <option value="Sapa">Sapa</option>
                  <option value="Hoi An">Hội An</option>
                  <option value="Ho Chi Minh">TP. Hồ Chí Minh</option>
                </select>
              </div>
            </div>

            {/* Budget Dropdown */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Ngân sách</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">payments</span>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0E7490] focus:ring-1 focus:ring-[#0E7490] bg-slate-50/50 text-sm outline-none appearance-none transition-all cursor-pointer"
                >
                  <option value="ALL">Mọi mức giá</option>
                  <option value="UNDER_200">Dưới 5 triệu</option>
                  <option value="200_500">5 triệu - 10 triệu</option>
                  <option value="OVER_500">Trên 10 triệu</option>
                </select>
              </div>
            </div>

            {/* Duration Filter (Radios) */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Thời lượng</label>
              <div className="space-y-2 pl-1">
                {[
                  { id: 'ALL', label: 'Tất cả thời lượng' },
                  { id: '1_DAY', label: 'Trong ngày (1 ngày)' },
                  { id: '2_3_DAYS', label: 'Ngắn ngày (2-3 ngày)' },
                  { id: '4_7_DAYS', label: 'Dài ngày (4-7 ngày)' },
                ].map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer hover:text-[#0E7490] transition-colors">
                    <input
                      type="radio"
                      name="duration"
                      checked={durationFilter === opt.id}
                      onChange={() => setDurationFilter(opt.id)}
                      className="text-[#0E7490] focus:ring-[#0E7490] h-4.5 w-4.5"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Type Filter (Radios) */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Loại hình tour</label>
              <div className="space-y-2 pl-1">
                {[
                  { id: 'ALL', label: 'Tất cả loại hình' },
                  { id: '1', label: 'Du lịch Trong nước' },
                  { id: '2', label: 'Du lịch Quốc tế' },
                  { id: '3', label: 'Trải nghiệm Cao cấp' },
                  { id: '4', label: 'Du lịch Sinh thái' },
                  { id: '5', label: 'Trekking & Khám phá' },
                  { id: '6', label: 'Văn hóa - Lịch sử' },
                ].map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer hover:text-[#0E7490] transition-colors">
                    <input
                      type="radio"
                      name="category"
                      checked={categoryFilter === opt.id}
                      onChange={() => setCategoryFilter(opt.id)}
                      className="text-[#0E7490] focus:ring-[#0E7490] h-4.5 w-4.5"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Tour Listing Area */}
          <div className="w-full lg:flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-full py-16 text-center text-slate-400">
                  <span className="animate-spin rounded-full h-8 w-8 border-4 border-[#0E7490] border-t-transparent inline-block mb-3" />
                  <p className="text-sm font-semibold">Đang tải danh sách tour...</p>
                </div>
              ) : tours.length > 0 ? (
                tours.map((tour, index) => {
                  // Hallmark/Booking style layout for the first prominent featured tour
                  const isFeatured = index === 0 && tours.length > 1 && activeTab === 'ALL';
                  
                  return (
                    <div
                      key={tour.id}
                      className={`group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between ${
                        isFeatured ? 'md:col-span-2 lg:col-span-2 md:flex-row' : ''
                      }`}
                    >
                      {/* Image container */}
                      <div className={`relative overflow-hidden shrink-0 ${isFeatured ? 'h-64 md:h-full md:w-1/2 aspect-[4/3] md:aspect-auto' : 'h-52'}`}>
                        <img
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                          alt={tour.name}
                          src={tour.image}
                        />
                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start z-10">
                          <span className="bg-[#0E7490]/90 backdrop-blur-md text-white font-semibold text-[11px] px-2.5 py-1 rounded-lg border border-white/20">
                            {tour.duration}
                          </span>
                          {tour.price > 8000000 && (
                            <span className="bg-[#F59E0B] text-white font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider text-[9px] shadow-sm">
                              Bán chạy nhất 🔥
                            </span>
                          )}
                          {tour.price <= 3000000 && (
                            <span className="bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider text-[9px] shadow-sm">
                              Ưu đãi lớn 🏷
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="p-5 flex flex-col justify-between flex-grow text-left">
                        <div className="space-y-3">
                          {/* Location & Rating */}
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-[#0E7490] uppercase font-bold tracking-wider flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">location_on</span>
                              {tour.location}
                            </span>
                            <div className="flex items-center gap-0.5 text-[#F59E0B] font-bold">
                              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                              <span className="text-xs">{tour.rating.split(' ')[0]}</span>
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="text-base font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-[#0E7490] transition-colors duration-300" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            {tour.name}
                          </h3>

                          {/* Highlights Checkmark list (Du lịch cảm xúc) */}
                          <div className="space-y-1 py-2 border-t border-b border-slate-100">
                            {getTourHighlights(tour.name, tour.location).map((hl, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                <span className="material-symbols-outlined text-[13px] text-[#F59E0B] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                <span className="font-medium line-clamp-1">{hl}</span>
                              </div>
                            ))}
                          </div>

                          {/* Short Description */}
                          <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                            {tour.description}
                          </p>
                        </div>

                        {/* Price and Action */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Giá trọn gói từ</span>
                            <span className="font-extrabold text-lg text-[#0E7490]">{tour.price.toLocaleString('vi-VN')}đ</span>
                          </div>
                          <Link
                            href={`/tours/${tour.id}`}
                            className="bg-[#0E7490] hover:bg-[#0E7490]/90 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1 shadow-sm hover:shadow active:scale-95"
                          >
                            Chi tiết
                            <span className="material-symbols-outlined text-xs">arrow_forward</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <span className="material-symbols-outlined text-slate-300 text-[64px] mb-3">search_off</span>
                  <p className="font-bold text-lg text-[#0E7490] mb-1">Không tìm thấy tour nào</p>
                  <p className="text-xs text-slate-400 max-w-[380px] mx-auto px-4">Chúng tôi không tìm thấy tour nào phù hợp với bộ lọc hiện tại. Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
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

export default function ToursPage() {
  return (
    <Suspense fallback={
      <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-md text-on-surface-variant">
          <span className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
          <span className="font-label-md">Đang tải danh sách tour...</span>
        </div>
      </div>
    }>
      <ToursPageContent />
    </Suspense>
  );
}
