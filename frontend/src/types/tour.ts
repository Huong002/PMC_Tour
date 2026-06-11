export interface TourImageDto {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface TourDto {
  id: number;
  title: string;
  status: string;
  price: number;
  maxParticipants: number;
  availableSlots: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface TourDetailDto extends TourDto {
  description?: string;
  location?: string;
  category?: string;
  images: TourImageDto[];
}

export interface CreateTourRequest {
  title: string;
  description: string;
  price: number;
  maxParticipants: number;
  startDate: string;
  endDate: string;
  location?: string;
  category?: string;
}

export interface UpdateTourRequest {
  title?: string;
  description?: string;
  price?: number;
  maxParticipants?: number;
  startDate?: string;
  endDate?: string;
  location?: string;
  category?: string;
}
