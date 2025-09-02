'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import useOrderStore from '@/store/orderStore';
import { Order, OrderStatusLabels, OrderTypeLabels, canTransitionToStatus } from '@/types/order';
import { 
  ArrowLeftIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  CameraIcon,
  DocumentTextIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { selectedOrder, fetchOrderById, loading } = useOrderStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [captureNotes, setCaptureNotes] = useState('');
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [incompleteReason, setIncompleteReason] = useState('');
  const [showDeliveredModal, setShowDeliveredModal] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState('');

  useEffect(() => {
    if (params.id) {
      handleFetchOrder(params.id as string);
    }
  }, [params.id, fetchOrderById]);

  useEffect(() => {
    if (selectedOrder) {
      setOrder(selectedOrder);
    }
  }, [selectedOrder]);

  const handleFetchOrder = async (id: string) => {
    try {
      const fetchedOrder = await fetchOrderById(id);
      if (fetchedOrder) {
        setOrder(fetchedOrder);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Error al cargar el pedido');
      router.push('/pedidos');
    }
  };

  const updateOrderStatus = async (newStatus: Order['status']) => {
    if (!order) return;

    if (!canTransitionToStatus(order.status, newStatus)) {
      toast.error(`No se puede cambiar de ${OrderStatusLabels[order.status]} a ${OrderStatusLabels[newStatus]}`);
      return;
    }

    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/delivery/orders/${params.id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const updatedOrder = { ...order, status: newStatus };
      setOrder(updatedOrder);
      toast.success('Estado actualizado correctamente');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Error al actualizar el estado');
    } finally {
      setUpdating(false);
    }
  };

  const toggleItemDelivered = async (itemId: string) => {
    if (!order) return;

    const updatedItems = order.items.map(item =>
      item.id === itemId ? { ...item, delivered: !item.delivered } : item
    );

    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/delivery/orders/${params.id}/items/${itemId}`, 
        { delivered: !order.items.find(item => item.id === itemId)?.delivered },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const updatedOrder = { ...order, items: updatedItems };
      setOrder(updatedOrder);
      toast.success('Item actualizado');
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Error al actualizar el item');
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkDelivered = async () => {
    if (!order) return;

    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      
      // Mark order as delivered with delivery notes
      await axios.put(`/api/delivery/orders/${params.id}/deliver`, 
        { 
          notes: deliveryNotes || `Entrega completada para pedido ${order.id}`,
          location: {
            latitude: 23.1136,
            longitude: -82.3666,
            address: `${order.address}, ${order.municipality}`
          }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update order status to delivered
      const updatedOrder = {
        ...order,
        status: 'delivered' as const,
        captureStatus: 'success' as const,
        notes: order.notes ? `${order.notes}\n\nEntrega confirmada: ${deliveryNotes || 'Sin notas adicionales'}` : `Entrega confirmada: ${deliveryNotes || 'Sin notas adicionales'}`
      };
      
      setOrder(updatedOrder);
      toast.success('Pedido marcado como entregado');
      setShowDeliveredModal(false);
      setDeliveryNotes('');
    } catch (error) {
      console.error('Error marking as delivered:', error);
      toast.error('Error al marcar como entregado');
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkIncomplete = async () => {
    if (!order || !incompleteReason.trim()) {
      toast.error('Por favor ingrese una razón');
      return;
    }

    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      
      // Mark order as incomplete with reason
      await axios.put(`/api/delivery/orders/${params.id}/incomplete`, 
        { reason: incompleteReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update order status to incomplete
      const updatedOrder = {
        ...order,
        status: 'incomplete' as const,
        notes: order.notes ? `${order.notes}\n\nRazón incompleto: ${incompleteReason}` : `Razón incompleto: ${incompleteReason}`
      };
      
      setOrder(updatedOrder);
      toast.success('Pedido marcado como incompleto');
      setShowIncompleteModal(false);
      setIncompleteReason('');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Error al actualizar el pedido');
    } finally {
      setUpdating(false);
    }
  };

  const handleCapture = async () => {
    if (!order) return;

    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      
      // Create capture record
      await axios.post(`/api/delivery/orders/${params.id}/captures`, 
        {
          type: 'document',
          notes: captureNotes || `Albarán capturado para pedido ${order.id}`,
          location: {
            latitude: 23.1136,
            longitude: -82.3666,
            address: `${order.address}, ${order.municipality}`
          }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update order capture status
      const updatedOrder = {
        ...order,
        captureStatus: 'success' as const
      };
      
      setOrder(updatedOrder);
      toast.success('Albarán capturado exitosamente');
      setShowCaptureModal(false);
      setCaptureNotes('');
    } catch (error) {
      console.error('Error capturing:', error);
      toast.error('Error al capturar el albarán');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Pedido no encontrado</h2>
          <Link href="/pedidos" className="mt-4 text-primary-600 hover:text-primary-700">
            Volver a pedidos
          </Link>
        </div>
      </div>
    );
  }

  const statusStyles = {
    pending: 'badge-pending',
    in_transit: 'badge-in-transit',
    delivered: 'badge-delivered',
    incomplete: 'badge-incomplete',
    failed: 'badge-failed'
  };

  const estimatedDelivery = new Date(order.estimatedDelivery);
  const isDelayed = new Date() > estimatedDelivery && !['delivered', 'failed'].includes(order.status);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/pedidos" className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Pedido #{order.id}</h1>
                <p className="text-sm text-gray-500">
                  Creado {new Date(order.createdAt).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`badge-base ${statusStyles[order.status]}`}>
                {OrderStatusLabels[order.status]}
              </span>
              {order.type === 'express' && (
                <span className="badge-base bg-purple-100 text-purple-800">
                  {OrderTypeLabels[order.type]}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-3">
            {/* Client Information */}
            <div className="card-base p-4">
              <h2 className="text-base font-semibold text-gray-900 mb-3">Cliente</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start space-x-2">
                  <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{order.clientName}</p>
                    <p className="text-sm text-gray-600">{order.address}</p>
                    <p className="text-xs text-gray-500">{order.municipality}, {order.province}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <p className="text-sm text-gray-600">{order.clientPhone}</p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="card-base p-4">
              <h2 className="text-base font-semibold text-gray-900 mb-3">Items ({order.items.length})</h2>
              <div className="space-y-1.5">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={item.delivered || false}
                        onChange={() => toggleItemDelivered(item.id)}
                        disabled={updating || order.status === 'delivered'}
                        className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name} <span className="text-gray-500">x{item.quantity}</span></p>
                      </div>
                    </div>
                    {item.delivered && (
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="card-base p-4">
                <h2 className="text-base font-semibold text-gray-900 mb-2">Notas</h2>
                <p className="text-sm text-gray-600">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-3">
            {/* Delivery Info */}
            <div className="card-base p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Entrega</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Fecha</span>
                  <span className={`font-medium ${isDelayed ? 'text-red-600' : 'text-gray-900'}`}>
                    {estimatedDelivery.toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short'
                    })} {estimatedDelivery.toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                {isDelayed && (
                  <div className="p-2 bg-red-50 rounded text-xs text-red-800">
                    ⚠️ Pedido atrasado
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pago</span>
                  <span className="font-medium text-gray-900">{order.driverPayment} CUP</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Captura</span>
                  <span className={`text-xs font-medium ${
                    order.captureStatus === 'success' ? 'text-green-600' :
                    order.captureStatus === 'failed' ? 'text-red-600' :
                    order.captureStatus === 'partial' ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    {order.captureStatus === 'pending' ? 'Pendiente' :
                     order.captureStatus === 'partial' ? 'Parcial' :
                     order.captureStatus === 'success' ? 'Completada' :
                     'Fallida'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="card-base p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Acciones</h3>
              <div className="space-y-2">
                {order.status === 'in_transit' && (
                  <>
                    <button
                      onClick={() => setShowDeliveredModal(true)}
                      disabled={updating}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      <CheckCircleIcon className="h-5 w-5 inline mr-2" />
                      Marcar como Entregado
                    </button>
                    <button
                      onClick={() => setShowIncompleteModal(true)}
                      disabled={updating}
                      className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                    >
                      Marcar como Incompleto
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowCaptureModal(true)}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <CameraIcon className="h-5 w-5 inline mr-2" />
                  Capturar Albarán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delivered Modal */}
      {showDeliveredModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
             onClick={() => setShowDeliveredModal(false)}>
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
               onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Confirmar Entrega
                </h2>
                <button
                  onClick={() => setShowDeliveredModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircleIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-4">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">
                  Para confirmar la entrega, debe capturar el albarán como evidencia
                </p>
                
                {/* Capture Section */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capturas del Albarán <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Photo Upload Areas */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-500 cursor-pointer transition-colors">
                      <CameraIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500">Foto 1</p>
                      <p className="text-xs text-primary-600 mt-1">Tomar foto</p>
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-500 cursor-pointer transition-colors">
                      <CameraIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500">Foto 2</p>
                      <p className="text-xs text-primary-600 mt-1">Tomar foto</p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 mb-4">
                    En la app real, aquí se activaría la cámara para capturar las fotos del albarán
                  </p>
                </div>
                
                {/* Notes */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas de entrega (opcional)
                  </label>
                  <textarea
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                    placeholder="Ej: Entregado a portero, recibido por familiar..."
                  />
                </div>
                
                {/* Items Checklist */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Items entregados
                  </label>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={item.delivered || false}
                          disabled
                          className="h-4 w-4 text-primary-600 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          {item.name} (x{item.quantity})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Order Info */}
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Pedido:</strong> #{order.id}<br />
                    <strong>Cliente:</strong> {order.clientName}<br />
                    <strong>Dirección:</strong> {order.address}
                  </p>
                </div>
                
                {/* Important Notice */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    ℹ️ Al confirmar, se marcará el pedido como entregado y se guardarán las capturas como evidencia
                  </p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setShowDeliveredModal(false);
                    setDeliveryNotes('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleMarkDelivered}
                  disabled={updating}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {updating ? (
                    <>
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Confirmando...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-5 w-5 inline mr-2" />
                      Confirmar Entrega
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Incomplete Modal */}
      {showIncompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
             onClick={() => setShowIncompleteModal(false)}>
          <div className="bg-white rounded-lg max-w-md w-full"
               onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Marcar Pedido como Incompleto
                </h2>
                <button
                  onClick={() => setShowIncompleteModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircleIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-4">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">
                  Por favor indique la razón por la cual el pedido quedó incompleto
                </p>
                
                {/* Reason Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Razón <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={incompleteReason}
                    onChange={(e) => setIncompleteReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    rows={4}
                    placeholder="Ej: Cliente no disponible, dirección incorrecta, falta de stock..."
                    required
                  />
                </div>
                
                {/* Order Info */}
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Pedido:</strong> #{order.id}<br />
                    <strong>Cliente:</strong> {order.clientName}<br />
                    <strong>Dirección:</strong> {order.address}
                  </p>
                </div>
                
                {/* Warning */}
                <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-800">
                    ⚠️ Esta acción marcará el pedido como incompleto y requerirá seguimiento posterior
                  </p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setShowIncompleteModal(false);
                    setIncompleteReason('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleMarkIncomplete}
                  disabled={updating || !incompleteReason.trim()}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                >
                  {updating ? (
                    <>
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <ExclamationCircleIcon className="h-5 w-5 inline mr-2" />
                      Confirmar Incompleto
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Capture Modal */}
      {showCaptureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
             onClick={() => setShowCaptureModal(false)}>
          <div className="bg-white rounded-lg max-w-md w-full"
               onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Capturar Albarán
                </h2>
                <button
                  onClick={() => setShowCaptureModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircleIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-4">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">
                  Simularemos la captura de un albarán para el pedido #{order.id}
                </p>
                
                {/* Photo Preview */}
                <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                  <div className="flex items-center justify-center">
                    <CameraIcon className="h-24 w-24 text-gray-400" />
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-2">
                    En la app real, aquí se mostraría la cámara o foto capturada
                  </p>
                </div>
                
                {/* Notes */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas (opcional)
                  </label>
                  <textarea
                    value={captureNotes}
                    onChange={(e) => setCaptureNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                    placeholder="Agregar notas sobre la captura..."
                  />
                </div>
                
                {/* Order Info */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Cliente:</strong> {order.clientName}<br />
                    <strong>Dirección:</strong> {order.address}<br />
                    <strong>Items:</strong> {order.items.length}
                  </p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowCaptureModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCapture}
                  disabled={updating}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {updating ? (
                    <>
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Capturando...
                    </>
                  ) : (
                    <>
                      <CameraIcon className="h-5 w-5 inline mr-2" />
                      Confirmar Captura
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}