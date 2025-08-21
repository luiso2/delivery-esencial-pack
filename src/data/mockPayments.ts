import { Payment } from '@/types/payment';

export const mockPayments: Payment[] = [
  {
    id: 'PAY-001',
    orderId: 'ORD-003',
    amount: 400,
    status: 'completed',
    paymentDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    method: 'cash',
    notes: 'Pago recibido en efectivo',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'PAY-002',
    orderId: 'ORD-010',
    amount: 280,
    status: 'completed',
    paymentDate: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    method: 'transfer',
    notes: 'Transferencia bancaria confirmada',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'PAY-003',
    orderId: 'ORD-001',
    amount: 350,
    status: 'pending',
    method: 'cash',
    notes: 'Pendiente de cobro',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'PAY-004',
    orderId: 'ORD-002',
    amount: 250,
    status: 'pending',
    method: 'cash',
    notes: 'En proceso de entrega',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'PAY-005',
    orderId: 'ORD-004',
    amount: 500,
    status: 'pending',
    method: 'cash',
    notes: 'Pedido atrasado - cobro pendiente',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'PAY-006',
    orderId: 'ORD-005',
    amount: 200,
    status: 'cancelled',
    notes: 'Entrega fallida - pago cancelado',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'PAY-007',
    orderId: 'ORD-006',
    amount: 300,
    status: 'pending',
    method: 'cash',
    notes: 'Entrega parcial - ajustar monto',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'PAY-008',
    orderId: 'ORD-007',
    amount: 450,
    status: 'pending',
    method: 'transfer',
    notes: 'Express - en tránsito',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'PAY-009',
    orderId: 'ORD-008',
    amount: 380,
    status: 'pending',
    method: 'cash',
    notes: 'Asignado a otro conductor',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'PAY-010',
    orderId: 'ORD-009',
    amount: 400,
    status: 'pending',
    method: 'cash',
    notes: 'Express - cobro contra entrega',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Historial de pagos semanales para gráficos
export const weeklyPaymentHistory = [
  { week: 'Sem 1', completed: 2800, pending: 1200 },
  { week: 'Sem 2', completed: 3200, pending: 800 },
  { week: 'Sem 3', completed: 2600, pending: 1400 },
  { week: 'Sem 4', completed: 3500, pending: 500 },
  { week: 'Actual', completed: 680, pending: 2630 }
];

// Resumen de pagos por método
export const paymentMethodSummary = [
  { method: 'Efectivo', total: 2180, percentage: 65 },
  { method: 'Transferencia', total: 730, percentage: 22 },
  { method: 'Otros', total: 400, percentage: 13 }
];