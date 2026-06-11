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
                Discover the Soul of Vietnam
              </h1>
              <p className="font-body-lg text-body-lg text-white/90 mb-lg drop-shadow-md">
                We don't just organize trips; we curate deeply personal journeys that reveal the hidden rhythms of our beautiful homeland.
              </p>
              <Link href="/tours" className="inline-block bg-secondary-container hover:bg-secondary text-white font-bold py-4 px-8 rounded-lg shadow-natural transition-all active:scale-95">
                Explore Our Heritage
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
                Our Mission
              </div>
              <h2 className="font-headline-lg text-headline-lg text-primary">
                Connecting travelers with the authentic heart of Vietnam
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                VietTour was born from a simple realization: that the most beautiful parts of Vietnam aren't always found on a map. Our mission is to bridge the gap between curious global travelers and the vibrant, living cultures of our local communities. We prioritize depth over distance and quality over quantity.
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
                The Pillars of Our Promise
              </h2>
              <p className="text-on-surface-variant font-body-md">
                Guided by integrity and a passion for our land.
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
                <h3 className="font-title-lg text-title-lg text-primary mb-sm">Reliability</h3>
                <p className="text-on-surface-variant font-body-md">
                  Precision in logistics and honesty in communication. We manage every detail so you can focus on the experience, backed by 24/7 on-ground support.
                </p>
              </div>
              {/* Local Expertise */}
              <div className="bg-surface-container-lowest p-lg rounded-xl shadow-natural border border-outline-variant hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-secondary-fixed rounded-lg flex items-center justify-center mb-md">
                  <span className="material-symbols-outlined text-secondary text-[32px]">
                    travel_explore
                  </span>
                </div>
                <h3 className="font-title-lg text-title-lg text-primary mb-sm">Local Expertise</h3>
                <p className="text-on-surface-variant font-body-md">
                  Our guides are storytellers from the regions they lead. They share the nuances, the legends, and the secret spots only a local could know.
                </p>
              </div>
              {/* Sustainable Travel */}
              <div className="bg-surface-container-lowest p-lg rounded-xl shadow-natural border border-outline-variant hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-tertiary-fixed rounded-lg flex items-center justify-center mb-md">
                  <span className="material-symbols-outlined text-tertiary text-[32px]">
                    eco
                  </span>
                </div>
                <h3 className="font-title-lg text-title-lg text-primary mb-sm">Sustainable Travel</h3>
                <p className="text-on-surface-variant font-body-md">
                  We are committed to preserving Vietnam's natural beauty and supporting local economies through eco-conscious partnerships and fair trade practices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Timeline */}
        <section className="py-xl px-margin-desktop max-w-max-width mx-auto">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-xl text-center">
            Our Journey
          </h2>
          <div className="relative border-l-2 border-primary-container ml-8 md:ml-0 md:flex md:border-l-0 md:border-t-2 md:pt-8 md:justify-between space-y-xl md:space-y-0">
            {/* 2012 */}
            <div className="relative pl-8 md:pl-0 md:w-1/4">
              <div className="absolute -left-[9px] top-0 md:left-auto md:-top-[9px] md:right-auto w-4 h-4 rounded-full bg-primary ring-4 ring-primary-fixed"></div>
              <span className="block font-bold text-primary font-headline-md mb-2">2012</span>
              <h4 className="font-title-lg text-title-lg mb-2">The Humble Start</h4>
              <p className="text-on-surface-variant font-body-md">
                VietTour launches as a small family-run trekking agency in Sapa, focused on authentic homestay experiences.
              </p>
            </div>
            {/* 2016 */}
            <div className="relative pl-8 md:pl-0 md:w-1/4">
              <div className="absolute -left-[9px] top-0 md:left-auto md:-top-[9px] md:right-auto w-4 h-4 rounded-full bg-primary ring-4 ring-primary-fixed"></div>
              <span className="block font-bold text-primary font-headline-md mb-2">2016</span>
              <h4 className="font-title-lg text-title-lg mb-2">Nationwide Expansion</h4>
              <p className="text-on-surface-variant font-body-md">
                We expanded our operations across all 63 provinces, establishing dedicated logistics hubs in Hanoi and Da Nang.
              </p>
            </div>
            {/* 2020 */}
            <div className="relative pl-8 md:pl-0 md:w-1/4">
              <div className="absolute -left-[9px] top-0 md:left-auto md:-top-[9px] md:right-auto w-4 h-4 rounded-full bg-primary ring-4 ring-primary-fixed"></div>
              <span className="block font-bold text-primary font-headline-md mb-2">2020</span>
              <h4 className="font-title-lg text-title-lg mb-2">Digital Transformation</h4>
              <p className="text-on-surface-variant font-body-md">
                Launching our smart booking platform to allow travelers to customize their itineraries with real-time availability.
              </p>
            </div>
            {/* 2024 */}
            <div className="relative pl-8 md:pl-0 md:w-1/4">
              <div className="absolute -left-[9px] top-0 md:left-auto md:-top-[9px] md:right-auto w-4 h-4 rounded-full bg-primary ring-4 ring-primary-fixed"></div>
              <span className="block font-bold text-primary font-headline-md mb-2">2024</span>
              <h4 className="font-title-lg text-title-lg mb-2">Pioneering Sustainability</h4>
              <p className="text-on-surface-variant font-body-md">
                Committed to 100% plastic-free tours and launching the 'Green Vietnam' reforestation initiative.
              </p>
            </div>
          </div>
        </section>

        {/* Meet the Team */}
        <section className="py-xl bg-surface-container-high overflow-hidden">
          <div className="px-margin-desktop max-w-max-width mx-auto">
            <div className="mb-xl">
              <h2 className="font-headline-lg text-headline-lg text-primary mb-sm">
                The Faces of VietTour
              </h2>
              <p className="text-on-surface-variant font-body-md">
                Passionate travelers, expert fixers, and local storytellers.
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
                      "Travel is the only thing you buy that makes you richer."
                    </p>
                  </div>
                </div>
                <h4 className="font-title-lg text-title-lg text-primary">Minh Nguyen</h4>
                <p className="text-on-surface-variant font-label-md">Founder & CEO</p>
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
                      "Logistics should be invisible; the experience should be unforgettable."
                    </p>
                  </div>
                </div>
                <h4 className="font-title-lg text-title-lg text-primary">Lan Tran</h4>
                <p className="text-on-surface-variant font-label-md">Head of Operations</p>
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
                      "Every village has a story. I'm just here to help you hear it."
                    </p>
                  </div>
                </div>
                <h4 className="font-title-lg text-title-lg text-primary">Tuan Pham</h4>
                <p className="text-on-surface-variant font-label-md">Lead Travel Curator</p>
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
                      "Your comfort and joy are the metrics of our success."
                    </p>
                  </div>
                </div>
                <h4 className="font-title-lg text-title-lg text-primary">Linh Do</h4>
                <p className="text-on-surface-variant font-label-md">Customer Success</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-inverse-surface dark:bg-surface-container-lowest full-width bottom-0 mt-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop py-xl w-full max-w-max-width mx-auto">
          <div className="space-y-md">
            <span className="font-headline-md text-headline-md text-surface-bright font-bold">VietTour</span>
            <p className="font-body-md text-surface-variant dark:text-on-surface-variant">
              © 2024 VietTour. All rights reserved. Professional, Inviting, and Dynamic travel experiences.
            </p>
          </div>
          <div className="space-y-md">
            <h5 className="text-on-primary dark:text-primary font-bold">Explore</h5>
            <ul className="space-y-sm">
              <li>
                <Link
                  className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-label-sm"
                  href="/tours"
                >
                  Tours
                </Link>
              </li>
              <li>
                <Link
                  className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-label-sm"
                  href="/tours"
                >
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-label-sm"
                  href="/tours"
                >
                  Promotions
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-md">
            <h5 className="text-on-primary dark:text-primary font-bold">Company</h5>
            <ul className="space-y-sm">
              <li>
                <Link className="text-secondary-fixed dark:text-secondary font-bold font-label-sm" href="/about">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-label-sm"
                  href="/contact"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-label-sm"
                  href="/tours"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-label-sm"
                  href="/tours"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-md">
            <h5 className="text-on-primary dark:text-primary font-bold">Support</h5>
            <ul className="space-y-sm">
              <li>
                <Link
                  className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-label-sm"
                  href="/contact"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-label-sm"
                  href="/tours"
                >
                  FAQs
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
