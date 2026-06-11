import React from 'react';
import { UserDto } from '../../types';
import { Table } from '../ui/Table';
import { StatusBadge } from '../ui/StatusBadge';

interface CustomerTableProps {
  customers: UserDto[];
  onToggleStatus: (id: number) => void;
  onResetPassword: (id: number) => void;
}

export function CustomerTable({ customers, onToggleStatus, onResetPassword }: CustomerTableProps) {
  return (
    <Table headers={['Tên tài khoản', 'Họ tên', 'Email', 'Số điện thoại', 'Trạng thái', 'Hành động']}>
      {customers.map((c) => (
        <tr key={c.id}>
          <td className="px-6 py-4">{c.username}</td>
          <td className="px-6 py-4">{c.fullName}</td>
          <td className="px-6 py-4">{c.email}</td>
          <td className="px-6 py-4">{c.phone || '-'}</td>
          <td className="px-6 py-4">
            <StatusBadge status={c.status} />
          </td>
          <td className="px-6 py-4 space-x-2 text-xs">
            <button onClick={() => onToggleStatus(c.id)} className="text-blue-600 hover:underline">
              Khóa/Mở
            </button>
            <button onClick={() => onResetPassword(c.id)} className="text-red-600 hover:underline">
              Reset Pass
            </button>
          </td>
        </tr>
      ))}
    </Table>
  );
}
