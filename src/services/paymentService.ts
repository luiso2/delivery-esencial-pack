/**
 * Servicio para gestión de pagos y liquidaciones del transportista
 */

import odooApiClient from './odooApiClient';

interface PaymentSummary {
  pending_amount: number;
  total_delivered: number;
  total_earnings: number;
  payment_count: number;
}

interface PaymentDetail {
  id: string;
  picking_id: string;
  picking_name: string;
  client_name: string;
  delivery_address: string;
  municipality: string;
  zone_name: string;
  commission_amount: number;
  delivery_date: string;
  payment_status: 'pending' | 'paid';
  currency: string;
}

interface PaymentResponse {
  success: boolean;
  payments: PaymentDetail[];
  totals: PaymentSummary;
  carrier: {
    id: number;
    name: string;
  };
  period: string;
  error?: string;
}

class PaymentService {
  /**
   * Obtener pagos y liquidaciones del transportista
   */
  async getPayments(period: 'today' | 'week' | 'month' | 'all' = 'month'): Promise<PaymentResponse> {
    try {
      const carrierId = odooApiClient.getCarrierId();

      if (!carrierId) {
        throw new Error('No hay transportista autenticado');
      }

      // Usar el endpoint de pagos a través del proxy
      const response = await odooApiClient.call<PaymentResponse>(
        '/api/delivery/payments',
        'GET'
      );

      if (!response.success) {
        throw new Error(response.error || 'Error al obtener pagos');
      }

      return response;
    } catch (error: any) {
      console.error('[PaymentService] Error obteniendo pagos:', error);

      // Devolver estructura vacía como fallback
      return {
        success: false,
        payments: [],
        totals: {
          pending_amount: 0,
          total_delivered: 0,
          total_earnings: 0,
          payment_count: 0
        },
        carrier: { id: 0, name: 'Unknown' },
        period: period,
        error: error.message
      };
    }
  }

  /**
   * Obtener resumen de pagos para un período específico
   */
  async getPaymentSummary(period: 'today' | 'week' | 'month' | 'all' = 'month'): Promise<PaymentSummary> {
    try {
      const response = await this.getPayments(period);
      return response.totals;
    } catch (error: any) {
      console.error('[PaymentService] Error obteniendo resumen de pagos:', error);
      return {
        pending_amount: 0,
        total_delivered: 0,
        total_earnings: 0,
        payment_count: 0
      };
    }
  }

  /**
   * Obtener entregas pendientes de liquidación
   */
  async getPendingDeliveries(dateFrom?: string, dateTo?: string): Promise<PaymentDetail[]> {
    try {
      const carrierId = odooApiClient.getCarrierId();

      if (!carrierId) {
        throw new Error('No hay transportista autenticado');
      }

      const response = await odooApiClient.call<any>(
        '/api/delivery/payments',
        'POST',
        {
          action: 'pending-deliveries',
          date_from: dateFrom,
          date_to: dateTo
        }
      );

      if (!response.success) {
        throw new Error(response.error || 'Error al obtener entregas pendientes');
      }

      return response.deliveries || [];
    } catch (error: any) {
      console.error('[PaymentService] Error obteniendo entregas pendientes:', error);
      return [];
    }
  }

  /**
   * Obtener detalle de un pago específico
   */
  async getPaymentDetail(paymentId: string): Promise<PaymentDetail | null> {
    try {
      const carrierId = odooApiClient.getCarrierId();

      if (!carrierId) {
        throw new Error('No hay transportista autenticado');
      }

      const response = await odooApiClient.call<any>(
        '/api/delivery/payments',
        'POST',
        {
          paymentId: paymentId
        }
      );

      if (!response.success) {
        throw new Error(response.error || 'Error al obtener detalle del pago');
      }

      return response.payment || null;
    } catch (error: any) {
      console.error('[PaymentService] Error obteniendo detalle del pago:', error);
      return null;
    }
  }

  /**
   * Calcular ganancia total por período
   */
  calculateTotalEarnings(payments: PaymentDetail[]): number {
    return payments.reduce((total, payment) => {
      return total + payment.commission_amount;
    }, 0);
  }

  /**
   * Filtrar pagos por estado
   */
  filterPaymentsByStatus(payments: PaymentDetail[], status: 'pending' | 'paid'): PaymentDetail[] {
    return payments.filter(payment => payment.payment_status === status);
  }

  /**
   * Agrupar pagos por municipio/zona
   */
  groupPaymentsByZone(payments: PaymentDetail[]): Record<string, PaymentDetail[]> {
    return payments.reduce((groups, payment) => {
      const zone = payment.zone_name || payment.municipality;
      if (!groups[zone]) {
        groups[zone] = [];
      }
      groups[zone].push(payment);
      return groups;
    }, {} as Record<string, PaymentDetail[]>);
  }
}

// Exportar instancia única del servicio
const paymentService = new PaymentService();
export default paymentService;