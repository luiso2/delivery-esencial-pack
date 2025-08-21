'use client';

import { useEffect, useState } from 'react';
import { 
  CameraIcon,
  DocumentIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  FunnelIcon,
  ArrowPathIcon,
  PhotoIcon,
  MapPinIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { Capture, CaptureTypeLabels, CaptureStatusLabels, CaptureStats } from '@/types/capture';
import { mockCaptures } from '@/data/mockCaptures';
import Image from 'next/image';

interface CaptureData {
  captures: Capture[];
  stats: CaptureStats;
}

export default function CapturasPage() {
  const [data, setData] = useState<CaptureData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'incomplete'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'delivery' | 'return' | 'incident'>('all');
  const [selectedCapture, setSelectedCapture] = useState<Capture | null>(null);

  useEffect(() => {
    fetchCaptures();
  }, [filter, typeFilter]);

  const fetchCaptures = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let filteredCaptures = [...mockCaptures];
      
      // Apply status filter
      if (filter !== 'all') {
        filteredCaptures = filteredCaptures.filter(capture => capture.status === filter);
      }
      
      // Apply type filter
      if (typeFilter !== 'all') {
        filteredCaptures = filteredCaptures.filter(capture => capture.type === typeFilter);
      }
      
      // Calculate stats
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const stats: CaptureStats = {
        total: mockCaptures.length,
        pending: mockCaptures.filter(c => c.status === 'pending').length,
        verified: mockCaptures.filter(c => c.status === 'verified').length,
        rejected: mockCaptures.filter(c => c.status === 'rejected').length,
        incomplete: mockCaptures.filter(c => c.status === 'incomplete').length,
        todayCount: mockCaptures.filter(c => 
          new Date(c.capturedAt).toDateString() === today.toDateString()
        ).length,
        weekCount: mockCaptures.filter(c => 
          new Date(c.capturedAt) >= weekAgo
        ).length
      };
      
      setData({
        captures: filteredCaptures,
        stats
      });
    } catch (error) {
      console.error('Error fetching captures:', error);
      toast.error('Error al cargar las capturas');
    } finally {
      setLoading(false);
    }
  };

  const updateCaptureStatus = async (captureId: string, newStatus: 'verified' | 'rejected' | 'incomplete', reason?: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const captureIndex = mockCaptures.findIndex(c => c.id === captureId);
      if (captureIndex === -1) {
        throw new Error('Capture not found');
      }
      
      const updatedCapture = {
        ...mockCaptures[captureIndex],
        status: newStatus,
        updatedAt: new Date().toISOString()
      };
      
      if (newStatus === 'verified') {
        updatedCapture.verifiedBy = 'Admin';
        updatedCapture.verifiedAt = new Date().toISOString();
      } else if (newStatus === 'rejected' && reason) {
        updatedCapture.rejectionReason = reason;
        updatedCapture.verifiedBy = 'Admin';
        updatedCapture.verifiedAt = new Date().toISOString();
      }
      
      mockCaptures[captureIndex] = updatedCapture;
      
      const statusMessage = newStatus === 'verified' ? 'marcada como entregada' : 
                           newStatus === 'incomplete' ? 'marcada como incompleta' : 
                           'marcada con incidencia';
      toast.success(`Captura ${statusMessage}`);
      fetchCaptures();
      setSelectedCapture(null);
    } catch (error) {
      console.error('Error updating capture:', error);
      toast.error('Error al actualizar la captura');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'delivery':
        return <CameraIcon className="h-4 w-4" />;
      case 'signature':
        return <DocumentIcon className="h-4 w-4" />;
      case 'document':
        return <DocumentIcon className="h-4 w-4" />;
      default:
        return <PhotoIcon className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return 'badge-delivered';
      case 'pending':
        return 'badge-pending';
      case 'rejected':
        return 'badge-failed';
      case 'incomplete':
        return 'badge-incomplete';
      default:
        return '';
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
            <h1 className="text-xl font-semibold text-gray-900">Gestión de Capturas</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fetchCaptures()}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                disabled={loading}
              >
                <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="flex items-center space-x-2">
              <CameraIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-lg font-bold text-gray-900">{data?.stats.total || 0}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-xs text-gray-500">Pendientes</p>
                <p className="text-lg font-bold text-yellow-600">{data?.stats.pending || 0}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-xs text-gray-500">Entregados</p>
                <p className="text-lg font-bold text-green-600">{data?.stats.verified || 0}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ExclamationCircleIcon className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-xs text-gray-500">Incompletos</p>
                <p className="text-lg font-bold text-orange-600">{data?.stats.incomplete || 0}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <XCircleIcon className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-xs text-gray-500">Con incidencia</p>
                <p className="text-lg font-bold text-red-600">{data?.stats.rejected || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
          <div className="p-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Status Filter */}
              <div className="flex space-x-1">
                {['all', 'pending', 'incomplete'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status as any)}
                    className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-colors ${
                      filter === status
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {status === 'all' ? 'Todas' : 
                     status === 'pending' ? 'Pendientes' : 'Incompletos'}
                  </button>
                ))}
              </div>
              
              {/* Type Filter */}
              <div className="flex space-x-1 overflow-x-auto">
                {['all', 'delivery', 'return', 'incident'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type as any)}
                    className={`flex-shrink-0 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                      typeFilter === type
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {type === 'all' ? 'Todos' : CaptureTypeLabels[type as keyof typeof CaptureTypeLabels]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Captures List */}
        <div className="space-y-3">
          {data?.captures.map((capture) => (
            <div key={capture.id} className="card-base p-3 sm:p-4 cursor-pointer hover:shadow-md transition-shadow"
                 onClick={() => setSelectedCapture(capture)}>
              <div className="flex items-start space-x-3">
                {/* Thumbnail */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={capture.thumbnailUrl || capture.imageUrl}
                    alt={`Captura ${capture.id}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-20 transition-all">
                    <PhotoIcon className="h-6 w-6 text-white opacity-0 hover:opacity-100" />
                  </div>
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-gray-900">#{capture.id}</span>
                      <span className={`badge-base text-xs ${getStatusBadge(capture.status)}`}>
                        {CaptureStatusLabels[capture.status]}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      {getTypeIcon(capture.type)}
                      <span className="text-xs hidden sm:inline">{CaptureTypeLabels[capture.type]}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600 mb-1">
                    <span>Pedido: {capture.orderId}</span>
                    {capture.order && (
                      <span className="truncate max-w-[150px] sm:max-w-none">{capture.order.clientName}</span>
                    )}
                  </div>
                  
                  {capture.location && (
                    <div className="flex items-start space-x-1 text-xs text-gray-500 mb-1">
                      <MapPinIcon className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{capture.location.address}</span>
                    </div>
                  )}
                  
                  {capture.notes && (
                    <p className="text-xs text-gray-500 line-clamp-1 mb-1">{capture.notes}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">
                      {new Date(capture.capturedAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    {capture.verifiedBy && (
                      <span className="text-xs text-gray-400">
                        Verificado por {capture.verifiedBy}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {data?.captures.length === 0 && (
          <div className="text-center py-12">
            <CameraIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay capturas</h3>
            <p className="mt-1 text-sm text-gray-500">
              No se encontraron capturas con los filtros seleccionados
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedCapture && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
             onClick={() => setSelectedCapture(null)}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
               onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Captura #{selectedCapture.id}
                </h2>
                <button
                  onClick={() => setSelectedCapture(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircleIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-4">
              {/* Image */}
              <div className="mb-4">
                <img
                  src={selectedCapture.imageUrl}
                  alt={`Captura ${selectedCapture.id}`}
                  className="w-full rounded-lg"
                />
              </div>
              
              {/* Details */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Tipo</p>
                    <p className="font-medium">{CaptureTypeLabels[selectedCapture.type]}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Estado</p>
                    <span className={`badge-base ${getStatusBadge(selectedCapture.status)}`}>
                      {CaptureStatusLabels[selectedCapture.status]}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Pedido</p>
                    <p className="font-medium">{selectedCapture.orderId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Capturado por</p>
                    <p className="font-medium">{selectedCapture.capturedBy}</p>
                  </div>
                </div>
                
                {selectedCapture.location && (
                  <div>
                    <p className="text-xs text-gray-500">Ubicación</p>
                    <p className="font-medium">{selectedCapture.location.address}</p>
                  </div>
                )}
                
                {selectedCapture.notes && (
                  <div>
                    <p className="text-xs text-gray-500">Notas</p>
                    <p className="font-medium">{selectedCapture.notes}</p>
                  </div>
                )}
                
                {selectedCapture.rejectionReason && (
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-xs text-red-600 font-medium">Detalle de incidencia</p>
                    <p className="text-sm text-red-800">{selectedCapture.rejectionReason}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-xs text-gray-500">Fecha de captura</p>
                  <p className="font-medium">
                    {new Date(selectedCapture.capturedAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                
                {selectedCapture.verifiedAt && (
                  <div>
                    <p className="text-xs text-gray-500">Verificado</p>
                    <p className="font-medium">
                      {new Date(selectedCapture.verifiedAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })} por {selectedCapture.verifiedBy}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Actions */}
              {selectedCapture.status === 'pending' && (
                <div className="mt-6 space-y-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateCaptureStatus(selectedCapture.id, 'verified')}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <CheckCircleIcon className="h-5 w-5 inline mr-2" />
                      Entregado
                    </button>
                    <button
                      onClick={() => updateCaptureStatus(selectedCapture.id, 'incomplete')}
                      className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                    >
                      <ExclamationCircleIcon className="h-5 w-5 inline mr-2" />
                      Incompleto
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      const reason = prompt('Detalle de la incidencia:');
                      if (reason) {
                        updateCaptureStatus(selectedCapture.id, 'rejected', reason);
                      }
                    }}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <XCircleIcon className="h-5 w-5 inline mr-2" />
                    Reportar Incidencia
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}