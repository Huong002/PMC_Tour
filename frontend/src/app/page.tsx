'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '../components/layout/Navbar';

export default function Home() {
  const headerRef = useRef<HTMLElement>(null);
  const router = useRouter();

  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('ALL');
  const [startDate, setStartDate] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location.trim()) {
      params.set('search', location.trim());
    }
    if (priceRange !== 'ALL') {
      params.set('price', priceRange);
    }
    router.push(`/tours?${params.toString()}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      const header = headerRef.current;
      if (!header) return;
      if (window.scrollY > 50) {
        header.classList.add('shadow-md');
      } else {
        header.classList.remove('shadow-md');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <main className="flex-grow">
        {/* ── Hero Section ── */}
        <section className="relative h-[870px] flex items-center justify-center overflow-hidden">
          {/* Background image + gradient overlay */}
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover"
              alt="Ha Long Bay panorama during golden hour"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdvQWi_O9zCsIrQhzfLCogxDdG0zcFml7pQ8uro06IczucqDRVGlHqTzsFsnqsUWulAYnS0aZYawt1wAXu1QnKsfAV1t1XhicySbs2IFkVYlXnAH4hNLTwqSVWnTZzHCGBU7gXKcuxhcn6I6t7XolUnO0v8rB2fjE1R4aQ3by1KQSgYJ7hOosQUvBjY0CMcWbehaSongNnUOhStqHX6RVBXF5rh9uEViUpw_pBvDXEkv8YoSeAjsacAIYZe630wMrGsY8SH39nKPw"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(0,71,94,0.4), rgba(0,71,94,0.1))' }}
            />
          </div>

          {/* Hero content */}
          <div className="relative z-10 w-full max-w-4xl px-4 md:px-16 text-center">
            <h1
              className="text-5xl md:text-[48px] leading-[56px] font-bold text-white mb-6 drop-shadow-lg"
              style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '-0.02em' }}
            >
              Khám Phá Những Viên Ngọc Ẩn Của Việt Nam
            </h1>
            <p className="text-lg text-white/90 mb-10 drop-shadow-md">
              Trải nghiệm du lịch chuyên nghiệp, lôi cuốn và năng động dành riêng cho bạn.
            </p>

            {/* Search Bar */}
            <div
              className="p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center"
              style={{
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0px 4px 20px rgba(26,95,122,0.08)',
                animation: 'float 6s ease-in-out infinite',
              }}
            >
              {/* Location */}
              <div className="flex-1 w-full text-left">
                <label
                  className="block text-xs font-semibold mb-1 ml-1"
                  style={{ color: 'var(--color-on-surface-variant)' }}
                >
                  Điểm đến
                </label>
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--color-outline)' }}
                  >
                    location_on
                  </span>
                  <input
                    className="w-full pl-10 pr-4 py-3 rounded-lg border text-sm bg-white outline-none transition-all"
                    style={{ borderColor: 'var(--color-outline-variant)', color: 'var(--color-on-surface)' }}
                    placeholder="Bạn muốn đi đâu?"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--color-outline-variant)'; }}
                  />
                </div>
              </div>

              {/* Date */}
              <div className="flex-1 w-full text-left">
                <label
                  className="block text-xs font-semibold mb-1 ml-1"
                  style={{ color: 'var(--color-on-surface-variant)' }}
                >
                  Ngày khởi hành
                </label>
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--color-outline)' }}
                  >
                    calendar_month
                  </span>
                  <input
                    className="w-full pl-10 pr-4 py-3 rounded-lg border text-sm bg-white outline-none transition-all"
                    style={{ borderColor: 'var(--color-outline-variant)', color: 'var(--color-on-surface)' }}
                    placeholder="Chọn ngày"
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--color-outline-variant)'; }}
                  />
                </div>
              </div>

              {/* Budget */}
              <div className="flex-1 w-full text-left">
                <label
                  className="block text-xs font-semibold mb-1 ml-1"
                  style={{ color: 'var(--color-on-surface-variant)' }}
                >
                  Mức giá
                </label>
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--color-outline)' }}
                  >
                    payments
                  </span>
                  <select
                    className="w-full pl-10 pr-10 py-3 rounded-lg border text-sm bg-white outline-none appearance-none transition-all"
                    style={{ borderColor: 'var(--color-outline-variant)', color: 'var(--color-on-surface)' }}
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--color-outline-variant)'; }}
                  >
                    <option value="ALL">Tất cả mức giá</option>
                    <option value="UNDER_200">Bình dân (Dưới 5 triệu)</option>
                    <option value="200_500">Cận cao cấp (5 - 10 triệu)</option>
                    <option value="OVER_500">Cao cấp (Trên 10 triệu)</option>
                  </select>
                </div>
              </div>

              {/* Search button */}
              <button
                type="button"
                onClick={handleSearch}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-all mt-4 md:mt-6 hover:opacity-90 active:scale-95 whitespace-nowrap"
                style={{
                  background: 'var(--color-secondary-container)',
                  color: 'var(--color-on-secondary-container)',
                }}
              >
                <span className="material-symbols-outlined">search</span>
                Tìm kiếm
              </button>
            </div>
          </div>
        </section>

        {/* ── Featured Tours ── */}
        <section className="py-10 px-4 md:px-16 max-w-[1280px] mx-auto">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2
                className="text-3xl font-bold mb-2"
                style={{ color: 'var(--color-primary)', fontFamily: "'Montserrat', sans-serif" }}
              >
                Tour Nổi Bật
              </h2>
              <p className="text-base" style={{ color: 'var(--color-on-surface-variant)' }}>
                Những trải nghiệm được tuyển chọn kỹ lưỡng tại những địa danh mang tính biểu tượng nhất đất nước.
              </p>
            </div>
            <Link
              href="/tours"
              className="hidden md:flex items-center gap-1 font-bold hover:underline"
              style={{ color: 'var(--color-primary)' }}
            >
              Xem tất cả các tour
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div
              className="rounded-xl overflow-hidden border transition-all duration-300 group"
              style={{
                background: 'var(--color-surface-container-lowest)',
                borderColor: 'var(--color-outline-variant)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0px 12px 30px rgba(26,95,122,0.12)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = '';
                (e.currentTarget as HTMLElement).style.boxShadow = '';
              }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Du thuyền Hạ Long Cao cấp"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2kMf1N3_Rz7UCmKFDXXOH1Ebqo3_y3ap0Aw2RTfL0rsdGqmnN3k2PN8OMXKhGRoc_m0Rjeyfk_eI4NvAgvU3p0qkj-UJ5gsibYJVHEZnGCh50VnQT8I1NbrwmnrDTp-6H-8h_ccm7KbaexOpYqWI_4UlYOQkIWzfyqZCRBONyEXDlxneuwGZ3ZaVQDPACTdiLinLzR2Cdq0MEgCnjqSFC6zmK7GCIVoY7ioQne96tH2rxabaxcodyyo0uGTYABuIuj4Z_ldeNnCQ"
                />
                <div
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: 'rgba(0,99,97,0.9)', color: 'var(--color-on-tertiary-container)' }}
                >
                  5 Ngày
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1 font-bold mb-2" style={{ color: 'var(--color-secondary)' }}>
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-sm">4.9 (120 đánh giá)</span>
                </div>
                <h3
                  className="text-2xl font-semibold mb-2"
                  style={{ color: 'var(--color-on-surface)', fontFamily: "'Montserrat', sans-serif" }}
                >
                  Du thuyền Sang trọng Vịnh Hạ Long
                </h3>
                <p className="text-sm line-clamp-2 mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Khám phá làn nước ngọc lục bảo và các đảo đá vôi của Vịnh Hạ Long trên du thuyền năm sao của chúng tôi.
                </p>
                <div
                  className="flex justify-between items-center pt-4 border-t"
                  style={{ borderColor: 'var(--color-outline-variant)' }}
                >
                  <div>
                    <span className="text-xs block" style={{ color: 'var(--color-outline)' }}>Từ</span>
                    <span className="font-bold text-2xl" style={{ color: 'var(--color-primary)' }}>12.500.000đ</span>
                  </div>
                  <Link
                    href="/tours/1"
                    className="px-4 py-2 rounded-lg font-bold text-white transition-colors hover:opacity-90"
                    style={{ background: 'var(--color-primary)' }}
                  >
                    Đặt Ngay
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div
              className="rounded-xl overflow-hidden border transition-all duration-300 group"
              style={{
                background: 'var(--color-surface-container-lowest)',
                borderColor: 'var(--color-outline-variant)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0px 12px 30px rgba(26,95,122,0.12)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = '';
                (e.currentTarget as HTMLElement).style.boxShadow = '';
              }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Khám phá biển Đà Nẵng"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0-xI_5NNTewujqvo97PfB2MaNvVOOXXW1hcSaDHKMs4asSx1FOq4BxJ-u1wdMYspozCf6a1rkpZaRXX-A4v-bVhBqaC85MlHS9XStk4QKCv2j2jGRH1NOTKQftpfNXaNZrdyrzWrwvbQrzvMvlM1N_F-Fw5xgH5uytrLqx6cTFLfvh_aOl0532mFPYnUDc_T0pQXmp2lwv9CLreHZrRAXgYRqRHuXVBwpAdvSJ1nTZ5xyJBoEUuODCw1v3Gg9ouykMJIs4E17B-Q"
                />
                <div
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: 'rgba(0,99,97,0.9)', color: 'var(--color-on-tertiary-container)' }}
                >
                  3 Ngày
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1 font-bold mb-2" style={{ color: 'var(--color-secondary)' }}>
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-sm">4.8 (85 đánh giá)</span>
                </div>
                <h3
                  className="text-2xl font-semibold mb-2"
                  style={{ color: 'var(--color-on-surface)', fontFamily: "'Montserrat', sans-serif" }}
                >
                  Hành trình Khám phá Biển Đà Nẵng
                </h3>
                <p className="text-sm line-clamp-2 mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Ghé thăm Cầu Vàng và thư giãn trên những bãi biển hoang sơ của vùng duyên hải miền Trung Việt Nam.
                </p>
                <div
                  className="flex justify-between items-center pt-4 border-t"
                  style={{ borderColor: 'var(--color-outline-variant)' }}
                >
                  <div>
                    <span className="text-xs block" style={{ color: 'var(--color-outline)' }}>Từ</span>
                    <span className="font-bold text-2xl" style={{ color: 'var(--color-primary)' }}>6.800.000đ</span>
                  </div>
                  <Link
                    href="/tours/2"
                    className="px-4 py-2 rounded-lg font-bold text-white transition-colors hover:opacity-90"
                    style={{ background: 'var(--color-primary)' }}
                  >
                    Đặt Ngay
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div
              className="rounded-xl overflow-hidden border transition-all duration-300 group"
              style={{
                background: 'var(--color-surface-container-lowest)',
                borderColor: 'var(--color-outline-variant)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0px 12px 30px rgba(26,95,122,0.12)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = '';
                (e.currentTarget as HTMLElement).style.boxShadow = '';
              }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Trekking vùng cao Sa Pa"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZX6EEXXoSz07_jUo7zLg-TXJ5nfRVbgoO8r_jw8qOoLT_6ylUePyUDUMRX-97DPUX8SeZ7vA_KBibZfMkj_t47T81wMuFbX_gPoQ-7YT5OlxK2a4mHH_006vAbahGHvh2T_trOByovh3EenGXzZHkgC6356-6x3esfScMDP1N6BF2-4vbnWzBGi9U5nhyPeapvXspe0iwnz3nprsyt57JURn7KmDWkyZrp63gfk0ozUR0Qzyzs8mccLIpPx2WwDPChkklO5RDb4w"
                />
                <div
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: 'rgba(0,99,97,0.9)', color: 'var(--color-on-tertiary-container)' }}
                >
                  4 Ngày
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1 font-bold mb-2" style={{ color: 'var(--color-secondary)' }}>
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-sm">4.9 (92 đánh giá)</span>
                </div>
                <h3
                  className="text-2xl font-semibold mb-2"
                  style={{ color: 'var(--color-on-surface)', fontFamily: "'Montserrat', sans-serif" }}
                >
                  Trekking Vùng Cao Sa Pa
                </h3>
                <p className="text-sm line-clamp-2 mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Hành trình qua những ruộng bậc thang và các bản làng dân tộc của vùng núi phía bắc Việt Nam.
                </p>
                <div
                  className="flex justify-between items-center pt-4 border-t"
                  style={{ borderColor: 'var(--color-outline-variant)' }}
                >
                  <div>
                    <span className="text-xs block" style={{ color: 'var(--color-outline)' }}>Từ</span>
                    <span className="font-bold text-2xl" style={{ color: 'var(--color-primary)' }}>8.200.000đ</span>
                  </div>
                  <Link
                    href="/tours/3"
                    className="px-4 py-2 rounded-lg font-bold text-white transition-colors hover:opacity-90"
                    style={{ background: 'var(--color-primary)' }}
                  >
                    Đặt Ngay
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Why Choose Us ── */}
        <section className="py-10" style={{ background: 'var(--color-surface-container-low)' }}>
          <div className="px-4 md:px-16 max-w-[1280px] mx-auto">
            <h2
              className="text-3xl font-bold text-center mb-10"
              style={{ color: 'var(--color-primary)', fontFamily: "'Montserrat', sans-serif" }}
            >
              Tại Sao Chọn VietTour
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              {[
                { icon: 'verified',       title: 'Hướng dẫn viên chuyên nghiệp',   desc: 'Các chuyên gia địa phương am hiểu lịch sử và các địa điểm ẩn.' },
                { icon: 'support_agent',  title: 'Hỗ trợ 24/7',       desc: 'Chúng tôi luôn ở đây để hỗ trợ bạn trên mọi bước đường hành trình.' },
                { icon: 'shield_with_heart', title: 'Bảo hiểm du lịch', desc: 'Các chuyến đi được bảo hiểm đầy đủ cho sự an tâm và an toàn của bạn.' },
                { icon: 'handshake',      title: 'Giá tốt nhất',         desc: 'Cam kết mức giá cạnh tranh nhất và không có phí ẩn.' },
              ].map((item) => (
                <div key={item.title} className="flex flex-col items-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ background: 'var(--color-primary-fixed)', color: 'var(--color-primary)' }}
                  >
                    <span className="material-symbols-outlined text-4xl">{item.icon}</span>
                  </div>
                  <h4
                    className="text-lg font-semibold mb-2"
                    style={{ color: 'var(--color-on-surface)', fontFamily: "'Inter', sans-serif" }}
                  >
                    {item.title}
                  </h4>
                  <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Newsletter ── */}
        <section className="py-10 px-4 md:px-16">
          <div
            className="max-w-4xl mx-auto p-10 rounded-2xl border relative overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0px 4px 20px rgba(26,95,122,0.08)',
              borderColor: 'rgba(0,71,94,0.1)',
            }}
          >
            <div
              className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl"
              style={{ background: 'rgba(143,77,0,0.1)' }}
            />
            <div className="relative z-10 text-center">
              <h2
                className="text-3xl font-bold mb-4"
                style={{ color: 'var(--color-primary)', fontFamily: "'Montserrat', sans-serif" }}
              >
                Nhận Mẹo Du Lịch Độc Quyền
              </h2>
              <p className="mb-6 text-base" style={{ color: 'var(--color-on-surface-variant)' }}>
                Tham gia cùng hơn 50.000 du khách để nhận những ưu đãi tốt nhất về các tour Việt Nam trực tiếp trong hộp thư của bạn.
              </p>
              <form
                className="flex flex-col sm:flex-row gap-4 max-w-[512px] mx-auto"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  className="flex-1 px-6 py-3 rounded-lg border text-sm outline-none transition-all bg-white"
                  style={{ borderColor: 'var(--color-outline-variant)', color: 'var(--color-on-surface)' }}
                  placeholder="Địa chỉ email của bạn"
                  required
                  type="email"
                  onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--color-outline-variant)'; }}
                />
                <button
                  className="px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap text-white hover:opacity-90 active:scale-95"
                  style={{ background: 'var(--color-primary)' }}
                  type="submit"
                >
                  Đăng Ký Ngay
                </button>
              </form>
              <p className="text-xs mt-4" style={{ color: 'var(--color-outline)' }}>
                Bằng cách đăng ký, bạn đồng ý với Điều khoản Dịch vụ và Chính sách Bảo mật của chúng tôi.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="mt-10" style={{ background: '#2f3131', color: '#f1f1f1' }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4 md:px-16 py-10 w-full max-w-[1280px] mx-auto">
          {/* Brand */}
          <div className="space-y-4">
            <span
              className="text-2xl font-bold block"
              style={{ color: '#f9f9f9', fontFamily: "'Montserrat', sans-serif" }}
            >
              VietTour
            </span>
            <p className="text-sm" style={{ color: '#c0c8cd' }}>
              © 2024 VietTour. Bảo lưu mọi quyền. Trải nghiệm du lịch Chuyên nghiệp, Lôi cuốn và Năng động.
            </p>
            <div className="flex gap-4">
              {[
                { icon: 'public', href: '/contact' },
                { icon: 'forum', href: '/contact' },
                { icon: 'video_library', href: '/contact' },
              ].map((item) => (
                <Link
                  key={item.icon}
                  href={item.href}
                  className="transition-colors hover:text-white"
                  style={{ color: '#c0c8cd' }}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h5
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: '#f9f9f9' }}
            >
              Công ty
            </h5>
            <ul className="space-y-2">
              {['Về chúng tôi', 'Tuyển dụng', 'Báo chí'].map((item) => (
                <li key={item}>
                  <Link
                    href="/about"
                    className="text-sm transition-colors hover:text-white focus:underline"
                    style={{ color: '#c0c8cd' }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h5
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: '#f9f9f9' }}
            >
              Hỗ trợ
            </h5>
            <ul className="space-y-2">
              {[
                { label: 'Trung tâm trợ giúp',     href: '/contact' },
                { label: 'Liên hệ',         href: '/contact' },
                { label: 'Chính sách bảo mật',  href: '/tours'   },
                { label: 'Điều khoản dịch vụ', href: '/tours'   },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm transition-colors hover:text-white focus:underline"
                    style={{ color: '#c0c8cd' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h5
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: '#f9f9f9' }}
            >
              Liên hệ chúng tôi
            </h5>
            <div className="space-y-2">
              {[
                { icon: 'mail',        text: 'info@viettour.vn' },
                { icon: 'call',        text: '+84 123 456 789'  },
                { icon: 'location_on', text: '123 Đường Du Lịch, Hà Nội, Việt Nam' },
              ].map((item) => (
                <div key={item.icon} className="flex items-start gap-2" style={{ color: '#c0c8cd' }}>
                  <span className="material-symbols-outlined text-sm mt-1">{item.icon}</span>
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
