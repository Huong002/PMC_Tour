'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Navbar } from '../../components/layout/Navbar';
import api from '../../services/api';

type ApiTour = {
  id: number; name: string; slug: string; location: string;
  priceAdult: number; salePrice: number | null; shortDescription: string;
  durationDays: number; durationNights: number;
  images: { imageUrl: string }[];
};

type DisplayTour = {
  id: number; name: string; duration: string; rating: string;
  price: number; location: string; image: string; description: string;
};

function mapTour(t: ApiTour): DisplayTour {
  const ratings: Record<string, string> = {
    '1': '4.9 (120 reviews)', '2': '4.8 (85 reviews)', '3': '4.9 (92 reviews)',
    '4': '4.5 (33 reviews)', '5': '4.6 (47 reviews)', '6': '4.8 (92 reviews)',
    '7': '5.0 (58 reviews)', '8': '4.7 (58 reviews)',
  };
  return {
    id: t.id,
    name: t.name,
    duration: `${t.durationDays} Day${t.durationDays > 1 ? 's' : ''}`,
    rating: ratings[t.id] || '4.9 (50 reviews)',
    price: t.salePrice ?? t.priceAdult,
    location: t.location.split(',')[0].trim() || t.location,
    image: t.images?.[0]?.imageUrl || '',
    description: t.shortDescription || '',
  };
}

export default function ToursPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [priceRange, setPriceRange] = useState('ALL');

  const { data: apiData, isLoading } = useQuery({
    queryKey: ['publicTours', searchTerm, selectedLocation, priceRange],
    queryFn: async () => {
      const params: Record<string, any> = { Page: 1, PageSize: 50 };
      if (searchTerm) params.SearchTerm = searchTerm;
      const res = await api.get('/Tours', { params });
      return (res.data?.data?.items || []) as ApiTour[];
    },
  });

  let tours: DisplayTour[] = [];
  if (apiData) {
    tours = apiData.map(mapTour).filter((t) => {
      if (selectedLocation !== 'ALL' && t.location !== selectedLocation) return false;
      if (priceRange === 'UNDER_200' && t.price >= 200) return false;
      if (priceRange === '200_500' && (t.price < 200 || t.price > 500)) return false;
      if (priceRange === 'OVER_500' && t.price <= 500) return false;
      return true;
    });
  }

  return (
    <div className="bg-surface text-on-surface font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-xl w-full">
        <div className="mb-xl text-left">
          <span className="text-secondary font-bold text-label-sm uppercase tracking-widest block mb-xs">Curated Voyages</span>
          <h1 className="font-display-lg text-display-lg text-primary font-extrabold tracking-tight">Explore Vietnam's Wonders</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Find and book your next dream travel experience, customized for comfort and cultural immersion.</p>
        </div>

        {/* Mobile Filters */}
        <div className="lg:hidden mb-lg glass-panel p-md rounded-2xl border border-white/20 shadow-soft flex flex-col gap-sm">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-surface text-body-md outline-none" placeholder="Search tours..." type="text" />
          </div>
          <div className="flex gap-sm">
            <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}
              className="flex-1 px-md py-2 rounded-xl border border-outline-variant bg-surface text-label-md">
              <option value="ALL">All Locations</option>
              <option value="Ha Long">Ha Long Bay</option>
              <option value="Da Nang">Da Nang</option>
              <option value="Sapa">Sapa</option>
              <option value="Hoi An">Hoi An</option>
              <option value="Ho Chi Minh">Ho Chi Minh</option>
            </select>
            <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}
              className="flex-1 px-md py-2 rounded-xl border border-outline-variant bg-surface text-label-md">
              <option value="ALL">Any Budget</option>
              <option value="UNDER_200">Under $200</option>
              <option value="200_500">$200 - $500</option>
              <option value="OVER_500">Over $500</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-xl items-start justify-between">
          {/* Desktop Filters */}
          <aside className="w-full lg:w-3/12 lg:block hidden sticky top-24 glass-panel p-lg rounded-3xl border border-white/20 shadow-glass space-y-md text-left shrink-0">
            <div className="border-b border-outline-variant pb-md">
              <h3 className="font-headline-md text-primary font-bold">Filter Options</h3>
              <p className="text-xs text-on-surface-variant">Refine your travel search</p>
            </div>
            <div className="space-y-xs">
              <label className="block text-xs font-bold text-primary uppercase tracking-wider">Search</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface/50 text-body-md outline-none transition-all" placeholder="Keywords..." type="text" />
              </div>
            </div>
            <div className="space-y-xs">
              <label className="block text-xs font-bold text-primary uppercase tracking-wider">Location</label>
              <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="w-full px-md py-3 rounded-2xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface/50 text-body-md outline-none transition-all">
                <option value="ALL">All Locations</option>
                <option value="Ha Long">Ha Long Bay</option>
                <option value="Da Nang">Da Nang</option>
                <option value="Sapa">Sapa</option>
                <option value="Hoi An">Hoi An</option>
                <option value="Ho Chi Minh">Ho Chi Minh City</option>
              </select>
            </div>
            <div className="space-y-xs">
              <label className="block text-xs font-bold text-primary uppercase tracking-wider">Price Range</label>
              <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="w-full px-md py-3 rounded-2xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface/50 text-body-md outline-none transition-all">
                <option value="ALL">Any Budget</option>
                <option value="UNDER_200">Under $200</option>
                <option value="200_500">$200 - $500</option>
                <option value="OVER_500">Over $500</option>
              </select>
            </div>
          </aside>

          {/* Tour Grid */}
          <div className="w-full lg:w-8/12 flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
              {isLoading ? (
                <div className="col-span-3 py-2xl text-center text-on-surface-variant">Loading tours...</div>
              ) : tours.length > 0 ? (
                tours.map((tour, index) => {
                  const isFeatured = index === 0 && tours.length > 1;
                  return (
                    <div key={tour.id}
                      className={`group bg-white rounded-3xl overflow-hidden border border-outline-variant/30 shadow-soft hover-lift flex flex-col justify-between ${isFeatured ? 'md:col-span-2 flex-col md:flex-row' : ''}`}>
                      <div className={`relative overflow-hidden shrink-0 ${isFeatured ? 'h-64 md:h-full md:w-1/2 aspect-[4/3] md:aspect-auto' : 'h-64'}`}>
                        <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" alt={tour.name} src={tour.image} />
                        <div className="absolute top-4 left-4 flex flex-col gap-xs items-start">
                          <span className="bg-primary/90 backdrop-blur-md text-white font-label-sm text-label-sm px-3 py-1 rounded-full border border-white/20">{tour.duration}</span>
                          {tour.price > 350 && <span className="bg-secondary text-white font-label-sm text-label-sm px-3 py-1 rounded-full uppercase tracking-wider font-extrabold text-[9px] neon-glow-secondary">Best Seller</span>}
                          {tour.price <= 200 && <span className="bg-tertiary-container/95 text-on-tertiary-container font-label-sm text-label-sm px-3 py-1 rounded-full uppercase tracking-wider font-extrabold text-[9px] neon-glow-tertiary">Best Deal</span>}
                        </div>
                      </div>
                      <div className="p-lg flex flex-col justify-between flex-grow text-left">
                        <div className="space-y-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-outline uppercase font-extrabold tracking-wider">{tour.location}</span>
                            <div className="flex items-center gap-xs text-secondary font-bold">
                              <span className="material-symbols-outlined text-[16px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                              <span className="text-label-md">{tour.rating.split(' ')[0]}</span>
                            </div>
                          </div>
                          <h3 className="font-headline-md text-headline-md text-primary font-bold line-clamp-2 leading-snug group-hover:text-secondary transition-colors duration-300">{tour.name}</h3>
                          <p className="text-on-surface-variant font-body-md text-sm line-clamp-3 leading-relaxed">{tour.description}</p>
                        </div>
                        <div className="mt-lg pt-md border-t border-outline-variant/30 flex justify-between items-center relative h-12 overflow-hidden">
                          <div className="transition-all duration-300 group-hover:translate-y-[-2px]">
                            <span className="text-[10px] text-outline block uppercase tracking-wider font-semibold">From</span>
                            <span className="font-extrabold text-headline-md text-primary">${tour.price}</span>
                          </div>
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-end">
                            <Link href={`/tours/${tour.id}`}
                              className="bg-primary hover:bg-primary-container text-white px-md py-2.5 rounded-2xl font-bold text-label-sm opacity-0 scale-90 translate-y-4 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-smooth shadow-md">
                              View Details
                            </Link>
                            <div className="flex items-center gap-1 text-primary group-hover:opacity-0 group-hover:translate-x-4 transition-smooth font-bold">
                              <span className="text-xs uppercase font-extrabold tracking-wider">Book</span>
                              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-3 py-2xl text-center text-on-surface-variant bg-white rounded-3xl shadow-soft border border-outline-variant/30">
                  <span className="material-symbols-outlined text-outline text-[64px] mb-md">search_off</span>
                  <p className="font-extrabold text-title-lg text-primary mb-1">No Tours Found</p>
                  <p className="font-body-md text-body-md text-on-surface-variant">We couldn't find any tours matching your filters. Try adjusting your search term or selection.</p>
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
            <p className="font-body-md text-surface-variant dark:text-on-surface-variant">© 2024 VietTour. All rights reserved. Professional, Inviting, and Dynamic travel experiences.</p>
          </div>
          <div className="space-y-md">
            <h5 className="text-on-primary dark:text-primary font-bold">Explore</h5>
            <ul className="space-y-sm">
              <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/tours">Tours</Link></li>
              <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/tours">Destinations</Link></li>
              <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/tours">Promotions</Link></li>
            </ul>
          </div>
          <div className="space-y-md">
            <h5 className="text-on-primary dark:text-primary font-bold">Company</h5>
            <ul className="space-y-sm">
              <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/about">About Us</Link></li>
              <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/contact">Contact</Link></li>
              <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/tours">Terms of Service</Link></li>
            </ul>
          </div>
          <div className="space-y-md">
            <h5 className="text-on-primary dark:text-primary font-bold">Support</h5>
            <ul className="space-y-sm">
              <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/contact">Help Center</Link></li>
              <li><Link className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors font-label-sm" href="/tours">FAQs</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
