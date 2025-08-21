import { Route } from '@/types/route';

export const mockRoutes: Route[] = [
  {
    id: 'route-1',
    name: 'Ruta Centro Habana',
    description: 'Zona centro de La Habana',
    color: 'bg-blue-500',
    orders: [
      { orderId: 'ORD-001', position: 1, distance: '2.5 km', estimatedTime: '15 min' },
      { orderId: 'ORD-002', position: 2, distance: '1.8 km', estimatedTime: '10 min' },
      { orderId: 'ORD-003', position: 3, distance: '3.2 km', estimatedTime: '20 min' },
    ],
    totalDistance: '12 km',
    estimatedTime: '2h 30min',
    status: 'active',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'route-2',
    name: 'Ruta Vedado',
    description: 'Zona del Vedado',
    color: 'bg-green-500',
    orders: [
      { orderId: 'ORD-004', position: 1, distance: '1.2 km', estimatedTime: '8 min' },
      { orderId: 'ORD-005', position: 2, distance: '2.1 km', estimatedTime: '12 min' },
    ],
    totalDistance: '8 km',
    estimatedTime: '1h 45min',
    status: 'active',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'route-3',
    name: 'Ruta Playa',
    description: 'Municipio Playa',
    color: 'bg-purple-500',
    orders: [],
    totalDistance: '0 km',
    estimatedTime: '0 min',
    status: 'draft',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];