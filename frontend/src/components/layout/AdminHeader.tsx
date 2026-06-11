'use client';

import React from 'react';

interface AdminHeaderProps {
  title: string;
  description: string;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  actionButton?: React.ReactNode;
}

export function AdminHeader({
  title,
  description,
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Search...',
  actionButton,
}: AdminHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-lg mb-xl mt-2 text-left">
      <div>
        <h2 className="font-headline-lg text-headline-lg text-primary mb-xs tracking-tight font-bold">{title}</h2>
        <p className="font-body-md text-body-md text-on-surface-variant font-medium">{description}</p>
      </div>
      <div className="flex items-center gap-md">
        {onSearchChange !== undefined && (
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/60 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary w-64 text-label-md transition-all outline-none font-body-md text-on-surface"
              placeholder={searchPlaceholder}
              type="text"
            />
          </div>
        )}
        {actionButton}
      </div>
    </header>
  );
}
