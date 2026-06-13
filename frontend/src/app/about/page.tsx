'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/layout/Navbar';

export default function AboutUs() {
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    // Get all sections inside main
    const sections = document.querySelectorAll('main section');
    sections.forEach((section) => {
      if (!section.classList.contains('relative')) { // Skip hero section with relative class
        section.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
        observer.observe(section);
      }
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="bg-background text-on-surface font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col justify-between">
      {/* TopNavBar - Shared Component */}
      <Navbar />

      <main ref={sectionsRef} className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[716px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover brightness-75"
              alt="A breathtaking panoramic view of Ha Long Bay in Vietnam at sunrise"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDV_AV0yKTLmqLDa8JPv7zlUKcw5Lfoat3wkuIc6FjlzloWe99obh-YtRyNX8lZKkn1KV3MxYWVMMhwq-hHGgaa5LaXr2bNSWMx388uGpGoNLRmW5DjFs8C8OnAalAq3X0cMdWMtsRPWz0nZTZDKvqqy84H4cfCfl9waqbCMn9uTSRqGtYsVdHngw-Qi5obI3aYMmyhX4o-TKCaLMZl6O1WWYyp6Dw5Z1OhiSuJoFytMOI3g-N-n6wpJy2ptMWMX2GFkSVp0mQXMd8"
            />
          </div>
          <div className="container mx-auto px-margin-desktop relative z-10">
            <div className="max-w-2xl">
              <h1 className="font-display-lg text-display-lg text-white mb-md drop-shadow-lg">
                Khám Phá Tâm Hồn Việt Nam
              </h1>
              <p className="font-body-lg text-body-lg text-white/90 mb-lg drop-shadow-md">
                Chúng tôi không chỉ tổ chức các chuyến đi; chúng tôi kiến tạo những hành trình đậm chất cá nhân nhằm hé mở những nhịp điệu ẩn giấu của quê hương tươi đẹp.
              </p>
              <Link href="/tours" className="inline-block bg-secondary-container hover:bg-secondary text-white font-bold py-4 px-8 rounded-lg shadow-natural transition-all active:scale-95">
                Khám Phá Di Sản Của Chúng Tôi
              </Link>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-xl px-margin-desktop max-w-max-width mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">
            <div className="space-y-md">
              <div className="inline-flex items-center px-4 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-md">
                <span className="material-symbols-outlined mr-2 text-[18px]">
                  favorite
                </span>
                Sứ mệnh của chúng tôi
              </div>
              <h2 className="font-headline-lg text-headline-lg text-primary">
                Kết nối du khách với trái tim chân thực của Việt Nam
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                VietTour được ra đời từ một nhận thức đơn giản: rằng những phần đẹp nhất của Việt Nam không phải lúc nào cũng được tìm thấy trên bản đồ. Sứ mệnh của chúng tôi là cầu nối giữa những du khách quốc tế tò mò và nền văn hóa sống động của các cộng đồng địa phương. Chúng tôi ưu tiên chiều sâu hơn khoảng cách và chất lượng hơn số lượng.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-md">
              <div className="rounded-xl overflow-hidden h-64 shadow-natural translate-y-8">
                <img
                  className="w-full h-full object-cover"
                  alt="A detailed close-up of vibrant street food being prepared in a bustling market in Hoi An"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCv8oKykOi8vi4HI3MCbsxpEMw5Xw2RbewAnAicblN_Qv16fA55wcNlQZO-78vSgBpL6Mfd7x5y2uYScF0IDvS28autrbD0qHtmrd3Lsj_91O9wSmGlgegQFETAfPakwH82DSNYQvmvUyT53aKWL8xr0RghaTQoo4nEFAq6ILsbtoXdbHE6lbIqL41MJDp3TUf2EzW9YKeyBaTSVdWPdHNM5SfL_H7pVxhP5VcyRujHmfYjceT3nZDUy___RlnXuAMHljdlojPLM9k"
                />
              </div>
              <div className="rounded-xl overflow-hidden h-64 shadow-natural">
                <img
                  className="w-full h-full object-cover"
                  alt="An elderly Vietnamese artisan meticulously weaving a traditional conical hat in a quiet village courtyard"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJ93_KenslMOBoowzXsNSxkuFpmKR9hD2kRr7SYQ0EuUVwnlu8Szm9sJ5vKONSWHgzKeH0BHc6KY243vU2yrNtj1CZ_Mm3oQwOAxo1g-zg3c-IlPmpdHBKAUwT_aWm8Bk9DzZliUz5YnyHbhHFntVTBHBOOnvyc1rmgfONCg1NoDSmiFMJZaTyHkSucPSlso9Vu9dKdZa9LAt8-uRefikemdcZ4lE5N96a-U-rS5qNDbFoM3mTtbQfkGlC1V_Dbji42frF8NnS1b0"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Bento Grid */}
        <section className="bg-surface-container-low py-xl">
          <div className="px-margin-desktop max-w-max-width mx-auto">
            <div className="text-center mb-xl">
              <h2 className="font-headline-lg text-headline-lg text-primary mb-sm">
                Những Trụ Cột Trong Cam Kết Của Chúng Tôi
              </h2>
              <p className="text-on-surface-variant font-body-md">
                Được dẫn dắt bởi sự chính trực và niềm đam mê dành cho mảnh đất quê hương.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
              {/* Reliability */}
              <div className="bg-surface-container-lowest p-lg rounded-xl shadow-natural border border-outline-variant hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-primary-fixed rounded-lg flex items-center justify-center mb-md">
                  <span className="material-symbols-outlined text-primary text-[32px]">
                    verified_user
                  </span>
                </div>
                <h3 className="font-title-lg text-title-lg text-primary mb-sm">Đáng tin cậy</h3>
                <p className="text-on-surface-variant font-body-md">
                  Sự chính xác trong khâu hậu cần và trung thực trong giao tiếp. Chúng tôi quản lý từng chi tiết để bạn có thể tập trung vào trải nghiệm, được hỗ trợ 24/7 từ đội ngũ tại địa phương.
                </p>
              </div>
              {/* Local Expertise */}
              <div className="bg-surface-container-lowest p-lg rounded-xl shadow-natural border border-outline-variant hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-secondary-fixed rounded-lg flex items-center justify-center mb-md">
                  <span className="material-symbols-outlined text-secondary text-[32px]">
                    travel_explore
                  </span>
                </div>
                <h3 className="font-title-lg text-title-lg text-primary mb-sm">Chuyên gia bản địa</h3>
                <p className="text-on-surface-variant font-body-md">
                  Hướng dẫn viên của chúng tôi là những người kể chuyện từ chính vùng đất họ dẫn dắt. Họ chia sẻ các sắc thái, truyền thuyết và những điểm đến bí mật mà chỉ người bản địa mới biết.
                </p>
              </div>
              {/* Sustainable Travel */}
              <div className="bg-surface-container-lowest p-lg rounded-xl shadow-natural border border-outline-variant hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-tertiary-fixed rounded-lg flex items-center justify-center mb-md">
                  <span className="material-symbols-outlined text-tertiary text-[32px]">
                    eco
                  </span>
                </div>
                <h3 className="font-title-lg text-title-lg text-primary mb-sm">Du lịch bền vững</h3>
                <p className="text-on-surface-variant font-body-md">
                  Chúng tôi cam kết bảo tồn vẻ đẹp tự nhiên của Việt Nam và hỗ trợ nền kinh tế địa phương thông qua các quan hệ đối tác có ý thức sinh thái và thực hành thương mại công bằng.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Timeline */}
        <section className="py-xl px-margin-desktop max-w-max-width mx-auto">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-xl text-center">
            Hành Trình Của Chúng Tôi
          </h2>
          <div className="relative border-l-2 border-primary-container ml-8 md:ml-0 md:flex md:border-l-0 md:border-t-2 md:pt-8 md:justify-between space-y-xl md:space-y-0">
            {/* 2012 */}
            <div className="relative pl-8 md:pl-0 md:w-1/4">
              <div className="absolute -left-[9px] top-0 md:left-auto md:-top-[9px] md:right-auto w-4 h-4 rounded-full bg-primary ring-4 ring-primary-fixed"></div>
              <span className="block font-bold text-primary font-headline-md mb-2">2012</span>
              <h4 className="font-title-lg text-title-lg mb-2">Khởi đầu khiêm tốn</h4>
              <p className="text-on-surface-variant font-body-md">
                VietTour ra mắt với tư cách là một đại lý đi bộ trekking nhỏ do gia đình tự điều hành tại Sa Pa, tập trung vào trải nghiệm homestay bản địa.
              </p>
            </div>
            {/* 2016 */}
            <div className="relative pl-8 md:pl-0 md:w-1/4">
              <div className="absolute -left-[9px] top-0 md:left-auto md:-top-[9px] md:right-auto w-4 h-4 rounded-full bg-primary ring-4 ring-primary-fixed"></div>
              <span className="block font-bold text-primary font-headline-md mb-2">2016</span>
              <h4 className="font-title-lg text-title-lg mb-2">Mở rộng toàn quốc</h4>
              <p className="text-on-surface-variant font-body-md">
                Chúng tôi mở rộng hoạt động trên toàn bộ 63 tỉnh thành, thành lập các trung tâm hậu cần chuyên dụng tại Hà Nội và Đà Nẵng.
              </p>
            </div>
            {/* 2020 */}
            <div className="relative pl-8 md:pl-0 md:w-1/4">
              <div className="absolute -left-[9px] top-0 md:left-auto md:-top-[9px] md:right-auto w-4 h-4 rounded-full bg-primary ring-4 ring-primary-fixed"></div>
              <span className="block font-bold text-primary font-headline-md mb-2">2020</span>
              <h4 className="font-title-lg text-title-lg mb-2">Chuyển đổi số</h4>
              <p className="text-on-surface-variant font-body-md">
                Ra mắt nền tảng đặt tour thông minh cho phép du khách tùy chỉnh lịch trình với tình trạng chỗ trống theo thời gian thực.
              </p>
            </div>
            {/* 2024 */}
            <div className="relative pl-8 md:pl-0 md:w-1/4">
              <div className="absolute -left-[9px] top-0 md:left-auto md:-top-[9px] md:right-auto w-4 h-4 rounded-full bg-primary ring-4 ring-primary-fixed"></div>
              <span className="block font-bold text-primary font-headline-md mb-2">2024</span>
              <h4 className="font-title-lg text-title-lg mb-2">Tiên phong bền vững</h4>
              <p className="text-on-surface-variant font-body-md">
                Cam kết tổ chức các tour du lịch 100% không dùng đồ nhựa và triển khai sáng kiến trồng rừng 'Green Vietnam'.
              </p>
            </div>
          </div>
        </section>

        {/* Meet the Team */}
        <section className="py-xl bg-surface-container-high overflow-hidden">
          <div className="px-margin-desktop max-w-max-width mx-auto">
            <div className="mb-xl">
              <h2 className="font-headline-lg text-headline-lg text-primary mb-sm">
                Những Gương Mặt Của VietTour
              </h2>
              <p className="text-on-surface-variant font-body-md">
                Những người yêu thích du lịch đầy đam mê, những chuyên gia điều hành dày dặn kinh nghiệm và những người kể chuyện bản địa.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
              {/* Team Member 1 */}
              <div className="group">
                <div className="aspect-[3/4] rounded-xl overflow-hidden mb-md shadow-natural border border-outline-variant relative">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt="Minh Nguyen - Founder & CEO of VietTour"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuChGXfUfyjrc-dMPcwAIzmtMFycHIDxWHc2SPUOsOxJ1_xgh7fkI7i7FHFKR1kEOnYrgLOV5Jt54JFsks0N2rlR2G0B0qAzqwBF2BHdaffeBEwILpcPwEQBUaBYZY5k8DWG5ZH2H89jIjiqBXYf1VJwxWm3cveSSA7nrqf7-K5hJYolq6vV7QjZLAC8ze4i9uNR353xLQNlCmjYPp1mWrNL2BLU87xCpjFR-M8NxqKp5WQggEfseHoEBXckT76z2qHxMpRcnXrPr2c"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-md">
                    <p className="text-white font-label-sm italic">
                      "Du lịch là thứ duy nhất bạn mua mà giúp bạn trở nên giàu có hơn."
                    </p>
                  </div>
                </div>
                <h4 className="font-title-lg text-title-lg text-primary">Minh Nguyễn</h4>
                <p className="text-on-surface-variant font-label-md">Nhà sáng lập & Giám đốc điều hành</p>
              </div>
              {/* Team Member 2 */}
              <div className="group">
                <div className="aspect-[3/4] rounded-xl overflow-hidden mb-md shadow-natural border border-outline-variant relative">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt="Lan Tran - Head of Operations"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUP1gzhcH0CRxURFziOS2WAh1i_N3kuelA1EmP6topekczBYgM-cpDPsohrE0ultE25Ti9_S1x_kUpZEQ6N5es_FYd7TZpw3p57RVxHibTrCf5yMEBoZW11wNssw4mxy-8ZLP-6FJTWtqd049OqjbAFpZMC4ARbcBIFNWEKL7voNtapPnDArw7hiEexOrnz9wqnL-_ZYh-Wr5QPuShkX3hMlbKP7TqUsthcZGqBwYrX5i3VDkIB2w0rUEYMleG-cEiAt-eIY-4niw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-md">
                    <p className="text-white font-label-sm italic">
                      "Hậu cần nên được ẩn đi; trải nghiệm mới là thứ không thể nào quên."
                    </p>
                  </div>
                </div>
                <h4 className="font-title-lg text-title-lg text-primary">Lan Trần</h4>
                <p className="text-on-surface-variant font-label-md">Trưởng bộ phận Vận hành</p>
              </div>
              {/* Team Member 3 */}
              <div className="group">
                <div className="aspect-[3/4] rounded-xl overflow-hidden mb-md shadow-natural border border-outline-variant relative">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt="Tuan Pham - Lead Travel Curator"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJy3u-i7zL9J0HAuMwNPqBSHZ1G3yi8mHq1b2sc8OV3jK5SPujD1956vHlacr7JA8Zf84o_QhqIdm7hKFnyNiNoRH9Zv9VntPrhObf3B5hyXF4BtqY21v78bHpLrmXidMP_5--J-yDlrbjydVC-S_YT-elgk_v7xDLteDYoRVxeBaSa-GxpATxH-iJDvb3nvNjLiJFVQCp7LD3VHHRMy5epAazLmt053fg0fQr3e0n2RLQu8gfU0ILGBZs999r60kZzKmW4nw62wk"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-md">
                    <p className="text-white font-label-sm italic">
                      "Mỗi bản làng đều có một câu chuyện. Tôi ở đây để giúp bạn lắng nghe câu chuyện đó."
                    </p>
                  </div>
                </div>
                <h4 className="font-title-lg text-title-lg text-primary">Tuấn Phạm</h4>
                <p className="text-on-surface-variant font-label-md">Trưởng nhóm Thiết kế Tour</p>
              </div>
              {/* Team Member 4 */}
              <div className="group">
                <div className="aspect-[3/4] rounded-xl overflow-hidden mb-md shadow-natural border border-outline-variant relative">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt="Linh Do - Customer Success"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDseiY5wpt6MvjcmUaE7Tgc89j12zYBLUMucwThOyMsFE757AgAzAEwmIa-JQsmvnssqpwStyAEyDbOecfitsRDdNobBKPUn57vxy0S6LjfaM5sZv2chgWy8NQCJe6uoF0APfMGNai1bHOaSrHuEXsLTqPvrefX0tDtX40i8RcuwufQF-X9VjgGM64h1AyHhz79W-4uS0p4or0Da5ATZeGNmiFH7Uf6hI4Z1D1Qj6_XcxBM2CVVcu-NVX6gUE2b6Yhu5xw43truKqE"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-md">
                    <p className="text-white font-label-sm italic">
                      "Sự thoải mái và niềm vui của bạn là thước đo thành công của chúng tôi."
                    </p>
                  </div>
                </div>
                <h4 className="font-title-lg text-title-lg text-primary">Linh Đỗ</h4>
                <p className="text-on-surface-variant font-label-md">Hỗ trợ khách hàng</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-inverse-surface dark:bg-surface-container-lowest full-width bottom-0 mt-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop py-xl w-full max-w-max-width mx-auto">
          <div className="space-y-md text-left">
            <span className="font-headline-md text-headline-md text-surface-bright font-bold">VietTour</span>
            <p className="font-body-md text-surface-variant dark:text-on-surface-variant">
              © 2024 VietTour. Bảo lưu mọi quyền. Trải nghiệm du lịch Chuyên nghiệp, Lôi cuốn và Năng động.
            </p>
          </div>
          <div className="space-y-md text-left">
            <h5 className="text-on-primary dark:text-primary font-bold">Khám phá</h5>
            <ul className="space-y-sm">
              <li>
                <Link
                  className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-label-sm"
                  href="/tours"
                >
                  Tour du lịch
                </Link>
              </li>
              <li>
                <Link
                  className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-label-sm"
                  href="/tours"
                >
                  Điểm đến
                </Link>
              </li>
              <li>
                <Link
                  className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-label-sm"
                  href="/tours"
                >
                  Ưu đãi
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-md text-left">
            <h5 className="text-on-primary dark:text-primary font-bold">Công ty</h5>
            <ul className="space-y-sm">
              <li>
                <Link className="text-secondary-fixed dark:text-secondary font-bold font-label-sm" href="/about">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-label-sm"
                  href="/contact"
                >
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link
                  className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-label-sm"
                  href="/tours"
                >
                  Điều khoản dịch vụ
                </Link>
              </li>
              <li>
                <Link
                  className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-label-sm"
                  href="/tours"
                >
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-md text-left">
            <h5 className="text-on-primary dark:text-primary font-bold">Hỗ trợ</h5>
            <ul className="space-y-sm">
              <li>
                <Link
                  className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-label-sm"
                  href="/contact"
                >
                  Trung tâm trợ giúp
                </Link>
              </li>
              <li>
                <Link
                  className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-label-sm"
                  href="/tours"
                >
                  Hỏi đáp (FAQs)
                </Link>
              </li>
            </ul>
            <div className="flex space-x-md mt-4">
              <span className="material-symbols-outlined text-surface-bright cursor-pointer">
                face
              </span>
              <span className="material-symbols-outlined text-surface-bright cursor-pointer">
                share
              </span>
              <span className="material-symbols-outlined text-surface-bright cursor-pointer">
                mail
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
