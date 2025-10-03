'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import useOrderStore from '@/store/orderStore';
import OrderCard from '@/components/orders/OrderCard';
import OrderFilters from '@/components/orders/OrderFilters';
import OrderMetrics from '@/components/orders/OrderMetrics';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';

export default function PedidosPage() {
  const searchParams = useSearchParams();
  const { orders, loading, fetchOrders, filters, setFilters } = useOrderStore();
  const [view, setView] = useState<'list' | 'metrics'>('list');
  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Apply URL params as filters
    const status = searchParams.get('status');
    const delayed = searchParams.get('delayed');

    const initialFilters = {
      ...filters,
      status: status ? [status as any] : undefined,
      delayed: delayed === 'true'
    };

    setFilters(initialFilters);
    fetchOrders(initialFilters);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchText });
    fetchOrders({ ...filters, search: searchText });
  };

  const handleRefresh = () => {
    fetchOrders(filters);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">Pedidos</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                disabled={loading}
              >
                <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <FunnelIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-8">
            <button
              onClick={() => setView('list')}
              className={`py-2 px-1 border-b-2 text-sm font-medium transition-colors ${
                view === 'list'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => setView('metrics')}
              className={`py-2 px-1 border-b-2 text-sm font-medium transition-colors ${
                view === 'metrics'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Métricas
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <form onSubmit={handleSearch} className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Buscar por ID, cliente, dirección..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </form>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <OrderFilters />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {view === 'metrics' ? (
          <OrderMetrics />
        ) : (
          <>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron pedidos</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Intenta ajustar los filtros de búsqueda
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    {orders.length} pedido{orders.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}