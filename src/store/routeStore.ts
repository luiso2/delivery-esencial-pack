import { create } from 'zustand';
import { Route, RouteOrder } from '@/types/route';
// import axios from 'axios';
import { mockRoutes } from '@/data/mockRoutes';

interface RouteState {
  routes: Route[];
  currentRoute: Route | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchRoutes: () => Promise<void>;
  fetchRoute: (id: string) => Promise<void>;
  createRoute: (route: Partial<Route>) => Promise<Route | null>;
  updateRoute: (id: string, updates: Partial<Route>) => Promise<void>;
  deleteRoute: (id: string) => Promise<void>;
  addOrderToRoute: (routeId: string, orderId: string) => Promise<void>;
  removeOrderFromRoute: (routeId: string, orderId: string) => Promise<void>;
  reorderRouteOrders: (routeId: string, orders: RouteOrder[]) => Promise<void>;
  setCurrentRoute: (route: Route | null) => void;
  clearError: () => void;
}

const useRouteStore = create<RouteState>((set, get) => ({
  routes: [],
  currentRoute: null,
  loading: false,
  error: null,

  fetchRoutes: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      set({ routes: mockRoutes, loading: false });
    } catch (error) {
      set({ error: 'Error al cargar las rutas', loading: false });
      console.error('Error fetching routes:', error);
    }
  },

  fetchRoute: async (id: string) => {
    set({ loading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const route = mockRoutes.find(r => r.id === id);
      if (route) {
        set({ currentRoute: route, loading: false });
      } else {
        set({ error: 'Ruta no encontrada', loading: false });
      }
    } catch (error) {
      set({ error: 'Error al cargar la ruta', loading: false });
      console.error('Error fetching route:', error);
    }
  },

  createRoute: async (routeData: Partial<Route>) => {
    set({ loading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newRoute: Route = {
        ...routeData,
        id: `route-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Route;
      
      mockRoutes.push(newRoute);
      
      set(state => ({
        routes: [...state.routes, newRoute],
        loading: false
      }));
      return newRoute;
    } catch (error) {
      set({ error: 'Error al crear la ruta', loading: false });
      console.error('Error creating route:', error);
    }
    return null;
  },

  updateRoute: async (id: string, updates: Partial<Route>) => {
    set({ loading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const routeIndex = mockRoutes.findIndex(r => r.id === id);
      if (routeIndex === -1) {
        throw new Error('Route not found');
      }
      
      const updatedRoute = {
        ...mockRoutes[routeIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      mockRoutes[routeIndex] = updatedRoute;
      
      set(state => ({
        routes: state.routes.map(route => 
          route.id === id ? updatedRoute : route
        ),
        currentRoute: state.currentRoute?.id === id ? updatedRoute : state.currentRoute,
        loading: false
      }));
    } catch (error) {
      set({ error: 'Error al actualizar la ruta', loading: false });
      console.error('Error updating route:', error);
    }
  },

  deleteRoute: async (id: string) => {
    set({ loading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const routeIndex = mockRoutes.findIndex(r => r.id === id);
      if (routeIndex === -1) {
        throw new Error('Route not found');
      }
      
      mockRoutes.splice(routeIndex, 1);
      
      set(state => ({
        routes: state.routes.filter(route => route.id !== id),
        currentRoute: state.currentRoute?.id === id ? null : state.currentRoute,
        loading: false
      }));
    } catch (error) {
      set({ error: 'Error al eliminar la ruta', loading: false });
      console.error('Error deleting route:', error);
    }
  },

  addOrderToRoute: async (routeId: string, orderId: string) => {
    set({ loading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const routeIndex = mockRoutes.findIndex(r => r.id === routeId);
      if (routeIndex === -1) {
        throw new Error('Route not found');
      }
      
      const updatedRoute = {
        ...mockRoutes[routeIndex],
        orders: [...mockRoutes[routeIndex].orders, { orderId, position: mockRoutes[routeIndex].orders.length + 1 }],
        updatedAt: new Date().toISOString()
      };
      
      mockRoutes[routeIndex] = updatedRoute;
      
      set(state => ({
        routes: state.routes.map(route => 
          route.id === routeId ? updatedRoute : route
        ),
        currentRoute: state.currentRoute?.id === routeId ? updatedRoute : state.currentRoute,
        loading: false
      }));
    } catch (error) {
      set({ error: 'Error al agregar pedido a la ruta', loading: false });
      console.error('Error adding order to route:', error);
    }
  },

  removeOrderFromRoute: async (routeId: string, orderId: string) => {
    set({ loading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const routeIndex = mockRoutes.findIndex(r => r.id === routeId);
      if (routeIndex === -1) {
        throw new Error('Route not found');
      }
      
      const updatedRoute = {
        ...mockRoutes[routeIndex],
        orders: mockRoutes[routeIndex].orders.filter(order => order.orderId !== orderId),
        updatedAt: new Date().toISOString()
      };
      
      mockRoutes[routeIndex] = updatedRoute;
      
      set(state => ({
        routes: state.routes.map(route => 
          route.id === routeId ? updatedRoute : route
        ),
        currentRoute: state.currentRoute?.id === routeId ? updatedRoute : state.currentRoute,
        loading: false
      }));
    } catch (error) {
      set({ error: 'Error al eliminar pedido de la ruta', loading: false });
      console.error('Error removing order from route:', error);
    }
  },

  reorderRouteOrders: async (routeId: string, orders: RouteOrder[]) => {
    set({ loading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const routeIndex = mockRoutes.findIndex(r => r.id === routeId);
      if (routeIndex === -1) {
        throw new Error('Route not found');
      }
      
      const updatedRoute = {
        ...mockRoutes[routeIndex],
        orders: orders,
        updatedAt: new Date().toISOString()
      };
      
      mockRoutes[routeIndex] = updatedRoute;
      
      set(state => ({
        routes: state.routes.map(route => 
          route.id === routeId ? updatedRoute : route
        ),
        currentRoute: state.currentRoute?.id === routeId ? updatedRoute : state.currentRoute,
        loading: false
      }));
    } catch (error) {
      set({ error: 'Error al reordenar pedidos', loading: false });
      console.error('Error reordering route orders:', error);
    }
  },

  setCurrentRoute: (route: Route | null) => {
    set({ currentRoute: route });
  },

  clearError: () => {
    set({ error: null });
  }
}));

export default useRouteStore;