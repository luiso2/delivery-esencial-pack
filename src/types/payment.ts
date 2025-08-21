export type PaymentStatus = 'pending' | 'completed' | 'cancelled';

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  paymentDate?: Date | string;
  method?: 'cash' | 'transfer' | 'other';
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PaymentSummary {
  totalPending: number;
  totalCompleted: number;
  totalAmount: number;
  pendingCount: number;
  completedCount: number;
}