import Link from 'next/link';
import { Route } from '@/types/route';
import {
  MapIcon,
  ClockIcon,
  TruckIcon,
  MapPinIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';

interface RouteCardProps {
  route: Route;
}

export default function RouteCard({ route }: RouteCardProps) {
  const getStatusBadge = (status: Route['status']) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-800 border-gray-300',
      active: 'bg-green-100 text-green-800 border-green-300',
      completed: 'bg-blue-100 text-blue-800 border-blue-300'
    };

    const labels = {
      draft: 'Borrador',
      active: 'Activa',
      completed: 'Completada'
    };

    const icons = {
      draft: <PencilSquareIcon className="h-3 w-3" />,
      active: <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />,
      completed: <CheckCircleIcon className="h-3 w-3" />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${badges[status]}`}>
        {icons[status]}
        {labels[status]}
      </span>
    );
  };

  const getColorClass = (color: string) => {
    // Extract the actual color class from the string
    return color.includes('bg-') ? color : `bg-${color}-500`;
  };

  const hasOrders = route.orders.length > 0;

  return (
    <div className="card-base hover:shadow-lg transition-all duration-200 relative overflow-hidden group">
      {/* Color stripe */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${getColorClass(route.color)}`} />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {route.name}
              </h3>
              {getStatusBadge(route.status)}
            </div>
            {route.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {route.description}
              </p>
            )}
          </div>
          <div className={`p-2 rounded-lg ${getColorClass(route.color)} bg-opacity-10`}>
            <MapIcon className={`h-5 w-5 ${getColorClass(route.color).replace('bg-', 'text-')}`} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TruckIcon className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {route.orders.length}
            </p>
            <p className="text-xs text-gray-500">Pedidos</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <MapPinIcon className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-lg font-bold text-gray-900">
              {route.totalDistance || '0 km'}
            </p>
            <p className="text-xs text-gray-500">Distancia</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <ClockIcon className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-lg font-bold text-gray-900">
              {route.estimatedTime || '0 min'}
            </p>
            <p className="text-xs text-gray-500">Tiempo</p>
          </div>
        </div>

        {/* Orders Preview */}
        {hasOrders && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-700 mb-2">Próximas paradas:</p>
            <div className="space-y-1">
              {route.orders.slice(0, 2).map((order, index) => (
                <div key={order.orderId} className="flex items-center text-xs text-gray-600">
                  <span className={`inline-flex items-center justify-center h-5 w-5 rounded-full ${getColorClass(route.color)} text-white text-xs font-medium mr-2`}>
                    {order.position}
                  </span>
                  <span className="truncate flex-1">{order.orderId}</span>
                  {order.distance && (
                    <span className="text-gray-400 ml-2">{order.distance}</span>
                  )}
                </div>
              ))}
              {route.orders.length > 2 && (
                <p className="text-xs text-gray-400 pl-7">
                  +{route.orders.length - 2} más...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasOrders && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg text-center">
            <TruckIcon className="h-8 w-8 text-gray-300 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Sin pedidos asignados</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Actualizada {new Date(route.updatedAt).toLocaleDateString()}
          </div>
          
          <Link
            href={`/rutas/${route.id}`}
            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 group-hover:translate-x-1 transition-transform"
          >
            Ver Detalles
            <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {/* Status Indicator for Active Routes */}
        {route.status === 'active' && (
          <div className="absolute top-3 right-3">
            <div className="relative">
              <div className="h-3 w-3 bg-green-500 rounded-full animate-ping absolute"></div>
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}