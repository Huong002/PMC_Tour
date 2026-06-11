import React from 'react';
import { UserDetailDto } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';

interface CustomerDetailProps {
  customer: UserDetailDto;
}

export function CustomerDetail({ customer }: CustomerDetailProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-bold mb-4">Chi tiết khách hàng</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-semibold block text-gray-500">Tên tài khoản:</span>
          <span>{customer.username}</span>
        </div>
        <div>
          <span className="font-semibold block text-gray-500">Họ và tên:</span>
          <span>{customer.fullName}</span>
        </div>
        <div>
          <span className="font-semibold block text-gray-500">Email:</span>
          <span>{customer.email}</span>
        </div>
        <div>
          <span className="font-semibold block text-gray-500">Số điện thoại:</span>
          <span>{customer.phone || '-'}</span>
        </div>
        <div>
          <span className="font-semibold block text-gray-500">Địa chỉ:</span>
          <span>{customer.address || '-'}</span>
        </div>
        <div>
          <span className="font-semibold block text-gray-500">Trạng thái:</span>
          <StatusBadge status={customer.status} />
        </div>
      </div>
    </div>
  );
}
