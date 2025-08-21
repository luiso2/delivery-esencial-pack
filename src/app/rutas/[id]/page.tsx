'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  MapIcon,
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ArrowsUpDownIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';
// import axios from 'axios'; // Removed - using mock data
import { mockRoutes } from '@/data/mockRoutes';
import { mockOrders } from '@/data/mockOrders';
import { Route } from '@/types/route';
import { Order } from '@/types/order';
import toast from 'react-hot-toast';

export default function RouteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [route, setRoute] = useState<Route | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchRoute(params.id as string);
    }
  }, [params.id]);

  const fetchRoute = async (id: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find route in mock data
      const foundRoute = mockRoutes.find(route => route.id === id);
      if (foundRoute) {
        setRoute(foundRoute);
        
        // Filter orders that belong to this route
        const routeOrderIds = foundRoute.orders.map((o: any) => o.orderId);
        const filteredOrders = mockOrders.filter((order: Order) =>
          routeOrderIds.includes(order.id)
        );
        setOrders(filteredOrders);
      } else {
        toast.error('Ruta no encontrada');
      }
    } catch (error) {
      console.error('Error fetching route:', error);
      toast.error('Error al cargar la ruta');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: Route['status']) => {
    if (!route) return;

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update route status in mock data
      const updatedRoute = {
        ...route,
        status: newStatus
      };
      
      setRoute(updatedRoute);
      toast.success(`Ruta ${newStatus === 'active' ? 'activada' : newStatus === 'completed' ? 'completada' : 'pausada'}`);
    } catch (error) {
      console.error('Error updating route:', error);
      toast.error('Error al actualizar la ruta');
    }
  };

  const handleDeleteRoute = async () => {
    if (!route || !confirm('¿Estás seguro de eliminar esta ruta?')) return;

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would remove from the database
      // For mock data, we just simulate success
      toast.success('Ruta eliminada');
      router.push('/rutas');
    } catch (error) {
      console.error('Error deleting route:', error);
      toast.error('Error al eliminar la ruta');
    }
  };

  const handleRemoveOrder = async (orderId: string) => {
    if (!route) return;

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const updatedOrders = route.orders.filter(o => o.orderId !== orderId);
      const updatedRoute = {
        ...route,
        orders: updatedOrders
      };
      
      setRoute(updatedRoute);
      setOrders(orders.filter(o => o.id !== orderId));
      toast.success('Pedido eliminado de la ruta');
    } catch (error) {
      console.error('Error removing order:', error);
      toast.error('Error al eliminar el pedido');
    }
  };

  const getStatusBadge = (status: Route['status']) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800'
    };

    const labels = {
      draft: 'Borrador',
      active: 'Activa',
      completed: 'Completada'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getOrderStatusBadge = (status: Order['status']) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_transit: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      incomplete: 'bg-orange-100 text-orange-800'
    };

    const labels = {
      pending: 'Pendiente',
      in_transit: 'En Tránsito',
      delivered: 'Entregado',
      failed: 'Fallido',
      incomplete: 'Incompleto'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Ruta no encontrada</h3>
          <div className="mt-6">
            <Link href="/rutas" className="btn-primary">
              Volver a Rutas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <div className={`bg-gradient-to-r ${route.color.replace('bg-', 'from-')}-600 ${route.color.replace('bg-', 'to-')}-800 text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/rutas"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold">{route.name}</h1>
                  {getStatusBadge(route.status)}
                </div>
                {route.description && (
                  <p className="mt-1 text-white/80">{route.description}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {route.status === 'draft' && (
                <button
                  onClick={() => handleStatusChange('active')}
                  className="btn-primary inline-flex items-center bg-white text-primary-600 hover:bg-gray-100"
                >
                  <PlayIcon className="h-5 w-5 mr-2" />
                  Activar
                </button>
              )}
              {route.status === 'active' && (
                <button
                  onClick={() => handleStatusChange('completed')}
                  className="btn-primary inline-flex items-center bg-white text-primary-600 hover:bg-gray-100"
                >
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Completar
                </button>
              )}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={handleDeleteRoute}
                className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-base p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pedidos</p>
                <p className="text-2xl font-bold">{route.orders.length}</p>
              </div>
              <TruckIcon className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          
          <div className="card-base p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Distancia</p>
                <p className="text-2xl font-bold">{route.totalDistance || '0 km'}</p>
              </div>
              <MapPinIcon className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          
          <div className="card-base p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tiempo Est.</p>
                <p className="text-2xl font-bold">{route.estimatedTime || '0 min'}</p>
              </div>
              <ClockIcon className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          
          <div className="card-base p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completados</p>
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="card-base">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Pedidos en la Ruta ({route.orders.length})
              </h2>
              <div className="flex items-center space-x-2">
                {isEditing && (
                  <button
                    onClick={() => setIsDragging(!isDragging)}
                    className={`btn-secondary inline-flex items-center ${isDragging ? 'bg-primary-100' : ''}`}
                  >
                    <ArrowsUpDownIcon className="h-5 w-5 mr-2" />
                    {isDragging ? 'Guardar Orden' : 'Reordenar'}
                  </button>
                )}
                <Link
                  href="/pedidos"
                  className="btn-primary inline-flex items-center"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Agregar Pedido
                </Link>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {route.orders.length === 0 ? (
              <div className="p-8 text-center">
                <TruckIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pedidos</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Agrega pedidos a esta ruta para comenzar
                </p>
                <div className="mt-6">
                  <Link
                    href="/pedidos"
                    className="btn-primary inline-flex items-center"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Agregar Primer Pedido
                  </Link>
                </div>
              </div>
            ) : (
              route.orders.map((routeOrder, index) => {
                const order = orders.find(o => o.id === routeOrder.orderId);
                if (!order) return null;

                return (
                  <div key={routeOrder.orderId} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`h-10 w-10 rounded-full ${route.color} flex items-center justify-center text-white font-bold`}>
                            {routeOrder.position}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/pedidos/${order.id}`}
                              className="text-sm font-medium text-gray-900 hover:text-primary-600"
                            >
                              {order.id}
                            </Link>
                            {getOrderStatusBadge(order.status)}
                          </div>
                          
                          <p className="mt-1 text-sm text-gray-600">
                            {order.clientName} - {order.clientPhone}
                          </p>
                          
                          <p className="mt-1 text-sm text-gray-500">
                            {order.address}
                          </p>
                          
                          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                            {routeOrder.distance && (
                              <span className="flex items-center">
                                <MapPinIcon className="h-4 w-4 mr-1" />
                                {routeOrder.distance}
                              </span>
                            )}
                            {routeOrder.estimatedTime && (
                              <span className="flex items-center">
                                <ClockIcon className="h-4 w-4 mr-1" />
                                {routeOrder.estimatedTime}
                              </span>
                            )}
                            <span className="font-medium text-primary-600">
                              {order.driverPayment} CUP
                            </span>
                          </div>
                        </div>
                      </div>

                      {isEditing && (
                        <button
                          onClick={() => handleRemoveOrder(order.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href={`/rutas/${route.id}/mapa`}
            className="card-base p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <MapIcon className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Ver en Mapa</p>
                <p className="text-sm text-gray-500">Visualización de la ruta</p>
              </div>
            </div>
          </Link>

          <Link
            href={`/rutas/${route.id}/optimizar`}
            className="card-base p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <ArrowsUpDownIcon className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Optimizar</p>
                <p className="text-sm text-gray-500">Reordenar pedidos</p>
              </div>
            </div>
          </Link>

          <button
            onClick={() => navigator.share && navigator.share({
              title: route.name,
              text: `Ruta ${route.name} con ${route.orders.length} pedidos`,
              url: window.location.href
            })}
            className="card-base p-4 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center">
              <svg className="h-6 w-6 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Compartir</p>
                <p className="text-sm text-gray-500">Enviar ruta</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}