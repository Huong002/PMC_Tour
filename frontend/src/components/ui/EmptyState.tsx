import React from 'react';

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = 'Không tìm thấy dữ liệu.' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-gray-400 text-5xl mb-4">📭</div>
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}
