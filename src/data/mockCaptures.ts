import { Capture } from '@/types/capture';

export const mockCaptures: Capture[] = [
  {
    id: 'CAP-001',
    orderId: 'ORD-003',
    type: 'delivery',
    imageUrl: '/api/placeholder/400/300',
    thumbnailUrl: '/api/placeholder/100/75',
    status: 'verified',
    location: {
      latitude: 23.1136,
      longitude: -82.3666,
      address: 'Vedado, La Habana'
    },
    notes: 'Entrega exitosa en puerta principal',
    capturedBy: 'Juan Pérez',
    capturedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    verifiedBy: 'Admin',
    verifiedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'CAP-002',
    orderId: 'ORD-010',
    type: 'signature',
    imageUrl: '/api/placeholder/400/300',
    thumbnailUrl: '/api/placeholder/100/75',
    status: 'verified',
    location: {
      latitude: 23.1336,
      longitude: -82.3836,
      address: 'Miramar, La Habana'
    },
    notes: 'Firma del cliente confirmada',
    capturedBy: 'Juan Pérez',
    capturedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    verifiedBy: 'Admin',
    verifiedAt: new Date(Date.now() - 70 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 70 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'CAP-003',
    orderId: 'ORD-001',
    type: 'document',
    imageUrl: '/api/placeholder/400/300',
    thumbnailUrl: '/api/placeholder/100/75',
    status: 'pending',
    location: {
      latitude: 23.0511,
      longitude: -82.3452,
      address: 'Centro Habana, La Habana'
    },
    notes: 'Albarán pendiente de verificación',
    capturedBy: 'Juan Pérez',
    capturedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'CAP-004',
    orderId: 'ORD-002',
    type: 'delivery',
    imageUrl: '/api/placeholder/400/300',
    thumbnailUrl: '/api/placeholder/100/75',
    status: 'pending',
    location: {
      latitude: 23.1036,
      longitude: -82.4066,
      address: 'Playa, La Habana'
    },
    notes: 'Foto de paquete en puerta',
    capturedBy: 'Juan Pérez',
    capturedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'CAP-005',
    orderId: 'ORD-005',
    type: 'incident',
    imageUrl: '/api/placeholder/400/300',
    thumbnailUrl: '/api/placeholder/100/75',
    status: 'rejected',
    location: {
      latitude: 23.0811,
      longitude: -82.4552,
      address: 'Marianao, La Habana'
    },
    notes: 'Dirección incorrecta',
    rejectionReason: 'Imagen borrosa, no se puede verificar la entrega correctamente',
    capturedBy: 'Juan Pérez',
    capturedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    verifiedBy: 'Admin',
    verifiedAt: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'CAP-006',
    orderId: 'ORD-004',
    type: 'return',
    imageUrl: '/api/placeholder/400/300',
    thumbnailUrl: '/api/placeholder/100/75',
    status: 'verified',
    location: {
      latitude: 23.0236,
      longitude: -82.3966,
      address: 'Cerro, La Habana'
    },
    notes: 'Devolución - Cliente rechazó el paquete',
    capturedBy: 'Juan Pérez',
    capturedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    verifiedBy: 'Admin',
    verifiedAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'CAP-007',
    orderId: 'ORD-006',
    type: 'document',
    imageUrl: '/api/placeholder/400/300',
    thumbnailUrl: '/api/placeholder/100/75',
    status: 'pending',
    location: {
      latitude: 23.1236,
      longitude: -82.3466,
      address: 'Plaza de la Revolución, La Habana'
    },
    notes: 'Albarán de entrega parcial',
    capturedBy: 'Juan Pérez',
    capturedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'CAP-008',
    orderId: 'ORD-007',
    type: 'delivery',
    imageUrl: '/api/placeholder/400/300',
    thumbnailUrl: '/api/placeholder/100/75',
    status: 'pending',
    location: {
      latitude: 23.0936,
      longitude: -82.3366,
      address: 'Habana Vieja, La Habana'
    },
    notes: 'Entrega express completada',
    capturedBy: 'Juan Pérez',
    capturedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  }
];

// Add some incomplete captures to the mock data
mockCaptures.push({
  id: 'CAP-009',
  orderId: 'ORD-008',
  type: 'delivery',
  imageUrl: '/api/placeholder/400/300',
  thumbnailUrl: '/api/placeholder/100/75',
  status: 'incomplete',
  location: {
    latitude: 23.1436,
    longitude: -82.3566,
    address: 'Nuevo Vedado, La Habana'
  },
  notes: 'Entrega parcial - faltan 2 items',
  capturedBy: 'Juan Pérez',
  capturedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
});

export const captureStats = {
  total: mockCaptures.length,
  pending: mockCaptures.filter(c => c.status === 'pending').length,
  verified: mockCaptures.filter(c => c.status === 'verified').length,
  rejected: mockCaptures.filter(c => c.status === 'rejected').length,
  incomplete: mockCaptures.filter(c => c.status === 'incomplete').length,
  todayCount: 3,
  weekCount: 12
};