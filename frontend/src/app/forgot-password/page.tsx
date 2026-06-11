'use client';

import React, { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  const handleResend = () => {
    // Logic gửi lại email ở đây nếu cần, hiện tại là reload state hoặc mô phỏng
    alert(`Đã gửi lại link khôi phục tới: ${email}`);
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col relative overflow-hidden justify-between">
      {/* Global Background Ornament */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-secondary-container/10 blur-[100px]"></div>
      </div>

      {/* Main Content Canvas */}
      <main className="flex-grow flex items-center justify-center p-margin-mobile md:p-margin-desktop z-10">
        <div className="w-full max-w-[480px]">
          {/* Brand Logo Anchor */}
          <div className="flex justify-center mb-xl">
            <a className="flex items-center gap-sm group" href="/">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                  travel_explore
                </span>
              </div>
              <span className="font-headline-lg text-headline-lg font-bold text-primary">VietTour</span>
            </a>
          </div>

          {!isSubmitted ? (
            /* Recovery Card */
            <div className="bg-surface-container-lowest rounded-xl natural-shadow p-lg md:p-xl border border-outline-variant/30 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Subtle Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
              {/* Header Section */}
              <div className="text-center mb-lg">
                <h1 className="font-headline-md text-headline-md text-on-surface mb-sm">Forgot password?</h1>
                <p className="font-body-md text-on-surface-variant text-sm">
                  No worries, it happens. Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>
              {/* Form Section */}
              <form className="space-y-lg" id="recovery-form" onSubmit={handleSubmit}>
                <div className="space-y-base">
                  <label className="font-label-md text-label-md text-on-surface-variant block ml-1" htmlFor="email">Email address</label>
                  <div className="relative">
                    <span className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline transition-colors ${emailFocused ? 'text-primary' : ''}`}>
                      mail
                    </span>
                    <input 
                      className="w-full pl-12 pr-4 py-3 bg-surface-bright border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body-md text-on-surface placeholder:text-outline/60 text-sm outline-none" 
                      id="email" 
                      name="email" 
                      placeholder="name@company.com" 
                      required 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                    />
                  </div>
                </div>
                {/* CTA Button */}
                <button className="w-full bg-primary text-on-primary py-3.5 px-lg rounded-lg font-bold hover:bg-primary-container transition-all active:scale-[0.98] flex items-center justify-center gap-sm shadow-sm" type="submit">
                  <span>Send Reset Link</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </form>
              {/* Back to Login Anchor */}
              <div className="mt-xl text-center">
                <a className="inline-flex items-center gap-xs font-label-md text-label-md text-primary font-semibold hover:text-secondary transition-colors group text-sm" href="/login">
                  <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-1">arrow_back</span>
                  Back to Login
                </a>
              </div>
            </div>
          ) : (
            /* Success State */
            <div className="bg-surface-container-lowest rounded-xl natural-shadow p-lg md:p-xl border border-outline-variant/30 text-center animate-in fade-in zoom-in duration-300 relative overflow-hidden">
              {/* Subtle Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-tertiary"></div>
              <div className="w-16 h-16 bg-tertiary-container/20 rounded-full flex items-center justify-center mx-auto mb-lg text-tertiary">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-sm">Check your email</h2>
              <p className="font-body-md text-on-surface-variant mb-xl text-sm">
                We've sent a password reset link to <span className="font-bold text-on-surface">{email}</span>.
              </p>
              <button 
                className="w-full bg-surface-container-high hover:bg-surface-variant text-on-surface-variant py-3 px-lg rounded-lg font-bold transition-all text-sm active:scale-[0.98]" 
                onClick={handleResend}
              >
                Didn't receive the email? Resend
              </button>
              <div className="mt-lg">
                <a className="font-label-md text-label-md text-primary font-semibold hover:text-secondary transition-colors text-sm" href="/login">
                  Return to Login
                </a>
              </div>
            </div>
          )}

          {/* Footer Note */}
          <p className="mt-xl text-center font-label-sm text-label-sm text-outline px-lg text-xs">
            © 2024 VietTour. Professional, Inviting, and Dynamic travel experiences.
          </p>
        </div>
      </main>

      {/* Decorative Bottom Graphic */}
      <div className="absolute bottom-0 left-0 w-full h-1/4 opacity-20 pointer-events-none z-0">
        <img 
          className="w-full h-full object-cover object-bottom" 
          alt="Halong Bay Dawn"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMurThoxdrLWb-DPmekVndrY0ktE6AzdfDqlpt6D0HV5vPhqq53qE38f-uU__qrrAu9MxCcg1-Qd0HO2T7F2bi8xPbQpBrwaqkVhLXQLDKPrugHmh3mz0W4f-GpLER8t2G2oIXAODvYK-hozu9o4Ob60hJe_IwOZWwcmX4aD6GA0O6FBb56fOeOK3Gn2VBamTdTrJMZry8QjRlzHXaZCxSzEqRJv9qv0tKA4sJEbxcMkOI_PqQdtq0WDX5DxTGxlNIxRseioz73Tc" 
          style={{ maskImage: "linear-gradient(to top, black, transparent)", WebkitMaskImage: "linear-gradient(to top, black, transparent)" }}
        />
      </div>
    </div>
  );
}
