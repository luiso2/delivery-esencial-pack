'use client';

import { useEffect, useState } from 'react';
import { 
  CreditCardIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon,
  BanknotesIcon,
  ArrowPathIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { mockPayments, weeklyPaymentHistory, paymentMethodSummary } from '@/data/mockPayments';
import { mockOrders } from '@/data/mockOrders';
import { Payment } from '@/types/payment';

interface PaymentWithOrder extends Payment {
  order?: any;
}

interface PaymentData {
  payments: PaymentWithOrder[];
  summary: {
    totalPending: number;
    totalCompleted: number;
    totalCancelled: number;
    totalAmount: number;
    pendingCount: number;
    completedCount: number;
    cancelledCount: number;
  };
  weeklyHistory: Array<{
    week: string;
    completed: number;
    pending: number;
  }>;
  methodSummary: Array<{
    method: string;
    total: number;
    percentage: number;
  }>;
}

export default function PagosPage() {
  const [data, setData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let filteredPayments = [...mockPayments];
      
      // Apply status filter
      if (filter !== 'all') {
        filteredPayments = filteredPayments.filter(payment => payment.status === filter);
      }
      
      // Add order details to payments
      const paymentsWithOrders = filteredPayments.map(payment => ({
        ...payment,
        order: mockOrders.find(order => order.id === payment.orderId)
      }));
      
      // Calculate summary
      const summary = {
        totalPending: mockPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
        totalCompleted: mockPayments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
        totalCancelled: mockPayments.filter(p => p.status === 'cancelled').reduce((sum, p) => sum + p.amount, 0),
        totalAmount: mockPayments.reduce((sum, p) => sum + p.amount, 0),
        pendingCount: mockPayments.filter(p => p.status === 'pending').length,
        completedCount: mockPayments.filter(p => p.status === 'completed').length,
        cancelledCount: mockPayments.filter(p => p.status === 'cancelled').length
      };
      
      setData({
        payments: paymentsWithOrders,
        summary,
        weeklyHistory: weeklyPaymentHistory,
        methodSummary: paymentMethodSummary
      });
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Error al cargar los pagos');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'badge-delivered';
      case 'pending':
        return 'badge-pending';
      case 'cancelled':
        return 'badge-failed';
      default:
        return '';
    }
  };

  const getMethodIcon = (method?: string) => {
    switch (method) {
      case 'cash':
        return <BanknotesIcon className="h-4 w-4" />;
      case 'transfer':
        return <CreditCardIcon className="h-4 w-4" />;
      default:
        return <CurrencyDollarIcon className="h-4 w-4" />;
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">Control de Pagos</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fetchPayments()}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                disabled={loading}
              >
                <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <FunnelIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Summary Bar - Minimalista para móvil */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Cobrado</p>
                <p className="text-base sm:text-lg font-bold text-green-600 truncate">
                  {data?.summary.totalCompleted || 0} CUP
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-5 w-5 text-yellow-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Pendiente</p>
                <p className="text-base sm:text-lg font-bold text-yellow-600 truncate">
                  {data?.summary.totalPending || 0} CUP
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
          <div className="flex space-x-1 p-1">
            {['all', 'pending', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`flex-1 py-2 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {status === 'all' ? 'Todos' :
                 status === 'pending' ? 'Pendientes' :
                 status === 'completed' ? 'Completados' : 'Cancelados'}
              </button>
            ))}
          </div>
        </div>

        {/* Weekly Trend */}
        {showDetails && data?.weeklyHistory && (
          <div className="card-base p-4 sm:p-6 mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Tendencia Semanal</h3>
            <div className="grid grid-cols-5 gap-1 sm:gap-2">
              {data.weeklyHistory.map((week) => (
                <div key={week.week} className="text-center">
                  <p className="text-xs text-gray-500 mb-1">{week.week}</p>
                  <div className="space-y-1">
                    <div className="bg-green-100 rounded p-0.5 sm:p-1">
                      <p className="text-xs font-semibold text-green-800">
                        {week.completed}
                      </p>
                    </div>
                    <div className="bg-yellow-100 rounded p-0.5 sm:p-1">
                      <p className="text-xs font-semibold text-yellow-800">
                        {week.pending}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Methods Summary */}
        {showDetails && data?.methodSummary && (
          <div className="card-base p-4 sm:p-6 mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Métodos de Pago</h3>
            <div className="space-y-2">
              {data.methodSummary.map((method) => (
                <div key={method.method}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs sm:text-sm text-gray-600">{method.method}</span>
                    <span className="text-xs sm:text-sm font-semibold">{method.total} CUP ({method.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                    <div
                      className="bg-primary-600 h-1.5 sm:h-2 rounded-full transition-all duration-500"
                      style={{ width: `${method.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payments List */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Lista de Pagos {filter !== 'all' && `(${filter === 'pending' ? 'Pendientes' : filter === 'completed' ? 'Completados' : 'Cancelados'})`}
          </h3>
          
          {data?.payments.map((payment) => (
            <div key={payment.id} className="card-base p-3 sm:p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">
                      #{payment.id}
                    </span>
                    <span className={`badge-base text-xs ${getStatusBadge(payment.status)}`}>
                      {payment.status === 'completed' ? 'Pagado' :
                       payment.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                    </span>
                    {payment.method && (
                      <div className="hidden sm:flex items-center space-x-1 text-gray-500">
                        {getMethodIcon(payment.method)}
                        <span className="text-xs">
                          {payment.method === 'cash' ? 'Efectivo' :
                           payment.method === 'transfer' ? 'Transfer' : 'Otro'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">
                    <span className="inline-block mr-3">Pedido: {payment.orderId}</span>
                    {payment.order && (
                      <span className="inline-block truncate max-w-[150px] sm:max-w-none">
                        {payment.order.clientName}
                      </span>
                    )}
                  </div>
                  
                  {payment.notes && (
                    <p className="text-xs text-gray-500 line-clamp-1 sm:line-clamp-2">
                      {payment.notes}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-3 text-xs text-gray-400 mt-1">
                    <span>
                      {new Date(payment.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short'
                      })}
                    </span>
                    {payment.paymentDate && (
                      <span>
                        Pagado: {new Date(payment.paymentDate).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short'
                        })}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-right ml-3 flex-shrink-0">
                  <p className="text-lg sm:text-xl font-bold text-gray-900">
                    {payment.amount}
                  </p>
                  <p className="text-xs text-gray-500">CUP</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}