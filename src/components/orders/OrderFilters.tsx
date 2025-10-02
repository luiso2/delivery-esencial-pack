'use client';

import { useState } from 'react';
import useOrderStore from '@/store/orderStore';
import { OrderStatus, OrderType, OrderStatusLabels, OrderTypeLabels } from '@/types/order';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function OrderFilters() {
  const { filters, setFilters, fetchOrders } = useOrderStore();
  const [localFilters, setLocalFilters] = useState(filters);

  const statusOptions: OrderStatus[] = ['pending', 'in_transit', 'delivered', 'incomplete', 'failed'];
  const typeOptions: OrderType[] = ['normal', 'express'];

  const handleStatusChange = (status: OrderStatus) => {
    const currentStatuses = localFilters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    
    setLocalFilters({ ...localFilters, status: newStatuses });
  };

  const handleTypeChange = (type: OrderType | null) => {
    setLocalFilters({ ...localFilters, type });
  };

  const handleDelayedChange = (delayed: boolean) => {
    setLocalFilters({ ...localFilters, delayed });
  };

  const applyFilters = () => {
    setFilters(localFilters);
    fetchOrders(localFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    setFilters(clearedFilters);
    fetchOrders(clearedFilters);
  };

  const hasActiveFilters = 
    (localFilters.status && localFilters.status.length > 0) ||
    localFilters.type ||
    localFilters.delayed;

  return (
    <div className="space-y-4">
      {/* Status Filters */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Estado
        </label>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map(status => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                localFilters.status?.includes(status)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {OrderStatusLabels[status]}
            </button>
          ))}
        </div>
      </div>

      {/* Type Filters */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => handleTypeChange(null)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              !localFilters.type
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todos
          </button>
          {typeOptions.map(type => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                localFilters.type === type
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {OrderTypeLabels[type]}
            </button>
          ))}
        </div>
      </div>

      {/* Special Filters */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filtros especiales
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => handleDelayedChange(!localFilters.delayed)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              localFilters.delayed
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pedidos atrasados
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <button
          onClick={clearFilters}
          disabled={!hasActiveFilters}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Limpiar filtros
        </button>
        <button
          onClick={applyFilters}
          className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          Aplicar filtros
        </button>
      </div>
    </div>
  );
}