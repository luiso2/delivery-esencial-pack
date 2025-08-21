import { Order } from '@/types/order';

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    clientName: 'María González',
    clientPhone: '+53 5234 5678',
    address: 'Calle 23 #456, e/ 10 y 12',
    municipality: 'Plaza de la Revolución',
    province: 'La Habana',
    items: [
      { id: '1', name: 'Paquete A', quantity: 2, delivered: false },
      { id: '2', name: 'Paquete B', quantity: 1, delivered: false }
    ],
    type: 'express',
    status: 'pending',
    driverId: 'driver-001',
    estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    captureStatus: 'pending',
    driverPayment: 350
  },
  {
    id: 'ORD-002',
    clientName: 'Carlos Rodríguez',
    clientPhone: '+53 5876 5432',
    address: 'Ave. 5ta #789, Miramar',
    municipality: 'Playa',
    province: 'La Habana',
    items: [
      { id: '3', name: 'Documento importante', quantity: 1, delivered: false }
    ],
    type: 'normal',
    status: 'in_transit',
    driverId: 'driver-001',
    estimatedDelivery: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    captureStatus: 'pending',
    driverPayment: 250
  },
  {
    id: 'ORD-003',
    clientName: 'Ana Martínez',
    clientPhone: '+53 5111 2222',
    address: 'Calle Martí #123',
    municipality: 'Centro Habana',
    province: 'La Habana',
    items: [
      { id: '4', name: 'Caja pequeña', quantity: 3, delivered: true },
      { id: '5', name: 'Sobre', quantity: 2, delivered: true }
    ],
    type: 'normal',
    status: 'delivered',
    driverId: 'driver-001',
    estimatedDelivery: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    captureStatus: 'success',
    notes: 'Entregado sin novedad',
    driverPayment: 400
  },
  {
    id: 'ORD-004',
    clientName: 'Pedro Sánchez',
    clientPhone: '+53 5333 4444',
    address: 'Calle 70 #234',
    municipality: 'Marianao',
    province: 'La Habana',
    items: [
      { id: '6', name: 'Paquete grande', quantity: 1, delivered: false }
    ],
    type: 'express',
    status: 'pending',
    driverId: 'driver-001',
    estimatedDelivery: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    captureStatus: 'pending',
    driverPayment: 500
  },
  {
    id: 'ORD-005',
    clientName: 'Laura Díaz',
    clientPhone: '+53 5555 6666',
    address: 'Ave. 31 #890',
    municipality: 'Cerro',
    province: 'La Habana',
    items: [
      { id: '7', name: 'Documentos', quantity: 5, delivered: false }
    ],
    type: 'normal',
    status: 'failed',
    driverId: 'driver-001',
    estimatedDelivery: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    captureStatus: 'failed',
    notes: 'Cliente no disponible en dirección',
    driverPayment: 200
  },
  {
    id: 'ORD-006',
    clientName: 'Roberto Fernández',
    clientPhone: '+53 5777 8888',
    address: 'Calle San Lázaro #567',
    municipality: 'Centro Habana',
    province: 'La Habana',
    items: [
      { id: '8', name: 'Caja mediana', quantity: 2, delivered: true },
      { id: '9', name: 'Sobre grande', quantity: 1, delivered: false }
    ],
    type: 'normal',
    status: 'incomplete',
    driverId: 'driver-001',
    estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    captureStatus: 'success',
    notes: 'Cliente solo recibió parte del pedido',
    driverPayment: 300
  },
  {
    id: 'ORD-007',
    clientName: 'Elena García',
    clientPhone: '+53 5999 0000',
    address: 'Calle 1ra #234, Vedado',
    municipality: 'Plaza de la Revolución',
    province: 'La Habana',
    items: [
      { id: '10', name: 'Paquete urgente', quantity: 1, delivered: false }
    ],
    type: 'express',
    status: 'in_transit',
    driverId: 'driver-001',
    estimatedDelivery: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    captureStatus: 'partial',
    driverPayment: 450
  },
  {
    id: 'ORD-008',
    clientName: 'Jorge López',
    clientPhone: '+53 5123 4567',
    address: 'Ave. Salvador Allende #789',
    municipality: 'Diez de Octubre',
    province: 'La Habana',
    items: [
      { id: '11', name: 'Caja grande', quantity: 1, delivered: false },
      { id: '12', name: 'Caja pequeña', quantity: 3, delivered: false }
    ],
    type: 'normal',
    status: 'pending',
    driverId: 'driver-002',
    estimatedDelivery: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    captureStatus: 'pending',
    driverPayment: 380
  },
  {
    id: 'ORD-009',
    clientName: 'Isabel Morales',
    clientPhone: '+53 5234 8765',
    address: 'Calle 100 #456',
    municipality: 'Boyeros',
    province: 'La Habana',
    items: [
      { id: '13', name: 'Sobre confidencial', quantity: 1, delivered: false }
    ],
    type: 'express',
    status: 'pending',
    driverId: 'driver-001',
    estimatedDelivery: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    captureStatus: 'pending',
    driverPayment: 400
  },
  {
    id: 'ORD-010',
    clientName: 'Miguel Torres',
    clientPhone: '+53 5345 6789',
    address: 'Calle 26 #123, Nuevo Vedado',
    municipality: 'Plaza de la Revolución',
    province: 'La Habana',
    items: [
      { id: '14', name: 'Paquete mediano', quantity: 2, delivered: true }
    ],
    type: 'normal',
    status: 'delivered',
    driverId: 'driver-001',
    estimatedDelivery: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    captureStatus: 'success',
    notes: 'Entrega exitosa',
    driverPayment: 280
  }
];