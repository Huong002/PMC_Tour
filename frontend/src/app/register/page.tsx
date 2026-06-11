'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isRegistering } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    if (!termsAccepted) {
      setErrorMsg('Bạn phải đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.');
      return;
    }

    try {
      await register({
        username: email,
        password,
        fullName,
        email,
        phone,
      });
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.'
      );
    }
  };

  return (
    <div className="register-page-wrapper">
      {/* Left Side: Brand Visual */}
      <div className="register-left">
        <img
          alt="Halong Bay Sunset"
          className="login-bg-img"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjDDTI2iQsJgsJQ86w1BwZxx6_gldMV1dCPqLGSt0rYvfBJGhFBxqkvrs5PzlXX0_7vx9G7DfKfPIy5nr-7oclPShuBs-0Vrz3EacUAT7b_zCltbENEJQpWxVuR0cdXZh4_rdMCEAg9_9i8Is1hZXptWa-WEsf_5WKCKPPCZOCz-gxqprh2mweN9ETxzYxC5xPN7_ojlWc-r3tlLvi7EN8bfzuXoSsEfqGUAIttdMxNyx55USvooRcOzg2XXVXXMI0DiX6BuCnTIc"
        />
        <div className="login-left-overlay" />
        <div className="login-left-content">
          <div className="login-brand">
            <div className="login-brand-icon">
              <span className="material-symbols-outlined">explore</span>
            </div>
            <span className="login-brand-name">VietTour</span>
          </div>
          <h1 className="login-headline">Tham gia cộng đồng khám phá Việt Nam.</h1>
          <p className="login-subtext">
            Trải nghiệm những viên ngọc ẩn của Việt Nam với sự kết hợp hoàn hảo giữa
            sang trọng và chuyên môn địa phương. Đăng ký ngay hôm nay.
          </p>
          <div className="login-badges">
            <div className="login-badge">
              <span className="material-symbols-outlined">verified</span>
              <span>Chuyên nghiệp</span>
            </div>
            <div className="login-badge">
              <span className="material-symbols-outlined">favorite</span>
              <span>Đáng tin cậy</span>
            </div>
            <div className="login-badge">
              <span className="material-symbols-outlined">bolt</span>
              <span>Năng động</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Registration Form */}
      <div className="register-right">
        <div className="register-form-container">
          {/* Mobile Brand */}
          <div className="login-mobile-brand">
            <div className="login-brand-icon" style={{ background: 'var(--color-primary)', color: 'white' }}>
              <span className="material-symbols-outlined">explore</span>
            </div>
            <span className="login-brand-name" style={{ color: 'var(--color-primary)' }}>VietTour</span>
          </div>

          <div className="login-form-header">
            <h2 className="login-form-title">Tạo tài khoản</h2>
            <p className="login-form-subtitle">Bắt đầu hành trình khám phá cùng chúng tôi.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {errorMsg && (
              <div className="login-error">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
                {errorMsg}
              </div>
            )}

            {/* Full Name */}
            <div className="login-field">
              <label htmlFor="full_name" className="login-label">Họ và tên</label>
              <div className="login-input-wrapper">
                <span className="material-symbols-outlined login-input-icon">person</span>
                <input
                  id="full_name"
                  type="text"
                  className="login-input"
                  placeholder="Nhập họ và tên đầy đủ"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="login-field">
              <label htmlFor="email" className="login-label">Địa chỉ Email</label>
              <div className="login-input-wrapper">
                <span className="material-symbols-outlined login-input-icon">mail</span>
                <input
                  id="email"
                  type="email"
                  className="login-input"
                  placeholder="email@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="login-field">
              <label htmlFor="phone" className="login-label">Số điện thoại</label>
              <div className="login-input-wrapper">
                <span className="material-symbols-outlined login-input-icon">call</span>
                <input
                  id="phone"
                  type="tel"
                  className="login-input"
                  placeholder="+84 000 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <label htmlFor="password" className="login-label">Mật khẩu</label>
              <div className="login-input-wrapper">
                <span className="material-symbols-outlined login-input-icon">lock</span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
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

            {/* Confirm Password */}
            <div className="login-field">
              <label htmlFor="confirm_password" className="login-label">Xác nhận mật khẩu</label>
              <div className="login-input-wrapper">
                <span className="material-symbols-outlined login-input-icon">lock_reset</span>
                <input
                  id="confirm_password"
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Terms */}
            <div className="login-remember" style={{ alignItems: 'flex-start', gap: '10px' }}>
              <input
                id="terms"
                type="checkbox"
                className="login-checkbox"
                style={{ marginTop: '2px' }}
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <label htmlFor="terms" className="login-remember-label">
                Tôi đồng ý với{' '}
                <Link href="/tours" className="login-footer-link">Điều khoản dịch vụ</Link>
                {' '}và{' '}
                <Link href="/tours" className="login-footer-link">Chính sách bảo mật</Link>.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={isRegistering}
            >
              {isRegistering ? (
                <>
                  <span className="login-spinner" />
                  Đang đăng ký...
                </>
              ) : (
                <>
                  Đăng ký tài khoản
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="login-divider">
              <div className="login-divider-line" />
              <span className="login-divider-text">Hoặc đăng ký với</span>
              <div className="login-divider-line" />
            </div>

            {/* Social */}
            <div className="login-social-grid">
              <button type="button" className="login-social-btn">
                <img
                  alt="Google"
                  className="login-social-icon"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuArt6MAmAkbk47iK5hMQ-Moazak5qAIMw7xBydF7MlAEZyAs7FU8vkNY-ZwnwjvXPcMwY6WgG-hcsjCHNdrIyVSjDq0FiR9-4FqZtJbzmGoiqjY-TxOlzI8e0V7DPbN0liIERCvUu-gXRXQwchcrCcmcfCNfdQ_YJN9QZ00MDy3aEi53l2ZiKKCgQFeyvZwCx4u7kYNl8bfCcbwI8LR8cE-1V4LcPRvn1m0QiR5OWuYjVfMxSo2pXsMQYXOoVhPnZroz27tgr2T74k"
                />
                Google
              </button>
              <button type="button" className="login-social-btn">
                <img
                  alt="Facebook"
                  className="login-social-icon"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-Hj3e3Z0DGIBi1rUr_l_dnB1k9CQ4B_-Btx4dehiDd-wi8OEOQdWcAoMVnM9PDHQ86NoI-Vg9T_VJNzEjEPDw1_oLGNKSdvojwUgk13mRUXrMvysAKFjzrWvEc_wuMWZZM0aDZdlp_zlYMbvW2o_KBPcs6ZeNWkhTXFce2YIn7Qv0rP3Ji623AGFkL0L2FHcHe5afj_h1wUABCtZ0Duj2n-bUjSnj_VGNnhfQnVHRFeOxKKUSCJXwoOjalTkIGWCx4-y0M4AfZi8"
                />
                Facebook
              </button>
            </div>
          </form>

          {/* Footer */}
          <p className="login-footer-text">
            Đã có tài khoản?{' '}
            <a href="/login" className="login-footer-link">Đăng nhập</a>
          </p>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <a
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-outline)',
                textDecoration: 'none',
                fontFamily: "'Inter', sans-serif",
                transition: 'color 0.2s',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
              Quay lại trang chủ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
