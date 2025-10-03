/**
 * Servicio para gestión de pedidos con Odoo
 */

import odooApiClient from './odooApiClient';
import { ODOO_ORDER_STATES } from '@/config/api.config';
import { Order, OrderStatus, OrderType } from '@/types/order';
import { OrderFilters, PaginatedResponse } from '@/types/api';

// Usar proxy para evitar CORS
const API_BASE = '/api/proxy';

// Endpoints de la API de Odoo
const API_ENDPOINTS = {
  ORDERS: `${API_BASE}/delivery/orders`,
  ORDER_DETAIL: (id: string) => `${API_BASE}/delivery/order/${id}`,
  UPDATE_ORDER: (id: string) => `${API_BASE}/delivery/order/${id}/update`,
  CAPTURE_UPLOAD: `${API_BASE}/delivery/capture/upload`,
  METRICS: `${API_BASE}/delivery/metrics`,
  PICKINGS_TODAY: `${API_BASE}/delivery/pickings/today`,
  CAPTURES: `${API_BASE}/delivery/captures`,
  ROUTES: `${API_BASE}/delivery/routes`
};

// Mapeo de estados de Odoo a estados de la app
const mapOdooStateToAppStatus = (odooState: string): OrderStatus => {
  const stateMap: Record<string, OrderStatus> = {
    'pending': 'pending',
    'assigned': 'pending',
    'in_transit': 'in_transit',
    'arrived': 'in_transit',
    'delivered': 'delivered',
    'failed': 'failed',
    'cancelled': 'failed',
  };
  return stateMap[odooState] || 'pending';
};

// Mapeo de tipo de pedido
const mapOdooOrderType = (priority: string): OrderType => {
  return priority === 'urgent' ? 'express' : 'normal';
};

// Convertir pedido de Odoo al formato de la app
const mapOdooOrderToApp = (odooOrder: any): Order => {
  // Si el pedido ya está en el formato correcto, devolverlo tal cual
  if (odooOrder.clientName && odooOrder.items) {
    return odooOrder;
  }

  // Mapear desde formato Odoo (picking)
  return {
    id: odooOrder.id?.toString() || odooOrder.name || '',
    clientName: odooOrder.partner_name || odooOrder.client_name || 'Cliente',
    clientPhone: odooOrder.partner_phone || odooOrder.client_phone || '',
    address: odooOrder.delivery_address || odooOrder.address || '',
    municipality: odooOrder.municipality || '',
    province: odooOrder.province || 'La Habana',
    items: odooOrder.products?.map((p: any) => ({
      id: p.id?.toString() || Math.random().toString(),
      name: p.name || p.product_name,
      quantity: p.quantity || 1,
      delivered: odooOrder.delivery_state === 'delivered' || p.delivered || false
    })) || odooOrder.items || [],
    type: mapOdooOrderType(odooOrder.priority || 'normal'),
    status: mapOdooStateToAppStatus(odooOrder.delivery_state || odooOrder.status || 'pending'),
    driverId: odooOrder.carrier_id?.toString() || odooOrder.driver_id || '',
    estimatedDelivery: odooOrder.scheduled_date || odooOrder.estimated_delivery || new Date().toISOString(),
    createdAt: odooOrder.create_date || odooOrder.created_at || new Date().toISOString(),
    updatedAt: odooOrder.write_date || odooOrder.updated_at || new Date().toISOString(),
    captureStatus: odooOrder.has_evidence ? 'success' : (odooOrder.capture_status || 'pending'),
    notes: odooOrder.notes || odooOrder.delivery_notes || '',
    driverPayment: odooOrder.driver_payment || odooOrder.commission || 0
  };
};

class OrderService {
  /**
   * Obtener lista de pedidos con filtros
   */
  async getOrders(filters: OrderFilters = {}): Promise<PaginatedResponse<Order>> {
    try {
      console.log('[OrderService] Obteniendo pedidos con filtros:', filters);
      
      // Primero intentar con el endpoint de orders
      try {
        const response = await odooApiClient.call<any>(
          API_ENDPOINTS.ORDERS,
          'POST',
          {
            filters: {
              status: filters.status,
              search: filters.search,
              delayed: filters.delayed,
              type: filters.type
            },
            page: filters.page || 1,
            limit: filters.limit || 10
          }
        );

        if (response.success && response.orders) {
          console.log('[OrderService] Pedidos obtenidos del endpoint orders:', response.orders.length);
          return {
            success: true,
            data: response.orders.map(mapOdooOrderToApp),
            pagination: {
              page: response.page || filters.page || 1,
              limit: response.limit || filters.limit || 10,
              total: response.total || response.orders.length,
              totalPages: response.totalPages || Math.ceil(response.orders.length / (filters.limit || 10))
            }
          };
        }
      } catch (ordersError) {
        console.log('[OrderService] Error con endpoint orders, intentando con pickings:', ordersError);
      }

      // Si falla, intentar con pickings/today
      const pickingsResponse = await odooApiClient.call<any>(
        API_ENDPOINTS.PICKINGS_TODAY,
        'POST',
        {}
      );

      if (!pickingsResponse.success && !pickingsResponse.pickings) {
        console.error('[OrderService] No se pudieron obtener pedidos');
        // Devolver array vacío en lugar de error para mantener la app funcionando
        return {
          success: true,
          data: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0
          }
        };
      }

      // Mapear pickings a orders
      const orders: Order[] = (pickingsResponse.pickings || []).map((picking: any) => ({
        id: picking.id?.toString() || picking.name,
        clientName: picking.partner_name || 'Cliente',
        clientPhone: picking.partner_phone || '',
        address: picking.delivery_address || '',
        municipality: picking.municipality || '',
        province: picking.province || 'La Habana',
        items: picking.products?.map((p: any) => ({
          id: p.id?.toString() || Math.random().toString(),
          name: p.name,
          quantity: p.quantity || 1,
          delivered: picking.delivery_state === 'delivered'
        })) || [],
        type: picking.priority === 'urgent' ? 'express' : 'normal',
        status: mapOdooStateToAppStatus(picking.delivery_state || 'pending'),
        driverId: picking.carrier_id?.toString() || '',
        estimatedDelivery: picking.scheduled_date || new Date().toISOString(),
        createdAt: picking.create_date || new Date().toISOString(),
        updatedAt: picking.write_date || new Date().toISOString(),
        captureStatus: picking.has_evidence ? 'success' : 'pending',
        notes: picking.notes || '',
        driverPayment: picking.driver_payment || 0
      }));

      // Aplicar filtros localmente
      let filteredOrders = orders;
      
      if (filters.status && filters.status.length > 0) {
        filteredOrders = filteredOrders.filter(o => filters.status?.includes(o.status));
      }
      
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredOrders = filteredOrders.filter(o => 
          o.clientName.toLowerCase().includes(search) ||
          o.address.toLowerCase().includes(search) ||
          o.id.toLowerCase().includes(search)
        );
      }
      
      if (filters.delayed) {
        filteredOrders = filteredOrders.filter(o => 
          o.status === 'pending' && new Date(o.estimatedDelivery) < new Date()
        );
      }
      
      if (filters.type) {
        filteredOrders = filteredOrders.filter(o => o.type === filters.type);
      }

      // Paginación
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const start = (page - 1) * limit;
      const paginatedOrders = filteredOrders.slice(start, start + limit);

      return {
        success: true,
        data: paginatedOrders,
        pagination: {
          page,
          limit,
          total: filteredOrders.length,
          totalPages: Math.ceil(filteredOrders.length / limit)
        }
      };
    } catch (error: any) {
      console.error('[OrderService] Error obteniendo pedidos:', error);
      // Devolver array vacío para mantener la app funcionando
      return {
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        }
      };
    }
  }

  /**
   * Obtener detalle de un pedido
   */
  async getOrderById(id: string): Promise<Order> {
    try {
      // Intentar obtener del listado primero
      const ordersResponse = await this.getOrders({ search: id });
      if (ordersResponse.success && ordersResponse.data.length > 0) {
        const order = ordersResponse.data.find(o => o.id === id);
        if (order) return order;
      }

      // Si no se encuentra, crear un pedido vacío
      throw new Error('Pedido no encontrado');
    } catch (error: any) {
      console.error('[OrderService] Error obteniendo pedido:', error);
      throw error;
    }
  }

  /**
   * Actualizar estado de un pedido
   */
  async updateOrderStatus(id: string, status: string, notes?: string): Promise<Order> {
    try {
      const response = await odooApiClient.call<any>(
        API_ENDPOINTS.UPDATE_ORDER(id),
        'POST',
        { 
          status,
          notes,
          timestamp: new Date().toISOString()
        }
      );

      if (!response.success) {
        throw new Error(response.error || 'Error al actualizar pedido');
      }

      return mapOdooOrderToApp(response.order);
    } catch (error: any) {
      console.error('[OrderService] Error actualizando pedido:', error);
      throw error;
    }
  }

  /**
   * Subir evidencia de entrega (V2 - Conectado con Odoo)
   */
  async uploadEvidence(orderId: string, type: string, data: string | File, additionalData?: any): Promise<any> {
    try {
      let base64Data: string;

      if (data instanceof File) {
        // Convertir archivo a base64
        const reader = new FileReader();
        base64Data = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(data);
        });
      } else {
        base64Data = data;
      }

      // Usar el nuevo endpoint V2 conectado con Odoo
      const response = await odooApiClient.call<any>(
        `/api/proxy/v2/delivery/upload_evidence`,
        'POST',
        {
          picking_id: orderId,
          evidence_type: type === 'signature' ? 'signature' : 'photo',
          image_data: base64Data,
          notes: additionalData?.notes || '',
          delivered_to: additionalData?.delivered_to || '',
          delivered_dni: additionalData?.delivered_dni || '',
          latitude: additionalData?.latitude,
          longitude: additionalData?.longitude
        }
      );

      if (!response.success) {
        throw new Error(response.error || 'Error al subir evidencia');
      }

      return response;
    } catch (error: any) {
      console.error('[OrderService] Error subiendo evidencia:', error);
      throw error;
    }
  }

  /**
   * Obtener evidencias existentes de una entrega
   */
  async getEvidence(orderId: string): Promise<any> {
    try {
      const response = await odooApiClient.call<any>(
        `/api/proxy/v2/delivery/get_evidence`,
        'POST',
        { picking_id: orderId }
      );

      if (!response.success) {
        throw new Error(response.error || 'Error al obtener evidencias');
      }

      return response;
    } catch (error: any) {
      console.error('[OrderService] Error obteniendo evidencias:', error);
      throw error;
    }
  }

  /**
   * Completar entrega con todas las evidencias
   */
  async completeDelivery(orderId: string, evidenceData: {
    signature?: string;
    photos?: string[];
    notes?: string;
    delivered_to?: string;
    delivered_dni?: string;
    latitude?: number;
    longitude?: number;
  }): Promise<any> {
    try {
      const payload: any = {
        picking_id: orderId,
        notes: evidenceData.notes || '',
        delivered_to: evidenceData.delivered_to || '',
        delivered_dni: evidenceData.delivered_dni || '',
        latitude: evidenceData.latitude,
        longitude: evidenceData.longitude
      };

      // Agregar firma si existe
      if (evidenceData.signature) {
        payload.signature = evidenceData.signature;
      }

      // Agregar fotos si existen (hasta 3)
      if (evidenceData.photos) {
        if (evidenceData.photos[0]) payload.photo = evidenceData.photos[0];
        if (evidenceData.photos[1]) payload.photo_2 = evidenceData.photos[1];
        if (evidenceData.photos[2]) payload.photo_3 = evidenceData.photos[2];
      }

      const response = await odooApiClient.call<any>(
        `/api/proxy/v2/delivery/complete_delivery`,
        'POST',
        payload
      );

      if (!response.success) {
        throw new Error(response.error || 'Error al completar entrega');
      }

      return response;
    } catch (error: any) {
      console.error('[OrderService] Error completando entrega:', error);
      throw error;
    }
  }

  /**
   * Obtener métricas reales del transportista (V2 - Conectado con Odoo)
   */
  async getMetrics(period: 'today' | 'week' | 'month' | 'all' = 'month'): Promise<any> {
    try {
      // Obtener carrier ID del almacenamiento local
      const carrierId = odooApiClient.getCarrierId();

      if (!carrierId) {
        throw new Error('No hay transportista autenticado');
      }

      const response = await odooApiClient.call<any>(
        `/api/proxy/v2/delivery/metrics`,
        'POST',
        {
          carrier_id: carrierId,
          period: period
        }
      );

      if (!response.success) {
        // Devolver métricas vacías si falla
        console.warn('[OrderService] Fallo al obtener métricas, devolviendo vacías:', response.error);
        return {
          success: true,
          metrics: {
            carrier: { name: 'Transportista', id: carrierId },
            period: period,
            orders: {
              total: 0,
              delivered: 0,
              pending: 0,
              in_transit: 0,
              failed: 0
            },
            performance: {
              success_rate: 0,
              avg_delivery_time_hours: 0,
              on_time_deliveries: 0
            },
            earnings: {
              total: 0,
              currency: 'CUP',
              payments_count: 0,
              commission_type: 'fixed',
              commission_rate: 0
            }
          }
        };
      }

      // Devolver métricas reales de Odoo
      return response;

    } catch (error: any) {
      console.error('[OrderService] Error obteniendo métricas:', error);

      // Devolver métricas vacías como fallback
      return {
        success: true,
        metrics: {
          carrier: { name: 'Transportista', id: 'unknown' },
          period: period,
          orders: {
            total: 0,
            delivered: 0,
            pending: 0,
            in_transit: 0,
            failed: 0
          },
          performance: {
            success_rate: 0,
            avg_delivery_time_hours: 0,
            on_time_deliveries: 0
          },
          earnings: {
            total: 0,
            currency: 'CUP',
            payments_count: 0,
            commission_type: 'fixed',
            commission_rate: 0
          }
        }
      };
    }
  }

  /**
   * Obtener capturas/evidencias
   */
  async getCaptures(filters?: any): Promise<any> {
    try {
      const response = await odooApiClient.call<any>(
        API_ENDPOINTS.CAPTURES,
        'POST',
        { filters }
      );

      if (!response.success) {
        return {
          success: true,
          captures: []
        };
      }

      return response;
    } catch (error: any) {
      console.error('[OrderService] Error obteniendo capturas:', error);
      return {
        success: true,
        captures: []
      };
    }
  }

  /**
   * Obtener rutas
   */
  async getRoutes(): Promise<any> {
    try {
      const response = await odooApiClient.call<any>(
        API_ENDPOINTS.ROUTES,
        'POST',
        {}
      );

      if (!response.success) {
        return {
          success: true,
          routes: []
        };
      }

      return response;
    } catch (error: any) {
      console.error('[OrderService] Error obteniendo rutas:', error);
      return {
        success: true,
        routes: []
      };
    }
  }
}

// Exportar instancia única del servicio
const orderService = new OrderService();
export default orderService;