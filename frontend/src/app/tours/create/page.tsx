'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '../../../components/layout/AuthGuard';
import { useAuth } from '../../../hooks/useAuth';

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export default function CreateTourPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    code: 'VT-2026-' + Math.floor(100 + Math.random() * 900),
    name: '',
    price: 299,
    duration: '3 Days',
    status: 'Pending Approval',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdtwdAukMug-2zZrhSfcNuc-VIC62VCDWTpV3lMl7kMnz80iOl4N9JB3DK_sdoMRLcdQ-QIx9fqBUfFhyW1msmeok9oYqhB00bp39Tgo_U6UDfWkgZf_iZYwkIa28icsfA738DkNW_r0QOX6Du_P-uLnnEVVTGg4LIGs1fo5VHaMFSVEQSNMmGnko6MxjK4HI7BpOQaaRsxEPmq3nhv5h5TZfBfORjUcefLidaceIXaEWTUpQ5iCaoyK3ZnOm4yZHgJY7V-nfPiB8',
    description: ''
  });

  const [itinerary, setItinerary] = useState<ItineraryDay[]>([
    { day: 1, title: 'Arrival & Welcome Dinner', description: 'Arrive at the destination, check-in to hotel and join our welcome dinner.' },
    { day: 2, title: 'City Exploration', description: 'Explore the iconic landmarks and enjoy local cuisine.' },
    { day: 3, title: 'Departure', description: 'Free time for shopping before transferring to airport.' }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItineraryChange = (index: number, field: 'title' | 'description', value: string) => {
    setItinerary(prev => prev.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const addItineraryDay = () => {
    setItinerary(prev => [
      ...prev,
      {
        day: prev.length + 1,
        title: `Day ${prev.length + 1} Activity`,
        description: 'Detail description of activities.'
      }
    ]);
    // Cập nhật duration dựa trên số ngày
    setFormData(prev => ({
      ...prev,
      duration: `${itinerary.length + 1} Days`
    }));
  };

  const removeItineraryDay = (index: number) => {
    if (itinerary.length <= 1) return;
    const newItinerary = itinerary.filter((_, i) => i !== index).map((item, i) => ({
      ...item,
      day: i + 1
    }));
    setItinerary(newItinerary);
    setFormData(prev => ({
      ...prev,
      duration: `${newItinerary.length} Days`
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Giả lập API lưu tour
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        router.push('/tours/manage');
      }, 2000);
    }, 1500);
  };

  return (
    <AuthGuard allowedRoles={['STAFF', 'ADMIN']}>
      <div className="bg-surface text-on-surface font-body-md min-h-screen flex">
        {/* SideNavBar Component */}
        <aside className="h-full w-64 fixed left-0 top-0 bg-surface-container-low dark:bg-surface-container-high shadow-lg flex flex-col p-md space-y-base sidebar-transition z-50">
          <div className="flex items-center gap-3 px-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined">explore</span>
            </div>
            <div>
              <h1 className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">VietTour</h1>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Staff Portal</p>
            </div>
          </div>
          <nav className="flex-1 space-y-1">
            <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant/50 transition-all rounded-lg font-medium group" href="/dashboard">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-label-md text-label-md">Dashboard</span>
            </Link>
            <Link className="flex items-center gap-3 px-4 py-3 bg-primary-container dark:bg-primary text-on-primary-container dark:text-on-primary rounded-lg font-bold translate-x-1 transition-transform group" href="/tours/manage">
              <span className="material-symbols-outlined">travel_explore</span>
              <span className="font-label-md text-label-md">Tour Management</span>
            </Link>
            <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant/50 transition-all rounded-lg font-medium group" href="/customers">
              <span className="material-symbols-outlined">group</span>
              <span className="font-label-md text-label-md">User Management</span>
            </Link>
            <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant/50 transition-all rounded-lg font-medium group" href="/dashboard">
              <span className="material-symbols-outlined">analytics</span>
              <span className="font-label-md text-label-md">Reports</span>
            </Link>
          </nav>
          <div className="pt-4 border-t border-outline-variant">
            <Link href="/tours/create" className="w-full bg-secondary hover:bg-secondary/90 text-on-secondary hover:text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md">
              <span className="material-symbols-outlined">add</span>
              Create New Tour
            </Link>
            <div className="mt-6 flex items-center gap-3 px-2">
              <img
                alt="Admin Avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcF4b0HjIQOggo9jnI7hO1MlazKWKTYP9nhl0JNZsEQzT2BRElZohOzjJ1aLjE6qW5Rlb9AThQcn0XdzMhkW3WQcoTIhHYLLwZh_V6mZ9Ua9okcWzFQCep21D69qPWVOW_bT8FJ4fLn9tzsiE6pXoJ-KH2TcnqBOqyn-RPD0WaQfc9KywCOIPlSSj6pR_KiIPJ5Rka4QUSh6wieXF2mgru7UwFUbmo6glFONLyF-xcz4QTOjR1rgyzRS5Wj9Vu4XXd355N7vn_yjE"
              />
              <div className="overflow-hidden">
                <p className="font-label-md text-label-md font-bold text-on-surface truncate">{user?.fullName || 'Admin Avatar'}</p>
                <p className="text-[11px] text-on-surface-variant truncate">{user?.role || 'VietTour Admin'}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-grow ml-64 p-margin-desktop bg-surface min-h-screen">
          {/* Header Section */}
          <header className="mb-xl flex justify-between items-center">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-primary mb-xs">Create New Tour</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Fill in the details to publish a new travel experience.</p>
            </div>
            <Link href="/tours/manage" className="px-lg py-2 border border-outline-variant hover:bg-surface-container rounded-lg font-bold transition-all active:scale-95">
              Back to List
            </Link>
          </header>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-gutter pb-xl">
            {/* Left Column - General Info */}
            <div className="lg:col-span-6 bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 space-y-md">
              <h3 className="font-title-lg text-title-lg text-primary border-b border-outline-variant/30 pb-sm mb-md">General Information</h3>

              <div className="grid grid-cols-2 gap-md">
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-outline">Tour Code</label>
                  <input
                    name="code"
                    value={formData.code}
                    disabled
                    className="w-full px-md py-3 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface-variant outline-none font-mono text-label-md"
                    type="text"
                  />
                </div>
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-outline">Duration</label>
                  <input
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-md py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
                    placeholder="e.g. 3 Days"
                    required
                    type="text"
                  />
                </div>
              </div>

              <div className="space-y-xs">
                <label className="font-label-md text-label-md text-outline">Tour Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-md py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md font-bold"
                  placeholder="e.g. Ha Long Bay Luxury Getaway"
                  required
                  type="text"
                />
              </div>

              <div className="grid grid-cols-2 gap-md">
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-outline">Price (USD)</label>
                  <input
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-md py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
                    min="1"
                    required
                    type="number"
                  />
                </div>
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-outline">Initial Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-md py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
                  >
                    <option value="Open for Registration">Open for Registration</option>
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Almost Full">Almost Full</option>
                  </select>
                </div>
              </div>

              <div className="space-y-xs">
                <label className="font-label-md text-label-md text-outline">Image URL</label>
                <input
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-md py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
                  type="text"
                />
              </div>

              <div className="space-y-xs">
                <label className="font-label-md text-label-md text-outline">Tour Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-md py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
                  placeholder="Summarize the travel experience..."
                  required
                  rows={4}
                ></textarea>
              </div>
            </div>

            {/* Right Column - Itinerary Day Details */}
            <div className="lg:col-span-6 bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-outline-variant/30 pb-sm mb-md">
                  <h3 className="font-title-lg text-title-lg text-primary">Detailed Itinerary</h3>
                  <button
                    type="button"
                    onClick={addItineraryDay}
                    className="bg-primary/10 hover:bg-primary/25 text-primary px-3 py-1.5 rounded-lg text-label-sm font-bold transition-all flex items-center gap-xs"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Add Day
                  </button>
                </div>

                <div className="space-y-md max-h-[420px] overflow-y-auto pr-sm">
                  {itinerary.map((day, index) => (
                    <div key={day.day} className="p-md bg-surface rounded-xl border border-outline-variant/30 relative space-y-md">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-primary text-label-md">Day {day.day}</span>
                        {itinerary.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItineraryDay(index)}
                            className="text-error hover:bg-error/10 p-1 rounded-full transition-all"
                            title="Remove Day"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        )}
                      </div>

                      <div className="space-y-xs">
                        <label className="font-label-sm text-label-sm text-outline">Day Title</label>
                        <input
                          value={day.title}
                          onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                          className="w-full px-md py-2 rounded-lg border border-outline-variant bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-md"
                          placeholder="e.g. Arrival & Check-in"
                          required
                          type="text"
                        />
                      </div>

                      <div className="space-y-xs">
                        <label className="font-label-sm text-label-sm text-outline">Day Activities</label>
                        <textarea
                          value={day.description}
                          onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                          className="w-full px-md py-2 rounded-lg border border-outline-variant bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-md"
                          placeholder="Detail of the activities..."
                          required
                          rows={2}
                        ></textarea>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Action Controls */}
              <div className="pt-md border-t border-outline-variant/30 mt-md flex justify-end gap-sm">
                <Link href="/tours/manage" className="px-xl py-3 border border-outline text-on-surface-variant hover:bg-surface rounded-full font-bold transition-all active:scale-95">
                  Cancel
                </Link>
                <button
                  disabled={isSubmitting || submitSuccess}
                  className={`px-xl py-3 rounded-full font-bold active:scale-95 transition-all text-white flex items-center justify-center gap-sm ${
                    submitSuccess
                      ? 'bg-tertiary hover:bg-tertiary-container'
                      : 'bg-secondary hover:bg-secondary/95 shadow-md'
                  }`}
                  type="submit"
                >
                  {isSubmitting ? (
                    <>
                      <span>Saving Tour...</span>
                      <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                    </>
                  ) : submitSuccess ? (
                    <>
                      <span>Tour Published!</span>
                      <span className="material-symbols-outlined">check_circle</span>
                    </>
                  ) : (
                    <>
                      <span>Publish Tour</span>
                      <span className="material-symbols-outlined">done</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </AuthGuard>
  );
}
