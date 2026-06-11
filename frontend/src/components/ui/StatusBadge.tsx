import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getColors = (statusStr: string) => {
    switch (statusStr.toUpperCase()) {
      case 'ACTIVE':
      case 'PUBLISHED':
      case 'APPROVED':
      case 'CONFIRMED':
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOCKED':
      case 'CANCELLED':
      case 'NO_SHOW':
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColors(status)}`}>
      {status}
    </span>
  );
}
