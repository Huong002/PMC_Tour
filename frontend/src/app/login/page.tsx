'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const { login, isLoggingIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await login({ username: email, password });
      window.location.href = '/dashboard';
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
      );
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* Left Side: Visual/Branding */}
      <div className="login-left">
        <img
          alt="Scenic Vietnam"
          className="login-bg-img"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBimCMm1SHjUX89959V-7ykTg3a8cwjcFukJ9OoatMLmMOz955JPsHXvWrl1R8js6Xb2iVnpHGJRt4Dj5sApf9Hnv1mx74CHBvO2J1UP2gaTHmo93eSCxwZ9AcBtUz0nnhVp8i-ANVyEhmt8yaaFB44c6yAaXDlFhVcgrP2RqDauLxw78s4huPUZ3Jv3a5XSCGSzg-fne2pcDckRsEdqTJTl-dS7c-9js9la4qPeqdE6VLua5Z5cQTfSdTHfGZ1b3f3-n0rCFK9LJ4"
        />
        <div className="login-left-overlay" />
        <div className="login-left-content">
          <div className="login-brand">
            <div className="login-brand-icon">
              <span className="material-symbols-outlined">explore</span>
            </div>
            <span className="login-brand-name">VietTour</span>
          </div>
          <h1 className="login-headline">Khám phá Tâm hồn Việt Nam.</h1>
          <p className="login-subtext">
            Đăng nhập để truy cập lịch trình du lịch được thiết kế riêng, quản lý các lượt đặt tour độc quyền và khám phá những viên ngọc ẩn giấu trên khắp mảnh đất hình chữ S.
          </p>
          <div className="login-badges">
            <div className="login-badge">
              <span className="material-symbols-outlined">verified_user</span>
              <span>Hậu cần Chuyên nghiệp</span>
            </div>
            <div className="login-badge">
              <span className="material-symbols-outlined">explore</span>
              <span>Trải nghiệm Đích thực</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="login-right">
        <div className="login-form-container">
          {/* Mobile Branding */}
          <div className="login-mobile-brand">
            <div className="login-brand-icon">
              <span className="material-symbols-outlined">explore</span>
            </div>
            <span className="login-brand-name" style={{ color: 'var(--color-primary)' }}>VietTour</span>
          </div>

          <div className="login-form-header">
            <h2 className="login-form-title">Chào mừng trở lại</h2>
            <p className="login-form-subtitle">Vui lòng nhập thông tin để đăng nhập.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Error Message */}
            {errorMsg && (
              <div className="login-error">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
                {errorMsg}
              </div>
            )}

            {/* Email Field */}
            <div className="login-field">
              <label htmlFor="email" className="login-label">Địa chỉ Email</label>
              <div className="login-input-wrapper">
                <span className="material-symbols-outlined login-input-icon">mail</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="login-input"
                  placeholder="ten@congty.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="login-field">
              <div className="login-label-row">
                <label htmlFor="password" className="login-label">Mật khẩu</label>
                <Link href="/forgot-password" className="login-forgot">Quên mật khẩu?</Link>
              </div>
              <div className="login-input-wrapper">
                <span className="material-symbols-outlined login-input-icon">lock</span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword((p) => !p)}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="login-remember">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="login-checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label htmlFor="remember" className="login-remember-label">
                Ghi nhớ đăng nhập 30 ngày
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <span className="login-spinner" />
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  Đăng nhập
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="login-divider">
              <div className="login-divider-line" />
              <span className="login-divider-text">Hoặc tiếp tục với</span>
              <div className="login-divider-line" />
            </div>

            {/* Social Logins */}
            <div className="login-social-grid">
              <button type="button" className="login-social-btn">
                <img
                  alt="Google"
                  className="login-social-icon"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzMhpQDPbAkY-hldBG3kpTwH3vPQaejwT2VT2ekDYdFOp5ivmuWaWrXf8U-VQmIOSqHoFVOLRbEUdgZe-6XyNRk8oO3xRVn_o6s7sjUHgnJhHtHkBPdcqchSDJJSIXprHBF67XGp7CXKsqDpsvJ0oXerjHJgeoZHsdNCV8GzHGUNhQ646e3fEgAgNpYpJe49yX_1i_B1cBKEklevcu_j05MfEowcB3rKRzwQICZTTBNoHOt08hcFXoyetbRMQhNEJAyhClWwTWG6c"
                />
                Google
              </button>
              <button type="button" className="login-social-btn">
                <img
                  alt="LinkedIn"
                  className="login-social-icon"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCViHdseOedajr8OB3c3ZKvG_Use1ksftXylKpu-BK3LNxcVU7p9vSTnOIfwEZ_6xtycZTdgZkGqfrKZRGnH_IJLeS9ipVC3iNWlUbK5PYBvF5kGQHUBjzfM2Iw3NcrO4R-I_Edwkfgegb0I8G-E3U1Clwx04mBCZ2cSxWSmRQcazrB0Y2t15XGUGIAhE8fcSCinJEwCIUEGvvkcmdAltdetkO8MBn7ycfKJ29CyqP8zHBE3bKztyczWizO2UMBGFbYaPzor7ZiJXo"
                />
                LinkedIn
              </button>
            </div>
          </form>

          {/* Footer */}
          <p className="login-footer-text">
            Chưa có tài khoản?{' '}
            <a href="/register" className="login-footer-link">Đăng ký ngay</a>
          </p>
        </div>
      </div>
    </div>
  );
}
