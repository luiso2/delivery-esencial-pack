import { create } from 'zustand';
import { Route, RouteOrder } from '@/types/route';
import axios from 'axios';

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
      const response = await axios.get('/api/routes');
      if (response.data.success) {
        set({ routes: response.data.data.routes, loading: false });
      }
    } catch (error) {
      set({ error: 'Error al cargar las rutas', loading: false });
      console.error('Error fetching routes:', error);
    }
  },

  fetchRoute: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/api/routes/${id}`);
      if (response.data.success) {
        set({ currentRoute: response.data.data, loading: false });
      }
    } catch (error) {
      set({ error: 'Error al cargar la ruta', loading: false });
      console.error('Error fetching route:', error);
    }
  },

  createRoute: async (routeData: Partial<Route>) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/api/routes', routeData);
      if (response.data.success) {
        const newRoute = response.data.data;
        set(state => ({
          routes: [...state.routes, newRoute],
          loading: false
        }));
        return newRoute;
      }
    } catch (error) {
      set({ error: 'Error al crear la ruta', loading: false });
      console.error('Error creating route:', error);
    }
    return null;
  },

  updateRoute: async (id: string, updates: Partial<Route>) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/api/routes/${id}`, updates);
      if (response.data.success) {
        const updatedRoute = response.data.data;
        set(state => ({
          routes: state.routes.map(route => 
            route.id === id ? updatedRoute : route
          ),
          currentRoute: state.currentRoute?.id === id ? updatedRoute : state.currentRoute,
          loading: false
        }));
      }
    } catch (error) {
      set({ error: 'Error al actualizar la ruta', loading: false });
      console.error('Error updating route:', error);
    }
  },

  deleteRoute: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.delete(`/api/routes/${id}`);
      if (response.data.success) {
        set(state => ({
          routes: state.routes.filter(route => route.id !== id),
          currentRoute: state.currentRoute?.id === id ? null : state.currentRoute,
          loading: false
        }));
      }
    } catch (error) {
      set({ error: 'Error al eliminar la ruta', loading: false });
      console.error('Error deleting route:', error);
    }
  },

  addOrderToRoute: async (routeId: string, orderId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.patch(`/api/routes/${routeId}`, {
        operation: 'add_order',
        orderId
      });
      if (response.data.success) {
        const updatedRoute = response.data.data;
        set(state => ({
          routes: state.routes.map(route => 
            route.id === routeId ? updatedRoute : route
          ),
          currentRoute: state.currentRoute?.id === routeId ? updatedRoute : state.currentRoute,
          loading: false
        }));
      }
    } catch (error) {
      set({ error: 'Error al agregar pedido a la ruta', loading: false });
      console.error('Error adding order to route:', error);
    }
  },

  removeOrderFromRoute: async (routeId: string, orderId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.patch(`/api/routes/${routeId}`, {
        operation: 'remove_order',
        orderId
      });
      if (response.data.success) {
        const updatedRoute = response.data.data;
        set(state => ({
          routes: state.routes.map(route => 
            route.id === routeId ? updatedRoute : route
          ),
          currentRoute: state.currentRoute?.id === routeId ? updatedRoute : state.currentRoute,
          loading: false
        }));
      }
    } catch (error) {
      set({ error: 'Error al eliminar pedido de la ruta', loading: false });
      console.error('Error removing order from route:', error);
    }
  },

  reorderRouteOrders: async (routeId: string, orders: RouteOrder[]) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.patch(`/api/routes/${routeId}`, {
        operation: 'reorder',
        orders
      });
      if (response.data.success) {
        const updatedRoute = response.data.data;
        set(state => ({
          routes: state.routes.map(route => 
            route.id === routeId ? updatedRoute : route
          ),
          currentRoute: state.currentRoute?.id === routeId ? updatedRoute : state.currentRoute,
          loading: false
        }));
      }
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