'use client';

import { useEffect, useState } from 'react';
// import axios from 'axios';
import { mockOrders } from '@/data/mockOrders';
import { mockCaptures } from '@/data/mockCaptures';
import {
  ChartBarIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

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
}

export default function OrderMetrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Calculate metrics from mock data
      const totalOrders = mockOrders.length;
      const pendingOrders = mockOrders.filter(order => order.status === 'pending').length;
      const inTransitOrders = mockOrders.filter(order => order.status === 'in_transit').length;
      const deliveredOrders = mockOrders.filter(order => order.status === 'delivered').length;
      const failedOrders = mockOrders.filter(order => order.status === 'failed').length;
      const incompleteOrders = mockOrders.filter(order => order.status === 'incomplete').length;
      
      // Calculate delayed orders (estimated delivery passed)
      const now = new Date();
      const delayedOrders = mockOrders.filter(order => {
        const estimatedDelivery = new Date(order.estimatedDelivery);
        return now > estimatedDelivery && !['delivered', 'failed'].includes(order.status);
      }).length;
      
      // Today's deliveries
      const today = new Date().toDateString();
      const todayDeliveries = mockOrders.filter(order => {
        return order.status === 'delivered' && new Date(order.updatedAt).toDateString() === today;
      }).length;
      
      // Capture metrics
      const pendingCaptures = mockCaptures.filter(capture => capture.status === 'pending').length;
      const failedCaptures = mockCaptures.filter(capture => capture.status === 'rejected').length;
      const successCaptures = mockCaptures.filter(capture => capture.status === 'verified').length;
      const partialCaptures = mockCaptures.filter(capture => capture.status === 'incomplete').length;
      
      // Revenue metrics
      const totalRevenue = mockOrders.reduce((sum, order) => sum + order.driverPayment, 0);
      const pendingRevenue = mockOrders
        .filter(order => order.status === 'pending')
        .reduce((sum, order) => sum + order.driverPayment, 0);
      const averageRevenue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      
      const metricsData: Metrics = {
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          inTransit: inTransitOrders,
          delivered: deliveredOrders,
          failed: failedOrders,
          incomplete: incompleteOrders,
          delayed: delayedOrders,
          todayDeliveries
        },
        captures: {
          pending: pendingCaptures,
          failed: failedCaptures,
          success: successCaptures,
          partial: partialCaptures
        },
        revenue: {
          total: totalRevenue,
          pending: pendingRevenue,
          average: averageRevenue
        }
      };
      
      setMetrics(metricsData);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No se pudieron cargar las métricas</p>
      </div>
    );
  }

  const deliveryRate = metrics.orders.total > 0 
    ? Math.round((metrics.orders.delivered / metrics.orders.total) * 100)
    : 0;

  const captureRate = metrics.orders.total > 0
    ? Math.round((metrics.captures.success / metrics.orders.total) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-base p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Pedidos</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.orders.total}</p>
              <p className="text-sm text-gray-500 mt-1">
                {metrics.orders.todayDeliveries} para hoy
              </p>
            </div>
            <TruckIcon className="h-10 w-10 text-primary-400" />
          </div>
        </div>

        <div className="card-base p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tasa de Entrega</p>
              <p className="text-3xl font-bold text-green-600">{deliveryRate}%</p>
              <p className="text-sm text-gray-500 mt-1">
                {metrics.orders.delivered} completados
              </p>
            </div>
            <CheckCircleIcon className="h-10 w-10 text-green-400" />
          </div>
        </div>

        <div className="card-base p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ingresos Totales</p>
              <p className="text-2xl font-bold text-primary-600">
                {metrics.revenue.total} CUP
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Promedio: {metrics.revenue.average} CUP
              </p>
            </div>
            <CurrencyDollarIcon className="h-10 w-10 text-primary-400" />
          </div>
        </div>

        <div className="card-base p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pedidos Atrasados</p>
              <p className="text-3xl font-bold text-red-600">{metrics.orders.delayed}</p>
              <p className="text-sm text-gray-500 mt-1">
                Requieren atención
              </p>
            </div>
            <ClockIcon className="h-10 w-10 text-red-400" />
          </div>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="card-base p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Distribución por Estado
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Pendientes', value: metrics.orders.pending, color: 'bg-yellow-500' },
            { label: 'En Tránsito', value: metrics.orders.inTransit, color: 'bg-blue-500' },
            { label: 'Entregados', value: metrics.orders.delivered, color: 'bg-green-500' },
            { label: 'Incompletos', value: metrics.orders.incomplete, color: 'bg-orange-500' },
            { label: 'Fallidos', value: metrics.orders.failed, color: 'bg-red-500' },
          ].map((item) => {
            const percentage = metrics.orders.total > 0
              ? (item.value / metrics.orders.total) * 100
              : 0;
            
            return (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Capture Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-base p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Estado de Capturas
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">{metrics.captures.pending}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Parciales</p>
              <p className="text-2xl font-bold text-orange-600">{metrics.captures.partial}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Completadas</p>
              <p className="text-2xl font-bold text-green-600">{metrics.captures.success}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fallidas</p>
              <p className="text-2xl font-bold text-red-600">{metrics.captures.failed}</p>
            </div>
          </div>
        </div>

        <div className="card-base p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resumen Financiero
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Cobrado</span>
              <span className="font-semibold text-green-600">
                {metrics.revenue.total} CUP
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pendiente</span>
              <span className="font-semibold text-yellow-600">
                {metrics.revenue.pending} CUP
              </span>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Esperado</span>
                <span className="font-bold text-gray-900">
                  {metrics.revenue.total + metrics.revenue.pending} CUP
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}