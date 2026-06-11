export interface UserDto {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface UserDetailDto extends UserDto {
  address?: string;
  updatedAt?: string;
  lastLoginAt?: string;
  totalRegistrations: number;
  approvedRegistrations: number;
  completedRegistrations: number;
  cancelledRegistrations: number;
  totalSpent: number;
  recentRegistrations: any[]; 
  recentPayments: any[]; 
}

export interface UserCreateDto {
  username: string;
  password?: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  role?: string;
}

export interface UserUpdateDto {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
}
