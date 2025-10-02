'use client';

import Link from 'next/link';
import { Order, getOrderPriority, OrderStatusLabels, OrderTypeLabels, isOrderDelayed, getDelayHours } from '@/types/order';
import {
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ChevronRightIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const priority = getOrderPriority(order);
  const delayed = isOrderDelayed(order);
  const delayHours = delayed ? getDelayHours(order) : 0;

  const priorityStyles = {
    urgent: 'border-red-300 bg-red-50',
    warning: 'border-yellow-300 bg-yellow-50',
    success: 'border-green-300 bg-green-50',
    normal: 'border-blue-300 bg-blue-50'
  };

  const statusStyles = {
    pending: 'badge-pending',
    in_transit: 'badge-in-transit',
    delivered: 'badge-delivered',
    incomplete: 'badge-incomplete',
    failed: 'badge-failed'
  };

  const handleCall = (e: React.MouseEvent, phone: string) => {
    e.preventDefault();
    e.stopPropagation();
    // Limpiar número de teléfono
    const cleanPhone = phone.replace(/\s+/g, '').replace(/[^\d+]/g, '');
    window.location.href = `tel:${cleanPhone}`;
  };

  const handleCopyAddress = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const fullAddress = `${order.address}, ${order.municipality}, ${order.province}`;
    
    navigator.clipboard.writeText(fullAddress).then(() => {
      toast.success('Dirección copiada al portapapeles');
    }).catch(() => {
      toast.error('Error al copiar la dirección');
    });
  };

  return (
    <div className={`card-base p-4 ${priorityStyles[priority]} relative`}>
      <Link href={`/pedidos/${order.id}`} className="block">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-gray-900">#{order.id}</span>
              {order.type === 'express' && (
                <span className="badge-base bg-purple-100 text-purple-800">
                  {OrderTypeLabels[order.type]}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm font-medium text-gray-900">{order.clientName}</p>
          </div>
          <span className={`badge-base ${statusStyles[order.status]}`}>
            {OrderStatusLabels[order.status]}
          </span>
        </div>

        {/* Client Info */}
        <div className="space-y-2 mb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2 flex-1 mr-2">
              <MapPinIcon className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600 line-clamp-2">
                {order.address}, {order.municipality}
              </p>
            </div>
            <button
              onClick={handleCopyAddress}
              className="p-1.5 hover:bg-white/50 rounded-lg transition-colors"
              title="Copiar dirección"
            >
              <DocumentDuplicateIcon className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PhoneIcon className="h-4 w-4 text-gray-400" />
              <p className="text-sm text-gray-600">{order.clientPhone}</p>
            </div>
            <button
              onClick={(e) => handleCall(e, order.clientPhone)}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center space-x-1"
            >
              <PhoneIcon className="h-3.5 w-3.5" />
              <span>Llamar</span>
            </button>
          </div>
        </div>

        {/* Items Summary */}
        <div className="mb-3">
          <p className="text-sm text-gray-600">
            {order.items.length} item{order.items.length !== 1 ? 's' : ''} • 
            {order.driverPayment} CUP
          </p>
        </div>

        {/* Delivery Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-4 w-4 text-gray-400" />
            <p className="text-xs text-gray-600">
              {new Date(order.estimatedDelivery).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          
          {delayed && (
            <div className="flex items-center space-x-1 text-red-600">
              <ExclamationCircleIcon className="h-4 w-4" />
              <span className="text-xs font-medium">
                {delayHours}h atrasado
              </span>
            </div>
          )}
        </div>

        {/* Capture Status */}
        {order.captureStatus !== 'success' && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Captura:</span>
              <span className={`text-xs font-medium ${
                order.captureStatus === 'failed' ? 'text-red-600' :
                order.captureStatus === 'partial' ? 'text-yellow-600' :
                'text-gray-600'
              }`}>
                {order.captureStatus === 'pending' ? 'Pendiente' :
                 order.captureStatus === 'partial' ? 'Parcial' :
                 order.captureStatus === 'failed' ? 'Fallida' : ''}
              </span>
            </div>
          </div>
        )}

        {/* Arrow Icon */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <ChevronRightIcon className="h-5 w-5 text-gray-400" />
        </div>
      </Link>
    </div>
  );
}