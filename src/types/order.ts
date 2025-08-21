export type OrderStatus = 
  | 'pending'     
  | 'in_transit'  
  | 'delivered'   
  | 'incomplete'  
  | 'failed';

export type OrderType = 'normal' | 'express';

export type OrderPriority = 'urgent' | 'warning' | 'normal' | 'success';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  delivered?: boolean;
}

export interface Order {
  id: string;
  clientName: string;
  clientPhone: string;
  address: string;
  municipality: string;
  province: string;
  items: OrderItem[];
  type: OrderType;
  status: OrderStatus;
  driverId?: string;
  estimatedDelivery: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  notes?: string;
  captureStatus: CaptureStatus;
  customRouteOrder?: number;
  driverPayment: number;
}

export type CaptureStatus = 'pending' | 'partial' | 'success' | 'failed';

export const OrderStatusColors: Record<OrderStatus, string> = {
  pending: '#fbbf24',
  in_transit: '#3b82f6',
  delivered: '#22c55e',
  incomplete: '#f97316',
  failed: '#ef4444'
};

export const OrderStatusLabels: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  in_transit: 'En Camino',
  delivered: 'Entregado',
  incomplete: 'Incompleto',
  failed: 'Fallido'
};

export const OrderTypeLabels: Record<OrderType, string> = {
  normal: 'Normal',
  express: 'Express'
};

export const CaptureStatusLabels: Record<CaptureStatus, string> = {
  pending: 'Pendiente',
  partial: 'Parcial',
  success: 'Completada',
  failed: 'Fallida'
};

export function isOrderDelayed(order: Order): boolean {
  const now = new Date();
  const estimatedDelivery = new Date(order.estimatedDelivery);
  
  if (['delivered', 'failed'].includes(order.status)) {
    return false;
  }
  
  return now > estimatedDelivery;
}

export function getDelayHours(order: Order): number {
  const now = new Date();
  const estimatedDelivery = new Date(order.estimatedDelivery);
  const diffMs = now.getTime() - estimatedDelivery.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60));
}

export function getOrderPriority(order: Order): OrderPriority {
  if (order.status === 'failed') return 'urgent';
  if (isOrderDelayed(order) && getDelayHours(order) > 24) return 'urgent';
  if (isOrderDelayed(order)) return 'warning';
  if (order.status === 'incomplete') return 'warning';
  if (order.status === 'delivered') return 'success';
  return 'normal';
}

export function canTransitionToStatus(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
  const transitions: Record<OrderStatus, OrderStatus[]> = {
    pending: ['in_transit', 'failed'],
    in_transit: ['delivered', 'incomplete', 'failed'],
    delivered: [],
    incomplete: ['in_transit', 'delivered', 'failed'],
    failed: []
  };
  
  return transitions[currentStatus]?.includes(newStatus) ?? false;
}