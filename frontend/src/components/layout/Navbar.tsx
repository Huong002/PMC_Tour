'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';

const NAV_LINKS = [
  { href: '/tours',           label: 'Tour du lịch' },
  { href: '/registrations/my', label: 'Đặt tour của tôi' },
  { href: '/about',           label: 'Về chúng tôi' },
  { href: '/contact',         label: 'Liên hệ' },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Đóng menu khi chuyển route
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href) && href !== '/tours');

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'h-16 shadow-md border-b border-outline-variant/60'
          : 'h-20 shadow-sm border-b border-outline-variant/40'
      }`}
      style={{
        background: 'rgba(255, 255, 255, 0.97)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <nav className="flex justify-between items-center h-full px-6 lg:px-16 w-full max-w-[1280px] mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-extrabold text-[22px] text-primary tracking-tight hover:opacity-90 transition-opacity"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '26px', color: 'var(--color-secondary)' }}
            >
              explore
            </span>
            VietTour
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href) && link.label === 'Tour du lịch' && pathname === '/tours';
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'text-primary font-bold bg-primary/8 border-b-2 border-primary'
                      : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Auth actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link href="/profile" className="flex items-center gap-1.5 hover:text-primary transition-all">
                <span className="material-symbols-outlined text-[20px] text-primary">person</span>
                <span
                  className="text-sm font-semibold text-on-surface hover:text-primary max-w-[160px] truncate hidden lg:block"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Xin chào, {user.fullName}
                </span>
              </Link>
              <button
                onClick={() => logout()}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-error border border-error/30 hover:bg-error/5 transition-all"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-5 py-2 rounded-xl text-sm font-semibold text-primary border-2 border-primary/25 hover:border-primary hover:bg-primary/5 transition-all"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all shadow-sm"
                style={{
                  background: 'var(--color-primary)',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">
            {menuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div
          className="md:hidden absolute top-full left-0 right-0 border-b border-outline-variant/50 shadow-lg"
          style={{
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="flex flex-col p-4 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-3 rounded-xl text-sm font-medium text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-outline-variant/40 mt-2 pt-3 flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="px-4 py-3 rounded-xl text-sm font-semibold text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors text-left"
                  >
                    Trang cá nhân
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="px-4 py-3 rounded-xl text-sm font-semibold text-error hover:bg-error/5 transition-colors text-left"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-3 rounded-xl text-sm font-semibold text-primary border border-primary/25 text-center"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-3 rounded-xl text-sm font-semibold text-white text-center"
                    style={{ background: 'var(--color-primary)' }}
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
