import { create } from 'zustand';
import { Order, OrderStatus, OrderType } from '@/types/order';
import { OrderFilters } from '@/types/api';
import axios from 'axios';

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  filters: OrderFilters;
  selectedOrder: Order | null;
  
  // Actions
  fetchOrders: (filters?: OrderFilters) => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  setFilters: (filters: OrderFilters) => void;
  clearFilters: () => void;
  setSelectedOrder: (order: Order | null) => void;
}

const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  loading: false,
  error: null,
  filters: {},
  selectedOrder: null,

  fetchOrders: async (filters?: OrderFilters) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      const currentFilters = filters || get().filters;
      
      if (currentFilters.status?.length) {
        params.append('status', currentFilters.status.join(','));
      }
      if (currentFilters.type) {
        params.append('type', currentFilters.type);
      }
      if (currentFilters.search) {
        params.append('search', currentFilters.search);
      }
      if (currentFilters.delayed) {
        params.append('delayed', 'true');
      }
      params.append('page', String(currentFilters.page || 1));
      params.append('limit', String(currentFilters.limit || 100));

      const response = await axios.get(`/api/orders?${params.toString()}`);
      
      if (response.data.success) {
        set({ orders: response.data.data.items, loading: false });
      } else {
        throw new Error(response.data.error);
      }
    } catch (error: any) {
      set({ 
        error: error.message || 'Error fetching orders', 
        loading: false 
      });
    }
  },

  fetchOrderById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/api/orders/${id}`);
      
      if (response.data.success) {
        set({ 
          selectedOrder: response.data.data, 
          loading: false 
        });
      } else {
        throw new Error(response.data.error);
      }
    } catch (error: any) {
      set({ 
        error: error.message || 'Error fetching order', 
        loading: false 
      });
    }
  },

  updateOrder: async (id: string, updates: Partial<Order>) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/api/orders/${id}`, updates);
      
      if (response.data.success) {
        const updatedOrder = response.data.data;
        set(state => ({
          orders: state.orders.map(order => 
            order.id === id ? updatedOrder : order
          ),
          selectedOrder: state.selectedOrder?.id === id 
            ? updatedOrder 
            : state.selectedOrder,
          loading: false
        }));
      } else {
        throw new Error(response.data.error);
      }
    } catch (error: any) {
      set({ 
        error: error.message || 'Error updating order', 
        loading: false 
      });
    }
  },

  deleteOrder: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.delete(`/api/orders/${id}`);
      
      if (response.data.success) {
        set(state => ({
          orders: state.orders.filter(order => order.id !== id),
          selectedOrder: state.selectedOrder?.id === id 
            ? null 
            : state.selectedOrder,
          loading: false
        }));
      } else {
        throw new Error(response.data.error);
      }
    } catch (error: any) {
      set({ 
        error: error.message || 'Error deleting order', 
        loading: false 
      });
    }
  },

  setFilters: (filters: OrderFilters) => {
    set({ filters });
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  setSelectedOrder: (order: Order | null) => {
    set({ selectedOrder: order });
  }
}));

export default useOrderStore;