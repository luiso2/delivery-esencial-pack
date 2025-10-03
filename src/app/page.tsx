'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  ShoppingCartIcon, 
  CameraIcon, 
  CreditCardIcon, 
  UserCircleIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  CurrencyDollarIcon,
  MapIcon
} from '@heroicons/react/24/outline';
import orderService from '@/services/orderService';
import captureService from '@/services/captureService';

interface Metrics {
  orders: {
    total: number;
    pending: number;
    inTransit: number;
    delivered: number;
    failed: number;
    incomplete: number;
    delayed: number;
    todayDeliveries: number;
  };
  captures: {
    pending: number;
    failed: number;
    success: number;
    partial: number;
  };
  revenue: {
    total: number;
    pending: number;
    average: number;
  };
  routes?: {
    total: number;
    active: number;
    draft: number;
    completed: number;
    totalOrders: number;
  };
}

export default function HomePage() {
  const router = useRouter();
  const { user, loading: authLoading, requireAuth } = useAuth();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requireAuth(); // Verificar autenticación
  }, []);

  useEffect(() => {
    if (user) {
      fetchMetrics();
    }
  }, [user]);

  const fetchMetrics = async () => {
    try {
      // Obtener pedidos del día desde la API
      const ordersResponse = await orderService.getOrders({ limit: 100 });
      const orders = ordersResponse.data || [];
      
      // Obtener métricas desde la API
      const metricsResponse = await orderService.getMetrics();
      const apiMetrics = metricsResponse.metrics || {};
      
      // Calcular métricas desde los pedidos
      const orderMetrics = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        inTransit: orders.filter(o => o.status === 'in_transit').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        failed: orders.filter(o => o.status === 'failed').length,
        incomplete: orders.filter(o => o.status === 'incomplete').length,
        delayed: orders.filter(o => o.status === 'pending' && new Date(o.estimatedDelivery) < new Date()).length,
        todayDeliveries: orders.filter(o => {
          const deliveryDate = new Date(o.estimatedDelivery);
          const today = new Date();
          return o.status === 'delivered' && deliveryDate.toDateString() === today.toDateString();
        }).length
      };
      
      // Obtener capturas si está disponible
      let captureMetrics = {
        pending: 0,
        failed: 0,
        success: apiMetrics.delivered || 0,
        partial: 0
      };
      
      try {
        const capturesResponse = await captureService.getCaptures();
        if (capturesResponse.success && capturesResponse.captures) {
          const captures = capturesResponse.captures;
          captureMetrics = {
            pending: captures.filter(c => c.status === 'pending').length,
            failed: captures.filter(c => c.status === 'rejected').length,
            success: captures.filter(c => c.status === 'verified').length,
            partial: captures.filter(c => c.status === 'incomplete').length
          };
        }
      } catch (error) {
        console.log('Error obteniendo capturas, usando valores por defecto');
      }
      
      // Calcular ingresos
      const revenueMetrics = {
        total: apiMetrics.total_earnings || orders.reduce((sum, order) => sum + (order.driverPayment || 0), 0),
        pending: orders.filter(o => o.status === 'pending').reduce((sum, order) => sum + (order.driverPayment || 0), 0),
        average: orders.length > 0 ? (apiMetrics.total_earnings || 0) / orders.length : 0
      };
      
      // Obtener rutas si está disponible
      let routeMetrics = {
        total: 0,
        active: 0,
        draft: 0,
        completed: 0,
        totalOrders: orders.length
      };
      
      try {
        const routesResponse = await orderService.getRoutes();
        if (routesResponse.success && routesResponse.routes) {
          const routes = routesResponse.routes as any[];
          routeMetrics = {
            total: routes.length,
            active: routes.filter((r: any) => r.status === 'active').length,
            draft: routes.filter((r: any) => r.status === 'draft').length,
            completed: routes.filter((r: any) => r.status === 'completed').length,
            totalOrders: routes.reduce((sum: number, route: any) => sum + (route.orders?.length || 0), 0)
          };
        }
      } catch (error) {
        console.log('Error obteniendo rutas, usando valores por defecto');
      }
      
      setMetrics({
        orders: orderMetrics,
        captures: captureMetrics,
        revenue: revenueMetrics,
        routes: routeMetrics
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
      // Establecer métricas vacías si hay error
      setMetrics({
        orders: {
          total: 0,
          pending: 0,
          inTransit: 0,
          delivered: 0,
          failed: 0,
          incomplete: 0,
          delayed: 0,
          todayDeliveries: 0
        },
        captures: {
          pending: 0,
          failed: 0,
          success: 0,
          partial: 0
        },
        revenue: {
          total: 0,
          pending: 0,
          average: 0
        },
        routes: {
          total: 0,
          active: 0,
          draft: 0,
          completed: 0,
          totalOrders: 0
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: ShoppingCartIcon,
      title: 'Gestión de Pedidos',
      description: 'Administra todos tus pedidos en un solo lugar',
      link: '/pedidos',
      stats: metrics ? [
        { label: 'Total', value: metrics.orders.total, type: 'neutral' },
        { label: 'Pendientes', value: metrics.orders.pending, type: 'warning' },
        { label: 'En Tránsito', value: metrics.orders.inTransit, type: 'info' },
        { label: 'Entregados', value: metrics.orders.delivered, type: 'success' }
      ] : [],
      urgent: metrics?.orders.delayed || 0
    },
    {
      icon: CameraIcon,
      title: 'Capturas',
      description: 'Captura y guarda evidencias de entrega',
      link: '/capturas',
      stats: metrics ? [
        { label: 'Pendientes', value: metrics.captures.pending, type: 'warning' },
        { label: 'Fallidas', value: metrics.captures.failed, type: 'danger' },
        { label: 'Completadas', value: metrics.captures.success, type: 'success' }
      ] : [],
      urgent: metrics?.captures.failed || 0
    },
    {
      icon: CreditCardIcon,
      title: 'Control de Pagos',
      description: 'Gestiona y rastrea todos tus pagos',
      link: '/pagos',
      stats: metrics ? [
        { label: 'Pendientes', value: metrics.revenue.pending, type: 'warning' },
        { label: 'Total Cobrado', value: `${metrics.revenue.total} CUP`, type: 'success' }
      ] : [],
      urgent: 0
    },
    {
      icon: UserCircleIcon,
      title: 'Mi Cuenta',
      description: 'Administra tu información personal',
      link: '/cuenta',
      stats: [
        { label: 'Perfil', value: 'Activo', type: 'success' },
        { label: 'Sesión', value: 'Conectado', type: 'success' }
      ],
      urgent: 0
    }
  ];

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold">Panel de Control</h1>
          <p className="mt-2 text-primary-100">Resumen general de tu operación de entregas</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-base p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{metrics?.orders.total || 0}</p>
              </div>
              <ShoppingCartIcon className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          
          <div className="card-base p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Entregados</p>
                <p className="text-2xl font-bold text-green-600">
                  {metrics?.orders.delivered || 0}
                </p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-400" />
            </div>
          </div>
          
          <div className="card-base p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Proceso</p>
                <p className="text-2xl font-bold text-blue-600">
                  {metrics ? metrics.orders.pending + metrics.orders.inTransit : 0}
                </p>
              </div>
              <ClockIcon className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          
          <div className="card-base p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ingresos</p>
                <p className="text-xl font-bold text-primary-600">
                  {metrics?.revenue.total || 0} CUP
                </p>
              </div>
              <CurrencyDollarIcon className="h-8 w-8 text-primary-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="card-base p-6 relative">
                {feature.urgent > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold animate-pulse-badge">
                    {feature.urgent}
                  </div>
                )}
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="bg-primary-100 rounded-lg p-3">
                      <Icon className="h-6 w-6 text-primary-600" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{feature.description}</p>
                    
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {feature.stats.map((stat, statIndex) => (
                        <div key={statIndex} className="text-sm">
                          <span className="text-gray-500">{stat.label}: </span>
                          <span className={`font-semibold ${
                            stat.type === 'success' ? 'text-green-600' :
                            stat.type === 'warning' ? 'text-yellow-600' :
                            stat.type === 'danger' ? 'text-red-600' :
                            stat.type === 'info' ? 'text-blue-600' :
                            'text-gray-900'
                          }`}>
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <Link 
                      href={feature.link}
                      className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      Ver Detalles
                      <ArrowRightIcon className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Alerts Section */}
        {metrics && (metrics.orders.delayed > 0 || metrics.orders.failed > 0 || metrics.captures.failed > 0) && (
          <div className="mt-6 card-base p-6 border-red-300 bg-red-50">
            <div className="flex items-start space-x-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900">Atención Requerida</h3>
                <div className="mt-2 space-y-2">
                  {metrics.orders.delayed > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-red-700">
                        {metrics.orders.delayed} pedidos atrasados
                      </span>
                      <Link 
                        href="/pedidos?delayed=true"
                        className="text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        Ver →
                      </Link>
                    </div>
                  )}
                  {metrics.orders.failed > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-red-700">
                        {metrics.orders.failed} pedidos fallidos
                      </span>
                      <Link 
                        href="/pedidos?status=failed"
                        className="text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        Ver →
                      </Link>
                    </div>
                  )}
                  {metrics.captures.failed > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-red-700">
                        {metrics.captures.failed} capturas fallidas
                      </span>
                      <Link 
                        href="/capturas?status=failed"
                        className="text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        Ver →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}