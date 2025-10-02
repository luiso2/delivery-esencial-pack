/**
 * Store de órdenes usando Zustand
 */

import { create } from 'zustand';
import { Order, OrderStatus } from '@/types/order';
import orderService from '@/services/orderService';
import { OrderFilters } from '@/types/api';

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
  filters: OrderFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Actions
  fetchOrders: (filters?: OrderFilters) => Promise<void>;
  fetchOrderById: (id: string) => Promise<Order | null>;
  updateOrderStatus: (id: string, status: OrderStatus, notes?: string) => Promise<void>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
  setFilters: (filters: OrderFilters) => void;
  setSelectedOrder: (order: Order | null) => void;
  uploadEvidence: (orderId: string, type: string, data: string | File) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  clearError: () => void;
  clearFilters: () => void;
}

const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
  filters: {
    page: 1,
    limit: 10,
    status: [],
    search: '',
    delayed: false,
    type: null
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },

  /**
   * Obtener lista de pedidos con filtros
   */
  fetchOrders: async (filters?: OrderFilters) => {
    set({ loading: true, error: null });
    
    try {
      const currentFilters = filters || get().filters;
      console.log('[OrderStore] Obteniendo pedidos con filtros:', currentFilters);
      
      const response = await orderService.getOrders(currentFilters);
      
      if (response.success) {
        set({
          orders: response.data,
          pagination: response.pagination,
          loading: false,
          error: null
        });
        console.log('[OrderStore] Pedidos cargados:', response.data.length);
      } else {
        set({
          orders: [],
          loading: false,
          error: 'Error al cargar pedidos'
        });
      }
    } catch (error: any) {
      console.error('[OrderStore] Error al obtener pedidos:', error);
      set({
        orders: [],
        loading: false,
        error: error.message || 'Error al cargar pedidos'
      });
    }
  },

  /**
   * Obtener detalle de un pedido por ID
   */
  fetchOrderById: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      console.log('[OrderStore] Obteniendo pedido:', id);
      const order = await orderService.getOrderById(id);
      
      set({
        selectedOrder: order,
        loading: false,
        error: null
      });
      
      return order;
    } catch (error: any) {
      console.error('[OrderStore] Error al obtener pedido:', error);
      set({
        selectedOrder: null,
        loading: false,
        error: error.message || 'Pedido no encontrado'
      });
      return null;
    }
  },

  /**
   * Actualizar estado de un pedido
   */
  updateOrderStatus: async (id: string, status: OrderStatus, notes?: string) => {
    set({ loading: true, error: null });
    
    try {
      console.log('[OrderStore] Actualizando estado del pedido:', id, status);
      const updatedOrder = await orderService.updateOrderStatus(id, status, notes);
      
      // Actualizar el pedido en la lista
      set(state => ({
        orders: state.orders.map(order => 
          order.id === id ? updatedOrder : order
        ),
        selectedOrder: state.selectedOrder?.id === id ? updatedOrder : state.selectedOrder,
        loading: false,
        error: null
      }));
      
      console.log('[OrderStore] Estado actualizado exitosamente');
    } catch (error: any) {
      console.error('[OrderStore] Error al actualizar estado:', error);
      
      // Actualizar localmente aunque falle la llamada al servidor
      set(state => {
        const updatedOrders = state.orders.map(order => 
          order.id === id 
            ? { ...order, status, notes: notes || order.notes }
            : order
        );
        
        return {
          orders: updatedOrders,
          selectedOrder: state.selectedOrder?.id === id 
            ? { ...state.selectedOrder, status, notes: notes || state.selectedOrder.notes }
            : state.selectedOrder,
          loading: false,
          error: 'Actualizado localmente (sin conexión al servidor)'
        };
      });
    }
  },

  /**
   * Actualizar un pedido
   */
  updateOrder: async (id: string, updates: Partial<Order>) => {
    set({ loading: true, error: null });
    
    try {
      // Actualizar localmente primero
      set(state => ({
        orders: state.orders.map(order => 
          order.id === id ? { ...order, ...updates } : order
        ),
        selectedOrder: state.selectedOrder?.id === id 
          ? { ...state.selectedOrder, ...updates }
          : state.selectedOrder,
        loading: false,
        error: null
      }));
      
      // Si hay status en las actualizaciones, llamar al servicio
      if (updates.status) {
        await orderService.updateOrderStatus(id, updates.status, updates.notes);
      }
    } catch (error: any) {
      console.error('[OrderStore] Error al actualizar pedido:', error);
      set({
        loading: false,
        error: 'Actualización guardada localmente'
      });
    }
  },

  /**
   * Establecer filtros
   */
  setFilters: (filters: OrderFilters) => {
    set({ filters });
    // Automáticamente recargar pedidos con nuevos filtros
    get().fetchOrders(filters);
  },

  /**
   * Limpiar filtros
   */
  clearFilters: () => {
    const cleanFilters = {
      page: 1,
      limit: 10,
      status: [],
      search: '',
      delayed: false,
      type: null
    };
    set({ filters: cleanFilters });
    get().fetchOrders(cleanFilters);
  },

  /**
   * Establecer pedido seleccionado
   */
  setSelectedOrder: (order: Order | null) => {
    set({ selectedOrder: order });
  },

  /**
   * Subir evidencia de entrega
   */
  uploadEvidence: async (orderId: string, type: string, data: string | File) => {
    set({ loading: true, error: null });
    
    try {
      console.log('[OrderStore] Subiendo evidencia:', orderId, type);
      await orderService.uploadEvidence(orderId, type, data);
      
      // Actualizar el estado de captura del pedido
      set(state => ({
        orders: state.orders.map(order => 
          order.id === orderId 
            ? { ...order, captureStatus: 'success' }
            : order
        ),
        selectedOrder: state.selectedOrder?.id === orderId 
          ? { ...state.selectedOrder, captureStatus: 'success' }
          : state.selectedOrder,
        loading: false,
        error: null
      }));
      
      console.log('[OrderStore] Evidencia subida exitosamente');
    } catch (error: any) {
      console.error('[OrderStore] Error al subir evidencia:', error);
      
      // Actualizar localmente aunque falle
      set(state => ({
        orders: state.orders.map(order => 
          order.id === orderId 
            ? { ...order, captureStatus: 'success' }
            : order
        ),
        loading: false,
        error: 'Evidencia guardada localmente'
      }));
    }
  },

  /**
   * Eliminar pedido (solo local por ahora)
   */
  deleteOrder: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      // Por ahora solo eliminación local
      set(state => ({
        orders: state.orders.filter(order => order.id !== id),
        selectedOrder: state.selectedOrder?.id === id ? null : state.selectedOrder,
        loading: false,
        error: null
      }));
      
      console.log('[OrderStore] Pedido eliminado localmente:', id);
    } catch (error: any) {
      console.error('[OrderStore] Error al eliminar pedido:', error);
      set({
        loading: false,
        error: error.message || 'Error al eliminar pedido'
      });
    }
  },

  /**
   * Limpiar error
   */
  clearError: () => {
    set({ error: null });
  }
}));

export default useOrderStore;