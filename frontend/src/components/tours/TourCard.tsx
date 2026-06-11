import React from 'react';
import { TourDto } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';

interface TourCardProps {
  tour: TourDto;
  onViewDetail?: (id: number) => void;
}

export function TourCard({ tour, onViewDetail }: TourCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition duration-200">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-lg font-bold text-gray-950 truncate max-w-[70%]">{tour.title}</h4>
          <StatusBadge status={tour.status} />
        </div>
        <div className="text-sm text-gray-500 mb-4">
          Khởi hành: {new Date(tour.startDate).toLocaleDateString('vi-VN')}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-blue-600 font-bold text-lg">
            {tour.price.toLocaleString('vi-VN')} đ
          </span>
          {onViewDetail && (
            <button
              onClick={() => onViewDetail(tour.id)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Chi tiết →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
