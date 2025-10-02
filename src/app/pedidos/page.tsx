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
  ShoppingCartIcon,
  MapIcon,
  TruckIcon,
  MapPinIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

export default function PedidosPage() {
  const searchParams = useSearchParams();
  const { orders, loading, fetchOrders, filters, setFilters } = useOrderStore();
  const [view, setView] = useState<'list' | 'routes' | 'metrics'>('list');
  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [routes, setRoutes] = useState<any[]>([
    { id: 'route-1', name: 'Ruta Centro Habana', orders: 5, distance: '12 km', time: '2h 30min', color: 'bg-blue-500' },
    { id: 'route-2', name: 'Ruta Vedado', orders: 3, distance: '8 km', time: '1h 45min', color: 'bg-green-500' },
    { id: 'route-3', name: 'Ruta Playa', orders: 4, distance: '15 km', time: '3h', color: 'bg-purple-500' },
  ]);

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
              onClick={() => setView('routes')}
              className={`py-2 px-1 border-b-2 text-sm font-medium transition-colors ${
                view === 'routes'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Rutas
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
        ) : view === 'routes' ? (
          <div className="space-y-4">
            {/* Routes Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Organización de Rutas</h2>
                <p className="text-sm text-gray-500">Organiza tus entregas por zonas para optimizar tu recorrido</p>
              </div>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2">
                <PlusIcon className="h-5 w-5" />
                <span>Nueva Ruta</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Routes List */}
              <div className="lg:col-span-1 space-y-3">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Rutas Activas</h3>
                  <div className="space-y-2">
                    {routes.map((route) => (
                      <div
                        key={route.id}
                        onClick={() => setSelectedRoute(route.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedRoute === route.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className={`w-3 h-3 rounded-full mt-1.5 ${route.color}`}></div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm">{route.name}</p>
                              <p className="text-xs text-gray-500">{route.orders} pedidos</p>
                              <div className="flex items-center space-x-3 mt-1">
                                <span className="text-xs text-gray-400">{route.distance}</span>
                                <span className="text-xs text-gray-400">~{route.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Unassigned Orders */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Pedidos Sin Asignar</h3>
                  <div className="space-y-2">
                    {orders.filter(o => o.status === 'pending').slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        className="p-2 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <p className="text-sm font-medium text-gray-900">#{order.id}</p>
                        <p className="text-xs text-gray-600">{order.clientName}</p>
                        <p className="text-xs text-gray-500">{order.municipality}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Arrastra pedidos aquí para asignarlos a una ruta
                  </p>
                </div>
              </div>

              {/* Route Details */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  {selectedRoute ? (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-gray-900">
                          {routes.find(r => r.id === selectedRoute)?.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                            Optimizar
                          </button>
                          <button className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                            Iniciar Ruta
                          </button>
                        </div>
                      </div>

                      {/* Route Map Placeholder */}
                      <div className="bg-gray-100 rounded-lg h-64 mb-4 flex items-center justify-center">
                        <div className="text-center">
                          <MapIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Vista del mapa de la ruta</p>
                          <p className="text-xs text-gray-400">Integración con mapas disponible próximamente</p>
                        </div>
                      </div>

                      {/* Route Orders */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Orden de Entrega</h4>
                        {orders.filter(o => o.status === 'pending' || o.status === 'in_transit').slice(0, 5).map((order, index) => (
                          <div key={order.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                            <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                              {index + 1}
                            </span>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">#{order.id} - {order.clientName}</p>
                              <p className="text-xs text-gray-500">{order.address}, {order.municipality}</p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPinIcon className="h-4 w-4 text-gray-400" />
                              <span className="text-xs text-gray-500">2.5 km</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Route Stats */}
                      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Distancia Total</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {routes.find(r => r.id === selectedRoute)?.distance}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Tiempo Estimado</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {routes.find(r => r.id === selectedRoute)?.time}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Pedidos</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {routes.find(r => r.id === selectedRoute)?.orders}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="h-96 flex items-center justify-center">
                      <div className="text-center">
                        <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Selecciona una ruta para ver los detalles</p>
                        <p className="text-xs text-gray-400 mt-1">O crea una nueva ruta para comenzar</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
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