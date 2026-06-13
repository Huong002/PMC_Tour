'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/layout/Navbar';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Yêu cầu chung',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: 'Yêu cầu chung',
        message: ''
      });

      // Reset success status after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="bg-background text-on-surface font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col justify-between">
      {/* TopNavBar - Shared Component */}
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <header className="relative py-24 bg-primary overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 bg-tertiary-fixed rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary-container rounded-full blur-[100px] translate-x-1/3 translate-y-1/3"></div>
          </div>
          <div className="relative z-10 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto text-center md:text-left">
            <h1 className="font-display-lg text-display-lg md:text-display-lg text-on-primary mb-sm">Liên hệ với chúng tôi</h1>
            <p className="font-body-lg text-body-lg text-on-primary/80 max-w-2xl">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn lên kế hoạch cho hành trình đáng nhớ tiếp theo tại Việt Nam. Hãy liên hệ với các chuyên gia du lịch của chúng tôi để được tư vấn thiết kế trải nghiệm riêng biệt và hỗ trợ tận tâm.
            </p>
          </div>
        </header>

        {/* Contact Content Split Layout */}
        <section className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto -mt-16 relative z-20 pb-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {/* Contact Form Side */}
            <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-natural p-md md:p-lg border border-outline-variant/30">
              <h2 className="font-headline-md text-headline-md text-primary mb-lg">Gửi Tin Nhắn Cho Chúng Tôi</h2>
              <form className="space-y-md" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div className="space-y-xs">
                    <label className="font-label-md text-label-md text-outline">Họ Tên</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-md py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
                      placeholder="Họ và tên của bạn"
                      required
                      type="text"
                    />
                  </div>
                  <div className="space-y-xs">
                    <label className="font-label-md text-label-md text-outline">Email</label>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-md py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
                      placeholder="email@cua_ban.com"
                      required
                      type="email"
                    />
                  </div>
                </div>
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-outline">Chủ đề</label>
                  <div className="relative">
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-md py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md appearance-none"
                    >
                      <option value="Yêu cầu chung">Yêu cầu chung</option>
                      <option value="Hỗ trợ đặt tour">Hỗ trợ đặt tour</option>
                      <option value="Cơ hội hợp tác">Cơ hội hợp tác</option>
                      <option value="Yêu cầu lịch trình riêng">Yêu cầu lịch trình riêng</option>
                      <option value="Phản hồi & Góp ý">Phản hồi & Góp ý</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                      keyboard_arrow_down
                    </span>
                  </div>
                </div>
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-outline">Lời nhắn</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-md py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
                    placeholder="Chúng tôi có thể giúp gì cho chuyến đi của bạn?"
                    required
                    rows={5}
                  ></textarea>
                </div>
                <button
                  disabled={isSubmitting || submitSuccess}
                  className={`w-full md:w-auto px-xl py-3 rounded-full font-bold active:scale-95 transition-all shadow-natural flex items-center justify-center gap-sm text-white ${
                    submitSuccess
                      ? 'bg-tertiary hover:bg-tertiary-container'
                      : 'bg-primary hover:bg-primary-container'
                  }`}
                  type="submit"
                >
                  {isSubmitting ? (
                    <>
                      <span>Đang gửi...</span>
                      <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                    </>
                  ) : submitSuccess ? (
                    <>
                      <span>Đã gửi lời nhắn!</span>
                      <span className="material-symbols-outlined">check_circle</span>
                    </>
                  ) : (
                    <>
                      <span>Gửi lời nhắn</span>
                      <span className="material-symbols-outlined">send</span>
                    </>
                  )}
                </button>
              </form>
            </div>
            {/* Contact Info Side */}
            <div className="lg:col-span-5 flex flex-col gap-gutter">
              {/* Address Card */}
              <div className="bg-primary text-on-primary rounded-xl shadow-natural p-lg">
                <h3 className="font-title-lg text-title-lg mb-md flex items-center gap-sm">
                  <span className="material-symbols-outlined text-secondary-fixed">location_on</span>
                  Trụ sở chính
                </h3>
                <p className="font-body-md text-body-md opacity-90 leading-relaxed mb-base">
                  Tầng 12, Lotte Center Hà Nội,<br />
                  54 Liễu Giai, Quận Ba Đình,<br />
                  Hà Nội, Việt Nam
                </p>
                <div className="mt-lg pt-lg border-t border-on-primary/10 space-y-md">
                  <div className="flex items-center gap-md">
                    <div className="w-10 h-10 rounded-full bg-on-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary-fixed">call</span>
                    </div>
                    <div>
                      <p className="font-label-sm text-label-sm opacity-60">Số điện thoại</p>
                      <p className="font-label-md text-label-md font-bold">+84 (0) 24 3456 7890</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-md">
                    <div className="w-10 h-10 rounded-full bg-on-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary-fixed">mail</span>
                    </div>
                    <div>
                      <p className="font-label-sm text-label-sm opacity-60">Địa chỉ email</p>
                      <p className="font-label-md text-label-md font-bold">contact@viettour.com.vn</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Socials & Office Hours */}
              <div className="bg-surface-container rounded-xl p-lg border border-outline-variant/30 flex-grow">
                <h3 className="font-title-lg text-title-lg text-primary mb-md">Theo dõi hành trình của chúng tôi</h3>
                <div className="flex gap-md mb-lg">
                  <Link className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all" href="/contact">
                    <span className="material-symbols-outlined">public</span>
                  </Link>
                  <Link className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all" href="/contact">
                    <span className="material-symbols-outlined">photo_camera</span>
                  </Link>
                  <Link className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all" href="/contact">
                    <span className="material-symbols-outlined">video_library</span>
                  </Link>
                </div>
                <div className="space-y-sm">
                  <h4 className="font-label-md text-label-md font-bold text-on-surface">Giờ làm việc</h4>
                  <div className="flex justify-between text-body-md text-on-surface-variant">
                    <span>Thứ 2 - Thứ 6</span>
                    <span className="font-medium text-on-surface">08:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between text-body-md text-on-surface-variant">
                    <span>Thứ 7 - Chủ nhật</span>
                    <span className="font-medium text-on-surface">09:00 - 16:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="w-full px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto mb-xl">
          <div className="relative w-full h-[450px] rounded-2xl overflow-hidden shadow-natural group">
            <img
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              alt="Hanoi map showing Ba Dinh district where Lotte Center is located"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCpzPGCphAuOJ3ygC85dZJIRlFDmjSfbI61FD0SwtumBXN1nBCC6GZGEJgvQhWdDy7hESjozPA0dftN5_-MnghRUoYEAxx5yfT3FhwzMd5PdHBOgXbGVDDuI3t1nlq5S-DYV7l3Fojo3CuBZ_n17gC9De4VjhdgDSN-TKuSkgZcfGv1gyRuMrP4xPecELURKIM8lOnnmyw46gO9368AkgIdwzVXG2Slya5ea5tSSDysgjzMmaf2zdxUjymX0KfcAJc_sCSaIFO8bk"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-lg left-lg bg-surface p-md rounded-lg shadow-natural border border-outline-variant max-w-xs">
              <p className="font-label-sm text-label-sm text-primary mb-xs">Tìm chúng tôi ở Hà Nội</p>
              <p className="font-body-md text-body-md text-on-surface leading-tight">Lotte Center, 54 Liễu Giai, Quận Ba Đình, Hà Nội 100000</p>
              <a
                className="mt-md inline-flex items-center gap-xs text-secondary font-bold text-label-md hover:underline"
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Chỉ đường <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-inverse-surface dark:bg-surface-container-lowest full-width bottom-0 mt-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop py-xl w-full max-w-max-width mx-auto">
          <div className="md:col-span-1 text-left">
            <span className="font-headline-md text-headline-md text-surface-bright mb-md block">VietTour</span>
            <p className="font-body-md text-body-md text-surface-variant dark:text-on-surface-variant mb-lg pr-md">
              Thiết kế những hành trình đặc biệt trên khắp Việt Nam với niềm đam mê và kinh nghiệm địa phương từ năm 2012.
            </p>
          </div>
          <div className="space-y-md text-left">
            <h4 className="font-label-md text-label-md font-bold text-surface-bright">Liên kết nhanh</h4>
            <nav className="flex flex-col space-y-sm">
              <Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-body-md" href="/about">
                Về chúng tôi
              </Link>
              <Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-body-md" href="/tours">
                Tour du lịch
              </Link>
              <Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-body-md" href="/tours">
                Điểm đến
              </Link>
              <Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-body-md" href="/about">
                Đánh giá
              </Link>
            </nav>
          </div>
          <div className="space-y-md text-left">
            <h4 className="font-label-md text-label-md font-bold text-surface-bright">Hỗ trợ</h4>
            <nav className="flex flex-col space-y-sm">
              <Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-body-md" href="/contact">
                Trung tâm trợ giúp
              </Link>
              <Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-body-md" href="/tours">
                Điều khoản dịch vụ
              </Link>
              <Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-body-md" href="/tours">
                Chính sách bảo mật
              </Link>
              <Link className="text-secondary-fixed dark:text-secondary font-bold hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-body-md" href="/contact">
                Liên hệ
              </Link>
            </nav>
          </div>
          <div className="space-y-md text-left">
            <h4 className="font-label-md text-label-md font-bold text-surface-bright">Bản tin</h4>
            <p className="font-body-md text-body-md text-surface-variant dark:text-on-surface-variant mb-md">Luôn cập nhật các mẹo du lịch và ưu đãi độc quyền.</p>
            <div className="flex">
              <input className="bg-surface-variant/10 border border-surface-variant/30 text-surface-bright rounded-l-lg px-md py-2 w-full focus:outline-none focus:border-secondary" placeholder="Địa chỉ email" type="email" />
              <button className="bg-secondary text-on-secondary px-md rounded-r-lg hover:bg-secondary-container transition-all">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-surface-variant/10 px-margin-mobile md:px-margin-desktop py-lg w-full max-w-max-width mx-auto flex flex-col md:flex-row justify-between items-center gap-md">
          <p className="font-label-sm text-label-sm text-surface-variant dark:text-on-surface-variant">© 2024 VietTour. Bảo lưu mọi quyền. Trải nghiệm du lịch Chuyên nghiệp, Lôi cuốn và Năng động.</p>
          <div className="flex gap-md">
            <span className="material-symbols-outlined text-surface-variant/60 cursor-pointer hover:text-secondary-fixed transition-colors">payments</span>
            <span className="material-symbols-outlined text-surface-variant/60 cursor-pointer hover:text-secondary-fixed transition-colors">credit_card</span>
            <span className="material-symbols-outlined text-surface-variant/60 cursor-pointer hover:text-secondary-fixed transition-colors">verified_user</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
