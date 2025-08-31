export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrderFilters {
  status?: OrderStatus[];
  type?: OrderType | null;
  search?: string;
  delayed?: boolean;
  page?: number;
  limit?: number;
}

import { OrderStatus, OrderType } from './order';