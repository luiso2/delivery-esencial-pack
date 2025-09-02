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
      const response = await axios.get('/api/delivery/routes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        set({ routes: response.data.routes, loading: false });
      } else {
        set({ error: response.data.message || 'Error al cargar las rutas', loading: false });
      }
    } catch (error) {
      set({ error: 'Error al cargar las rutas', loading: false });
      console.error('Error fetching routes:', error);
    }
  },

  fetchRoute: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/api/delivery/routes/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        set({ currentRoute: response.data.route, loading: false });
      } else {
        set({ error: response.data.message || 'Ruta no encontrada', loading: false });
      }
    } catch (error) {
      set({ error: 'Error al cargar la ruta', loading: false });
      console.error('Error fetching route:', error);
    }
  },

  createRoute: async (routeData: Partial<Route>) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('/api/delivery/routes', routeData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        const newRoute = response.data.route;
        set(state => ({
          routes: [...state.routes, newRoute],
          loading: false
        }));
        return newRoute;
      } else {
        set({ error: response.data.message || 'Error al crear la ruta', loading: false });
        return null;
      }
    } catch (error) {
      set({ error: 'Error al crear la ruta', loading: false });
      console.error('Error creating route:', error);
      return null;
    }
  },

  updateRoute: async (id: string, updates: Partial<Route>) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(`/api/delivery/routes/${id}`, updates, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        const updatedRoute = response.data.route;
        set(state => ({
          routes: state.routes.map(route => 
            route.id === id ? updatedRoute : route
          ),
          currentRoute: state.currentRoute?.id === id ? updatedRoute : state.currentRoute,
          loading: false
        }));
      } else {
        set({ error: response.data.message || 'Error al actualizar la ruta', loading: false });
      }
    } catch (error) {
      set({ error: 'Error al actualizar la ruta', loading: false });
      console.error('Error updating route:', error);
    }
  },

  deleteRoute: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.delete(`/api/delivery/routes/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        set(state => ({
          routes: state.routes.filter(route => route.id !== id),
          currentRoute: state.currentRoute?.id === id ? null : state.currentRoute,
          loading: false
        }));
      } else {
        set({ error: response.data.message || 'Error al eliminar la ruta', loading: false });
      }
    } catch (error) {
      set({ error: 'Error al eliminar la ruta', loading: false });
      console.error('Error deleting route:', error);
    }
  },

  addOrderToRoute: async (routeId: string, orderId: string) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(`/api/delivery/routes/${routeId}/orders`, 
        { orderId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        const updatedRoute = response.data.route;
        set(state => ({
          routes: state.routes.map(route => 
            route.id === routeId ? updatedRoute : route
          ),
          currentRoute: state.currentRoute?.id === routeId ? updatedRoute : state.currentRoute,
          loading: false
        }));
      } else {
        set({ error: response.data.message || 'Error al agregar pedido a la ruta', loading: false });
      }
    } catch (error) {
      set({ error: 'Error al agregar pedido a la ruta', loading: false });
      console.error('Error adding order to route:', error);
    }
  },

  removeOrderFromRoute: async (routeId: string, orderId: string) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.delete(`/api/delivery/routes/${routeId}/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        const updatedRoute = response.data.route;
        set(state => ({
          routes: state.routes.map(route => 
            route.id === routeId ? updatedRoute : route
          ),
          currentRoute: state.currentRoute?.id === routeId ? updatedRoute : state.currentRoute,
          loading: false
        }));
      } else {
        set({ error: response.data.message || 'Error al eliminar pedido de la ruta', loading: false });
      }
    } catch (error) {
      set({ error: 'Error al eliminar pedido de la ruta', loading: false });
      console.error('Error removing order from route:', error);
    }
  },

  reorderRouteOrders: async (routeId: string, orders: RouteOrder[]) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(`/api/delivery/routes/${routeId}/reorder`, 
        { orders },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        const updatedRoute = response.data.route;
        set(state => ({
          routes: state.routes.map(route => 
            route.id === routeId ? updatedRoute : route
          ),
          currentRoute: state.currentRoute?.id === routeId ? updatedRoute : state.currentRoute,
          loading: false
        }));
      } else {
        set({ error: response.data.message || 'Error al reordenar pedidos', loading: false });
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