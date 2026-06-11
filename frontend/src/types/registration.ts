import { TourDto } from './tour';
import { UserDto } from './user';

export interface RegistrationDto {
  id: number;
  tourId: number;
  tourTitle: string;
  userId: number;
  userName: string;
  status: string;
  registeredAt: string;
  approvedAt?: string;
  completedAt?: string;
}

export interface RegistrationDetailDto {
  id: number;
  tour: TourDto;
  user: UserDto;
  status: string;
  note?: string;
  cancelReason?: string;
  registeredAt: string;
  approvedAt?: string;
  confirmedAt?: string;
  completedAt?: string;
  depositAmount?: number;
  totalAmount?: number;
}
