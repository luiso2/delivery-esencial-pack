'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  MapIcon,
  PlusIcon,
  ClockIcon,
  TruckIcon,
  ArrowRightIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import RouteCard from '@/components/routes/RouteCard';
import RouteFilters from '@/components/routes/RouteFilters';
import { Route } from '@/types/route';
import useRouteStore from '@/store/routeStore';

interface RouteMetrics {
  total: number;
  active: number;
  draft: number;
  completed: number;
  totalOrders: number;
  totalDistance: string;
  averageTime: string;
}

export default function RoutesPage() {
  const { routes, fetchRoutes, loading } = useRouteStore();
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([]);
  const [metrics, setMetrics] = useState<RouteMetrics | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  useEffect(() => {
    applyFilters();
  }, [routes, filters]);

  // Calculate metrics when routes change
  useEffect(() => {
    if (routes.length > 0) {
      const calculatedMetrics: RouteMetrics = {
        total: routes.length,
        active: routes.filter(r => r.status === 'active').length,
        draft: routes.filter(r => r.status === 'draft').length,
        completed: routes.filter(r => r.status === 'completed').length,
        totalOrders: routes.reduce((sum, r) => sum + r.orders.length, 0),
        totalDistance: routes.reduce((sum, r) => sum + parseFloat((r.totalDistance || '0 km').replace(' km', '')), 0).toFixed(1) + ' km',
        averageTime: Math.round(routes.reduce((sum, r) => {
          const timeStr = r.estimatedTime || '0 min';
          const hours = timeStr.includes('h') ? parseInt(timeStr.split('h')[0]) : 0;
          const minutes = timeStr.includes('min') ? parseInt(timeStr.split('min')[0].split(' ').pop() || '0') : 0;
          return sum + (hours * 60 + minutes);
        }, 0) / routes.length) + ' min'
      };
      
      setMetrics(calculatedMetrics);
     }
   }, [routes]);

  const applyFilters = () => {
    let filtered = [...routes];

    if (filters.status !== 'all') {
      filtered = filtered.filter(route => route.status === filters.status);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(route =>
        route.name.toLowerCase().includes(searchTerm) ||
        route.description?.toLowerCase().includes(searchTerm) ||
        route.orders.some(order => order.orderId.toLowerCase().includes(searchTerm))
      );
    }

    setFilteredRoutes(filtered);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Rutas de Entrega</h1>
              <p className="mt-1 text-primary-100">Gestiona y optimiza tus rutas</p>
            </div>
            <Link
              href="/rutas/nueva"
              className="btn-primary inline-flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Nueva Ruta
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics */}
      {metrics && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card-base p-4 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Rutas</p>
                  <p className="text-2xl font-bold">{metrics.total}</p>
                </div>
                <MapIcon className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            
            <div className="card-base p-4 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Activas</p>
                  <p className="text-2xl font-bold text-green-600">{metrics.active}</p>
                </div>
                <TruckIcon className="h-8 w-8 text-green-400" />
              </div>
            </div>
            
            <div className="card-base p-4 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pedidos</p>
                  <p className="text-2xl font-bold text-blue-600">{metrics.totalOrders}</p>
                </div>
                <ChartBarIcon className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            
            <div className="card-base p-4 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Distancia Total</p>
                  <p className="text-xl font-bold text-primary-600">{metrics.totalDistance}</p>
                </div>
                <MapPinIcon className="h-8 w-8 text-primary-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="card-base p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por nombre, descripción o pedido..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange({ search: e.target.value })}
                  className="input-base pl-10"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary inline-flex items-center"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filtros
              {filters.status !== 'all' && (
                <span className="ml-2 bg-primary-600 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center">
                  1
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <RouteFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              metrics={metrics}
            />
          )}
        </div>
      </div>

      {/* Routes List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {filteredRoutes.length === 0 ? (
          <div className="card-base p-8 text-center">
            <MapIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay rutas</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.search || filters.status !== 'all' 
                ? 'No se encontraron rutas con los filtros aplicados'
                : 'Comienza creando una nueva ruta de entrega'}
            </p>
            {!filters.search && filters.status === 'all' && (
              <div className="mt-6">
                <Link
                  href="/rutas/nueva"
                  className="btn-primary inline-flex items-center"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Crear Primera Ruta
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoutes.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {routes.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="card-base p-6 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/rutas/optimizar"
                className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
              >
                <ChartBarIcon className="h-6 w-6 text-primary-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Optimizar Rutas</p>
                  <p className="text-sm text-gray-500">Mejora la eficiencia</p>
                </div>
                <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-400" />
              </Link>

              <Link
                href="/rutas/mapa"
                className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
              >
                <MapIcon className="h-6 w-6 text-primary-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Ver en Mapa</p>
                  <p className="text-sm text-gray-500">Visualización completa</p>
                </div>
                <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-400" />
              </Link>

              <Link
                href="/rutas/historial"
                className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
              >
                <ClockIcon className="h-6 w-6 text-primary-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Historial</p>
                  <p className="text-sm text-gray-500">Rutas completadas</p>
                </div>
                <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}