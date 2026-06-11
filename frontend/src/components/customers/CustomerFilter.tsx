import React from 'react';

interface CustomerFilterProps {
  keyword: string;
  onKeywordChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
}

export function CustomerFilter({ keyword, onKeywordChange, status, onStatusChange }: CustomerFilterProps) {
  return (
    <div className="flex gap-4 mb-4">
      <input
        type="text"
        placeholder="Tìm theo tên, email, sđt..."
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
      />
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">Tất cả trạng thái</option>
        <option value="ACTIVE">Hoạt động</option>
        <option value="LOCKED">Đang khóa</option>
      </select>
    </div>
  );
}
