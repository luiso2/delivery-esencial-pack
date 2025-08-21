import { create } from 'zustand';
import { Order, OrderStatus, OrderType } from '@/types/order';
import { OrderFilters } from '@/types/api';
// import axios from 'axios';
import { mockOrders } from '@/data/mockOrders';

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  filters: OrderFilters;
  selectedOrder: Order | null;
  totalOrders: number;
  totalPages: number;
  currentPage: number;
  
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
  totalOrders: 0,
  totalPages: 0,
  currentPage: 1,

  fetchOrders: async (filters?: OrderFilters) => {
    set({ loading: true, error: null });
    try {
      const currentFilters = filters || get().filters;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredOrders = [...mockOrders];
      
      // Apply filters
      if (currentFilters.status?.length) {
        filteredOrders = filteredOrders.filter(order => 
          currentFilters.status!.includes(order.status)
        );
      }
      
      if (currentFilters.type) {
        filteredOrders = filteredOrders.filter(order => order.type === currentFilters.type);
      }
      
      if (currentFilters.search) {
        const searchLower = currentFilters.search.toLowerCase();
        filteredOrders = filteredOrders.filter(order =>
          order.id.toLowerCase().includes(searchLower) ||
          order.clientName.toLowerCase().includes(searchLower) ||
          order.address.toLowerCase().includes(searchLower) ||
          order.municipality.toLowerCase().includes(searchLower)
        );
      }
      
      if (currentFilters.delayed) {
        const now = new Date();
        filteredOrders = filteredOrders.filter(order => {
          const estimatedDelivery = new Date(order.estimatedDelivery);
          return now > estimatedDelivery && !['delivered', 'failed'].includes(order.status);
        });
      }
      
      // Pagination
      const page = currentFilters.page || 1;
      const limit = currentFilters.limit || 100;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
      
      set({ 
        orders: paginatedOrders,
        totalOrders: filteredOrders.length,
        totalPages: Math.ceil(filteredOrders.length / limit),
        currentPage: page,
        loading: false 
      });
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const order = mockOrders.find(o => o.id === id);
      
      if (order) {
        set({ 
          selectedOrder: order, 
          loading: false 
        });
      } else {
        throw new Error('Order not found');
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const orderIndex = mockOrders.findIndex(o => o.id === id);
      
      if (orderIndex !== -1) {
        const updatedOrder = { ...mockOrders[orderIndex], ...updates };
        mockOrders[orderIndex] = updatedOrder;
        
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
        throw new Error('Order not found');
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const orderIndex = mockOrders.findIndex(o => o.id === id);
      
      if (orderIndex !== -1) {
        mockOrders.splice(orderIndex, 1);
        
        set(state => ({
          orders: state.orders.filter(order => order.id !== id),
          selectedOrder: state.selectedOrder?.id === id 
            ? null 
            : state.selectedOrder,
          loading: false
        }));
      } else {
        throw new Error('Order not found');
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