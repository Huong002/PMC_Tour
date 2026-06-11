export interface ReviewDto {
  id: number;
  tourId: number;
  userId: number;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateReviewRequest {
  tourId: number;
  rating: number;
  comment?: string;
}
