import { useState, useEffect } from 'react';
import {
  PlusIcon,
  XMarkIcon,
  ArrowsUpDownIcon,
  MapPinIcon,
  ClockIcon,
  CheckIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { Route, RouteOrder, RouteColors } from '@/types/route';
import { Order } from '@/types/order';
import useOrderStore from '@/store/orderStore';
import toast from 'react-hot-toast';

interface RouteBuilderProps {
  route?: Route;
  onSave: (route: Partial<Route>) => void;
  onCancel: () => void;
}

export default function RouteBuilder({ route, onSave, onCancel }: RouteBuilderProps) {
  const { orders, fetchOrders } = useOrderStore();
  const [name, setName] = useState(route?.name || '');
  const [description, setDescription] = useState(route?.description || '');
  const [color, setColor] = useState(route?.color || 'bg-blue-500');
  const [selectedOrders, setSelectedOrders] = useState<RouteOrder[]>(route?.orders || []);
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    // Filter pending orders and exclude already selected ones
    const filtered = orders.filter((order: Order) => {
      return order.status === 'pending' && !selectedOrders.some(so => so.orderId === order.id);
    });
    setAvailableOrders(filtered);
  }, [orders, selectedOrders]);



  const handleAddOrder = (order: Order) => {
    const newRouteOrder: RouteOrder = {
      orderId: order.id,
      position: selectedOrders.length + 1,
      estimatedTime: '15 min',
      distance: '2.5 km'
    };
    
    setSelectedOrders([...selectedOrders, newRouteOrder]);
    setAvailableOrders(availableOrders.filter(o => o.id !== order.id));
  };

  const handleRemoveOrder = (orderId: string) => {
    // Remove from selected and reposition
    const updated = selectedOrders
      .filter(o => o.orderId !== orderId)
      .map((order, index) => ({
        ...order,
        position: index + 1
      }));
    
    setSelectedOrders(updated);
    // Refresh available orders
    fetchOrders();
  };

  const handleDragStart = (index: number) => {
    setIsDragging(true);
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const draggedOrder = selectedOrders[draggedIndex];
    const newOrders = [...selectedOrders];
    
    // Remove dragged item
    newOrders.splice(draggedIndex, 1);
    
    // Insert at new position
    newOrders.splice(index, 0, draggedOrder);
    
    // Update positions
    const repositioned = newOrders.map((order, idx) => ({
      ...order,
      position: idx + 1
    }));
    
    setSelectedOrders(repositioned);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedIndex(null);
  };

  const calculateTotals = () => {
    const totalDistance = selectedOrders.reduce((sum, order) => {
      const km = parseFloat(order.distance?.replace(' km', '') || '0');
      return sum + km;
    }, 0);

    const totalTime = selectedOrders.reduce((sum, order) => {
      const time = order.estimatedTime || '0 min';
      const minutes = parseTimeToMinutes(time);
      return sum + minutes;
    }, 0);

    return {
      distance: `${totalDistance.toFixed(1)} km`,
      time: formatMinutesToTime(totalTime)
    };
  };

  const parseTimeToMinutes = (time: string): number => {
    const hourMatch = time.match(/(\d+)h/);
    const minuteMatch = time.match(/(\d+)min/);
    const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
    const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
    return hours * 60 + minutes;
  };

  const formatMinutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins} min`;
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('El nombre de la ruta es requerido');
      return;
    }

    const totals = calculateTotals();
    
    const routeData: Partial<Route> = {
      name: name.trim(),
      description: description.trim(),
      color,
      orders: selectedOrders,
      totalDistance: totals.distance,
      estimatedTime: totals.time,
      status: route?.status || 'draft'
    };

    onSave(routeData);
  };

  const filteredAvailableOrders = availableOrders.filter(order => {
    const search = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(search) ||
      order.clientName.toLowerCase().includes(search) ||
      order.address.toLowerCase().includes(search)
    );
  });

  const totals = calculateTotals();

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-lg bg-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {route ? 'Editar Ruta' : 'Nueva Ruta'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Route Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Ruta *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-base"
                placeholder="Ej: Ruta Centro Habana"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-base"
                rows={3}
                placeholder="Descripción opcional de la ruta"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color de la Ruta
              </label>
              <div className="grid grid-cols-4 gap-2">
                {RouteColors.map((routeColor) => (
                  <button
                    key={routeColor.value}
                    onClick={() => setColor(routeColor.value)}
                    className={`
                      p-3 rounded-lg border-2 transition-all
                      ${color === routeColor.value
                        ? 'border-primary-500 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className={`h-6 w-full rounded ${routeColor.value}`} />
                    <p className="text-xs mt-1 text-gray-600">{routeColor.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Route Summary */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Resumen</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{selectedOrders.length}</p>
                  <p className="text-xs text-gray-500">Pedidos</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{totals.distance}</p>
                  <p className="text-xs text-gray-500">Distancia</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{totals.time}</p>
                  <p className="text-xs text-gray-500">Tiempo Est.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Selection */}
          <div className="space-y-4">
            {/* Selected Orders */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Pedidos en la Ruta ({selectedOrders.length})
                </label>
                {selectedOrders.length > 1 && (
                  <span className="text-xs text-gray-500">
                    <ArrowsUpDownIcon className="h-3 w-3 inline mr-1" />
                    Arrastra para reordenar
                  </span>
                )}
              </div>
              
              <div className="border rounded-lg p-2 min-h-[200px] max-h-[300px] overflow-y-auto bg-gray-50">
                {selectedOrders.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <MapPinIcon className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">No hay pedidos en la ruta</p>
                    <p className="text-xs">Agrega pedidos desde la lista</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedOrders.map((order, index) => (
                      <div
                        key={order.orderId}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`
                          p-2 bg-white rounded border cursor-move
                          ${isDragging && draggedIndex === index ? 'opacity-50' : ''}
                          hover:shadow-sm transition-shadow
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${color} text-white text-xs font-bold`}>
                              {order.position}
                            </span>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{order.orderId}</p>
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <span>{order.distance}</span>
                                <span>•</span>
                                <span>{order.estimatedTime}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveOrder(order.orderId)}
                            className="p-1 hover:bg-red-50 rounded text-red-600"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Available Orders */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Pedidos Disponibles ({filteredAvailableOrders.length})
              </label>
              
              <div className="relative mb-2">
                <input
                  type="text"
                  placeholder="Buscar pedidos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-base pl-9 text-sm"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              
              <div className="border rounded-lg p-2 max-h-[200px] overflow-y-auto">
                {filteredAvailableOrders.length === 0 ? (
                  <p className="text-center py-4 text-sm text-gray-400">
                    No hay pedidos disponibles
                  </p>
                ) : (
                  <div className="space-y-1">
                    {filteredAvailableOrders.map((order) => (
                      <div
                        key={order.id}
                        className="p-2 hover:bg-gray-50 rounded cursor-pointer group"
                        onClick={() => handleAddOrder(order)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{order.id}</p>
                            <p className="text-xs text-gray-500">{order.clientName}</p>
                            <p className="text-xs text-gray-400 truncate">
                              {order.address}
                            </p>
                          </div>
                          <PlusIcon className="h-5 w-5 text-gray-400 group-hover:text-primary-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t">
          <button
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="btn-primary inline-flex items-center"
          >
            <CheckIcon className="h-5 w-5 mr-2" />
            {route ? 'Guardar Cambios' : 'Crear Ruta'}
          </button>
        </div>
      </div>
    </div>
  );
}