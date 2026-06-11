'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthGuard } from '../../../components/layout/AuthGuard';
import { Sidebar } from '../../../components/layout/Sidebar';
import { AdminHeader } from '../../../components/layout/AdminHeader';

export default function ManageToursPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tours, setTours] = useState([
    {
      id: 1,
      code: 'VT-2024-001',
      name: 'Ha Long Bay Luxury Cruise',
      status: 'Open for Registration',
      statusClass: 'bg-tertiary/10 text-tertiary border-tertiary/20',
      price: 599.00,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdtwdAukMug-2zZrhSfcNuc-VIC62VCDWTpV3lMl7kMnz80iOl4N9JB3DK_sdoMRLcdQ-QIx9fqBUfFhyW1msmeok9oYqhB00bp39Tgo_U6UDfWkgZf_iZYwkIa28icsfA738DkNW_r0QOX6Du_P-uLnnEVVTGg4LIGs1fo5VHaMFSVEQSNMmGnko6MxjK4HI7BpOQaaRsxEPmq3nhv5h5TZfBfORjUcefLidaceIXaEWTUpQ5iCaoyK3ZnOm4yZHgJY7V-nfPiB8',
      imageAlt: 'A cinematic aerial view of Ha Long Bay in Vietnam at sunrise'
    },
    {
      id: 2,
      code: 'VT-2024-005',
      name: 'Sapa Highland Trekking',
      status: 'Almost Full',
      statusClass: 'bg-secondary/10 text-secondary border-secondary/20',
      price: 345.00,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvACczAmMLz1BzWtRNn007nG7Mo0yVF4019AX0y-47QZAa8ZWv-WjtSb2Jol-uMZhJ22oYekPSD2GPXnZwgOqr9jQ9IVIdOgCi51pb_iGcfwPNIrnOfj_7_K4dqkA1FkU6vocnKDsF24tQDDMpMnkMCOps4DBKvEwaDwHIjPnYQ0FsQyjUT-vjD5hnW6zrM2qNLjCnrsESNZEzSQXWbG1THJoTLK0RsRNNLaS3LuvZs9W9UTmtPkTMnzEjFwf0cu70u2HmiW4XzG4',
      imageAlt: 'A lush green mountain valley in Sapa, Northern Vietnam'
    },
    {
      id: 3,
      code: 'VT-2024-008',
      name: 'Hoi An Lantern Festival Night',
      status: 'Cancelled',
      statusClass: 'bg-error/10 text-error border-error/20',
      price: 120.00,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEZ1XENpdALiGtQvugnRSWjHrKn6b1k2JNgEKtOLkijvruvmMaV7rjRH0wlXp79Nzl0CIFdAERWNy-F9et_hHGHH1P1WFKW9aGx3RdjQQaz3mducQ6mTr7aCwUB9L7rBfaNx83LpCexWGRHdYyj1EI3miFc62s5qwrcK2A3k_76d1hR6879x4_vlD_nl5xCV_kIDXa5LCE3ykWQWWHFy35JJ0J9dXzgUxQLXrnhdvyknwaJqL0aKhDIiUJu74i3_bmA_xFV0utucY',
      imageAlt: 'A vibrant street scene in Hoi An Ancient Town at night'
    },
    {
      id: 4,
      code: 'VT-2024-012',
      name: 'Saigon Historic City Tour',
      status: 'Pending Approval',
      statusClass: 'bg-primary/10 text-primary border-primary/20',
      price: 75.00,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUxqccO2c2MPgsylrVClFBeP1QUA2yqoOJqNV22EgAh0JKXwGtBhZZ2hOTOUXPzlL7Fkv-mOobxe9CyTp1OuqibdnWf0a8KPE2vB7XHbEGcxbnmuCZc6WRUiB4Y_EqMPchEo-eJDbJSpJ8kPFRMWIjYw92W92tKhV8Bago765gicsvSrCyrndRTTWpItYUzZ2cCfTN9hCe4263tnB3ICyQrnP7nD-Fl3Ps7q1jz8iBxXkzbfa1QhY99AmMEdLpkUr31Xy3C4zPPhk',
      imageAlt: 'The Reunification Palace in Ho Chi Minh City'
    },
    {
      id: 5,
      code: 'VT-2024-015',
      name: 'Da Lat Tea Hills Discovery',
      status: 'Open for Registration',
      statusClass: 'bg-tertiary/10 text-tertiary border-tertiary/20',
      price: 210.00,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDpRnYwJuAgDXUvec1_57yBjGriY7pU19tx3L7tPrUNh4obmkJkfU9iAopCP1HXugSOUpLjQuuj6e5uuKfd052Mj6WhvBRtk4MgVEAKKUuNk8WuirswwdzS2lFDDQqgJx10rsPPjY6JdciCsu4xXkeDpILoEBvyf_skVHcjYOjVLciEX-0h9sjitjQqNWHV4t5KT6qrvfDgLafy-MHtxINJx5yqg-A9sj2ic0Ar65BODPVoxKfx4b2qCnRLS0f630pYbx2W7a9XhU',
      imageAlt: 'A misty morning in the Central Highlands of Vietnam'
    }
  ]);

  const handleArchive = (id: number) => {
    setTours(prev => prev.map(tour => {
      if (tour.id === id) {
        return {
          ...tour,
          status: 'Archived',
          statusClass: 'bg-outline-variant text-outline border-outline-variant/30'
        };
      }
      return tour;
    }));
  };

  const filteredTours = tours.filter(tour =>
    tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AuthGuard allowedRoles={['STAFF', 'ADMIN']}>
      <div className="bg-surface text-on-surface font-body-md min-h-screen flex">
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Canvas Area */}
        <main className="flex-1 ml-64 p-margin-desktop bg-surface min-h-screen">
          {/* Header Section */}
          <AdminHeader
            title="Tour Management"
            description="Manage and monitor your current travel offerings and schedules."
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search tours..."
            actionButton={
              <Link 
                href="/tours/create" 
                className="bg-primary hover:bg-primary-container text-on-primary font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-soft"
              >
                <span className="material-symbols-outlined">add_circle</span>
                Add Tour
              </Link>
            }
          />

          {/* Stats Overview Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-xl">
            <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 text-left">
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">Total Tours</p>
              <p className="font-headline-md text-headline-md text-primary font-semibold">128</p>
              <div className="mt-2 flex items-center gap-1 text-tertiary">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                <span className="text-[12px] font-bold">+12% this month</span>
              </div>
            </div>
            <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 text-left">
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">Active (Open)</p>
              <p className="font-headline-md text-headline-md text-primary font-semibold">42</p>
              <div className="mt-2 flex items-center gap-1 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span className="text-[12px]">Healthy registration</span>
              </div>
            </div>
            <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 text-left">
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">Bookings Today</p>
              <p className="font-headline-md text-headline-md text-secondary font-semibold">15</p>
              <div className="mt-2 flex items-center gap-1 text-secondary">
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                <span className="text-[12px] font-bold">Trending up</span>
              </div>
            </div>
            <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 text-left">
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">Revenue Forecast</p>
              <p className="font-headline-md text-headline-md text-primary font-semibold">$42.5k</p>
              <div className="mt-2 flex items-center gap-1 text-tertiary">
                <span className="material-symbols-outlined text-[16px]">payments</span>
                <span className="text-[12px]">Q4 Targets on track</span>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl custom-shadow border border-outline-variant/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low border-b border-outline-variant/50">
                  <tr>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Tour Code</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {filteredTours.length > 0 ? (
                    filteredTours.map((tour) => (
                      <tr key={tour.id} className="hover:bg-surface-container-lowest transition-all hover:translate-x-1 duration-200">
                        <td className="px-6 py-4 font-mono text-label-md text-on-surface-variant">{tour.code}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img alt={tour.imageAlt} className="w-12 h-8 rounded object-cover" src={tour.image} />
                            <span className="font-label-md text-label-md text-on-surface font-bold">{tour.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${tour.statusClass}`}>
                            {tour.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-body-md text-body-md text-on-surface">${tour.price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/tours/${tour.id}`} className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-primary/5 rounded-lg" title="View">
                              <span className="material-symbols-outlined">visibility</span>
                            </Link>
                            <Link href={`/tours/manage`} className="p-2 text-on-surface-variant hover:text-secondary transition-colors hover:bg-secondary/5 rounded-lg" title="Edit">
                              <span className="material-symbols-outlined">edit</span>
                            </Link>
                            {tour.status !== 'Archived' ? (
                              <button
                                onClick={() => handleArchive(tour.id)}
                                className="p-2 text-on-surface-variant hover:text-error transition-colors hover:bg-error/5 rounded-lg active:scale-95"
                                title="Archive"
                              >
                                <span className="material-symbols-outlined">archive</span>
                              </button>
                            ) : (
                              <span className="p-2 text-outline text-label-sm italic">Archived</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-on-surface-variant">
                        No tours found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-outline-variant/50 flex items-center justify-between">
              <p className="font-label-sm text-label-sm text-on-surface-variant">Showing {filteredTours.length} of {tours.length} tours</p>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:cursor-not-allowed" disabled>
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-bold text-label-sm">1</button>
                <button className="w-8 h-8 rounded-lg text-on-surface-variant font-bold text-label-sm hover:bg-surface-container-low">2</button>
                <button className="w-8 h-8 rounded-lg text-on-surface-variant font-bold text-label-sm hover:bg-surface-container-low">3</button>
                <span className="text-on-surface-variant px-2">...</span>
                <button className="w-8 h-8 rounded-lg text-on-surface-variant font-bold text-label-sm hover:bg-surface-container-low">26</button>
                <button className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="mt-lg flex flex-wrap gap-md">
            <span className="text-on-surface-variant font-label-md self-center mr-2">Quick Filter:</span>
            <button className="bg-surface-container-highest/50 px-4 py-1.5 rounded-full text-label-sm text-on-surface font-medium border border-outline-variant/50 hover:bg-primary-container hover:text-on-primary-container transition-all">Domestic Tours</button>
            <button className="bg-surface-container-highest/50 px-4 py-1.5 rounded-full text-label-sm text-on-surface font-medium border border-outline-variant/50 hover:bg-primary-container hover:text-on-primary-container transition-all">International</button>
            <button className="bg-surface-container-highest/50 px-4 py-1.5 rounded-full text-label-sm text-on-surface font-medium border border-outline-variant/50 hover:bg-primary-container hover:text-on-primary-container transition-all">Luxury Collection</button>
            <button className="bg-surface-container-highest/50 px-4 py-1.5 rounded-full text-label-sm text-on-surface font-medium border border-outline-variant/50 hover:bg-primary-container hover:text-on-primary-container transition-all">Eco Tours</button>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
