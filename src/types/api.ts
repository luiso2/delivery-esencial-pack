export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
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