export interface PaymentDto {
  id: number;
  registrationId: number;
  amount: number;
  refundedAmount?: number;
  status: string;
  paymentMethod: string;
  paidAt: string;
  refundedAt?: string;
}

export interface CreatePaymentRequest {
  registrationId: number;
  amount: number;
  paymentMethod: string;
}
