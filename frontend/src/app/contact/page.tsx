'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/layout/Navbar';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
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
        subject: 'General Inquiry',
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
            <h1 className="font-display-lg text-display-lg md:text-display-lg text-on-primary mb-sm">Get in Touch</h1>
            <p className="font-body-lg text-body-lg text-on-primary/80 max-w-2xl">
              We are here to help you plan your next unforgettable journey across Vietnam. Reach out to our travel experts for tailored experiences and dedicated support.
            </p>
          </div>
        </header>

        {/* Contact Content Split Layout */}
        <section className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto -mt-16 relative z-20 pb-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {/* Contact Form Side */}
            <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-natural p-md md:p-lg border border-outline-variant/30">
              <h2 className="font-headline-md text-headline-md text-primary mb-lg">Send us a Message</h2>
              <form className="space-y-md" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div className="space-y-xs">
                    <label className="font-label-md text-label-md text-outline">Name</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-md py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
                      placeholder="Your full name"
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
                      placeholder="your@email.com"
                      required
                      type="email"
                    />
                  </div>
                </div>
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-outline">Subject</label>
                  <div className="relative">
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-md py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md appearance-none"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Tour Booking Support">Tour Booking Support</option>
                      <option value="Partnership Opportunities">Partnership Opportunities</option>
                      <option value="Custom Itinerary Request">Custom Itinerary Request</option>
                      <option value="Feedback & Suggestions">Feedback & Suggestions</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                      keyboard_arrow_down
                    </span>
                  </div>
                </div>
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-outline">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-md py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
                    placeholder="How can we help you explore Vietnam?"
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
                      <span>Sending...</span>
                      <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                    </>
                  ) : submitSuccess ? (
                    <>
                      <span>Message Sent!</span>
                      <span className="material-symbols-outlined">check_circle</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
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
                  Headquarters
                </h3>
                <p className="font-body-md text-body-md opacity-90 leading-relaxed mb-base">
                  Level 12, Lotte Center Hanoi,<br />
                  54 Lieu Giai, Ba Dinh District,<br />
                  Hanoi, Vietnam
                </p>
                <div className="mt-lg pt-lg border-t border-on-primary/10 space-y-md">
                  <div className="flex items-center gap-md">
                    <div className="w-10 h-10 rounded-full bg-on-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary-fixed">call</span>
                    </div>
                    <div>
                      <p className="font-label-sm text-label-sm opacity-60">Phone Number</p>
                      <p className="font-label-md text-label-md font-bold">+84 (0) 24 3456 7890</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-md">
                    <div className="w-10 h-10 rounded-full bg-on-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary-fixed">mail</span>
                    </div>
                    <div>
                      <p className="font-label-sm text-label-sm opacity-60">Email Address</p>
                      <p className="font-label-md text-label-md font-bold">contact@viettour.com.vn</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Socials & Office Hours */}
              <div className="bg-surface-container rounded-xl p-lg border border-outline-variant/30 flex-grow">
                <h3 className="font-title-lg text-title-lg text-primary mb-md">Follow Our Journey</h3>
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
                  <h4 className="font-label-md text-label-md font-bold text-on-surface">Operating Hours</h4>
                  <div className="flex justify-between text-body-md text-on-surface-variant">
                    <span>Mon - Fri</span>
                    <span className="font-medium text-on-surface">08:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between text-body-md text-on-surface-variant">
                    <span>Sat - Sun</span>
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
              <p className="font-label-sm text-label-sm text-primary mb-xs">Find Us in Hanoi</p>
              <p className="font-body-md text-body-md text-on-surface leading-tight">Lotte Center, 54 Lieu Giai, Ba Dinh District, Hanoi 100000</p>
              <a
                className="mt-md inline-flex items-center gap-xs text-secondary font-bold text-label-md hover:underline"
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Directions <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-inverse-surface dark:bg-surface-container-lowest full-width bottom-0 mt-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop py-xl w-full max-w-max-width mx-auto">
          <div className="md:col-span-1">
            <span className="font-headline-md text-headline-md text-surface-bright mb-md block">VietTour</span>
            <p className="font-body-md text-body-md text-surface-variant dark:text-on-surface-variant mb-lg pr-md">
              Crafting extraordinary journeys across the heart of Vietnam with passion and local expertise since 2012.
            </p>
          </div>
          <div className="space-y-md">
            <h4 className="font-label-md text-label-md font-bold text-surface-bright">Quick Links</h4>
            <nav className="flex flex-col space-y-sm">
              <Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-body-md" href="/about">
                About Us
              </Link>
              <Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-body-md" href="/tours">
                Tours
              </Link>
              <Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-body-md" href="/tours">
                Destinations
              </Link>
              <Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-body-md" href="/about">
                Reviews
              </Link>
            </nav>
          </div>
          <div className="space-y-md">
            <h4 className="font-label-md text-label-md font-bold text-surface-bright">Support</h4>
            <nav className="flex flex-col space-y-sm">
              <Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-body-md" href="/contact">
                Help Center
              </Link>
              <Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-body-md" href="/tours">
                Terms of Service
              </Link>
              <Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-body-md" href="/tours">
                Privacy Policy
              </Link>
              <Link className="text-secondary-fixed dark:text-secondary font-bold hover:text-secondary-fixed-dim dark:hover:text-secondary transition-colors font-body-md" href="/contact">
                Contact
              </Link>
            </nav>
          </div>
          <div className="space-y-md">
            <h4 className="font-label-md text-label-md font-bold text-surface-bright">Newsletter</h4>
            <p className="font-body-md text-body-md text-surface-variant dark:text-on-surface-variant mb-md">Stay inspired with travel tips and exclusive deals.</p>
            <div className="flex">
              <input className="bg-surface-variant/10 border border-surface-variant/30 text-surface-bright rounded-l-lg px-md py-2 w-full focus:outline-none focus:border-secondary" placeholder="Email address" type="email" />
              <button className="bg-secondary text-on-secondary px-md rounded-r-lg hover:bg-secondary-container transition-all">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-surface-variant/10 px-margin-mobile md:px-margin-desktop py-lg w-full max-w-max-width mx-auto flex flex-col md:flex-row justify-between items-center gap-md">
          <p className="font-label-sm text-label-sm text-surface-variant dark:text-on-surface-variant">© 2024 VietTour. All rights reserved. Professional, Inviting, and Dynamic travel experiences.</p>
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
