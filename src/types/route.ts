export interface RouteOrder {
  orderId: string;
  position: number;
  estimatedTime?: string;
  distance?: string;
}

export interface Route {
  id: string;
  name: string;
  description?: string;
  color: string;
  orders: RouteOrder[];
  totalDistance?: string;
  estimatedTime?: string;
  status: 'draft' | 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export const RouteColors = [
  { value: 'bg-blue-500', label: 'Azul' },
  { value: 'bg-green-500', label: 'Verde' },
  { value: 'bg-purple-500', label: 'Morado' },
  { value: 'bg-yellow-500', label: 'Amarillo' },
  { value: 'bg-red-500', label: 'Rojo' },
  { value: 'bg-indigo-500', label: 'Índigo' },
  { value: 'bg-pink-500', label: 'Rosa' },
  { value: 'bg-orange-500', label: 'Naranja' },
];