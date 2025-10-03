import orderService from './orderService';
import { Capture, CaptureStats } from '@/types/capture';

interface CaptureResponse {
  success: boolean;
  captures: Capture[];
  stats: CaptureStats;
  error?: string;
}

interface UpdateCaptureResponse {
  success: boolean;
  error?: string;
}

class CaptureService {

  async getCaptures(filters?: {
    status?: 'all' | 'pending' | 'incomplete' | 'verified' | 'rejected';
    type?: 'all' | 'delivery' | 'return' | 'incident';
  }): Promise<CaptureResponse> {
    try {
      // Obtener todos los pedidos que tienen evidencias
      const ordersResponse = await orderService.getOrders({
        limit: 200,
        status: ['delivered'] // Solo pedidos que podrían tener evidencias
      });

      if (!ordersResponse.success) {
        throw new Error('Error fetching orders');
      }

      const orders = ordersResponse.data || [];
      const captures: Capture[] = [];

      // Crear captures basados en los pedidos entregados
      for (const order of orders) {
        try {
          // Verificar si este pedido tiene evidencias usando el endpoint V2
          const evidenceResponse = await orderService.getEvidence(order.id);

          if (evidenceResponse.success && evidenceResponse.evidence) {
            const evidence = evidenceResponse.evidence;

            // Crear captures para las fotos existentes
            if (evidence.photos && evidence.photos.length > 0) {
              evidence.photos.forEach((photo: any, index: number) => {
                const photoCapture: Capture = {
                  id: `${order.id}_photo_${photo.slot || index}`,
                  orderId: order.id,
                  type: 'delivery',
                  imageUrl: photo.url,
                  thumbnailUrl: photo.url,
                  status: this.mapOrderStatusToCaptureStatus(order.status),
                  notes: evidence.delivery_info?.delivery_notes,
                  capturedBy: evidence.delivery_info?.delivered_to || 'Driver',
                  capturedAt: evidence.delivery_info?.delivery_datetime || order.updatedAt.toString(),
                  verifiedBy: order.status === 'delivered' ? 'System' : undefined,
                  verifiedAt: order.status === 'delivered' ? evidence.delivery_info?.delivery_datetime : undefined,
                  createdAt: order.createdAt.toString(),
                  updatedAt: order.updatedAt.toString(),
                  order: {
                    clientName: order.clientName,
                    address: order.address
                  }
                };
                captures.push(photoCapture);
              });
            }

            // Crear capture para firma si existe
            if (evidence.signature_url) {
              const signatureCapture: Capture = {
                id: `${order.id}_signature`,
                orderId: order.id,
                type: 'signature',
                imageUrl: evidence.signature_url,
                thumbnailUrl: evidence.signature_url,
                status: this.mapOrderStatusToCaptureStatus(order.status),
                notes: evidence.delivery_info?.delivery_notes,
                capturedBy: evidence.delivery_info?.delivered_to || 'Driver',
                capturedAt: evidence.delivery_info?.delivery_datetime || order.updatedAt.toString(),
                verifiedBy: order.status === 'delivered' ? 'System' : undefined,
                verifiedAt: order.status === 'delivered' ? evidence.delivery_info?.delivery_datetime : undefined,
                createdAt: order.createdAt.toString(),
                updatedAt: order.updatedAt.toString(),
                order: {
                  clientName: order.clientName,
                  address: order.address
                }
              };
              captures.push(signatureCapture);
            }
          }
        } catch (error) {
          // Si hay error obteniendo evidencias para este pedido, continuar con el siguiente
          console.log(`No evidence found for order ${order.id}`);
        }
      }

      // Aplicar filtros
      let filteredCaptures = captures;

      if (filters?.status && filters.status !== 'all') {
        filteredCaptures = filteredCaptures.filter(capture => capture.status === filters.status);
      }

      if (filters?.type && filters.type !== 'all') {
        filteredCaptures = filteredCaptures.filter(capture => capture.type === filters.type);
      }

      // Ordenar por fecha de captura descendente
      filteredCaptures.sort((a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime());

      // Calcular estadísticas
      const stats: CaptureStats = {
        total: captures.length,
        pending: captures.filter(c => c.status === 'pending').length,
        verified: captures.filter(c => c.status === 'verified').length,
        rejected: captures.filter(c => c.status === 'rejected').length,
        incomplete: captures.filter(c => c.status === 'incomplete').length,
        todayCount: this.getTodayCount(captures),
        weekCount: this.getWeekCount(captures)
      };

      return {
        success: true,
        captures: filteredCaptures,
        stats
      };

    } catch (error: any) {
      console.error('Error fetching captures:', error);
      return {
        success: false,
        captures: [],
        stats: {
          total: 0,
          pending: 0,
          verified: 0,
          rejected: 0,
          incomplete: 0,
          todayCount: 0,
          weekCount: 0
        },
        error: error.message || 'Error fetching captures'
      };
    }
  }

  async updateCaptureStatus(
    captureId: string,
    status: 'verified' | 'rejected' | 'incomplete',
    reason?: string
  ): Promise<UpdateCaptureResponse> {
    try {
      // Extraer el order ID del capture ID
      const orderId = captureId.split('_')[0];

      // Mapear el status de capture al status de order
      let orderStatus: string;
      switch (status) {
        case 'verified':
          orderStatus = 'delivered';
          break;
        case 'rejected':
          orderStatus = 'failed';
          break;
        case 'incomplete':
          orderStatus = 'incomplete';
          break;
        default:
          orderStatus = 'pending';
      }

      // Actualizar el pedido usando el orderService
      await orderService.updateOrderStatus(orderId, orderStatus, reason);

      return {
        success: true
      };

    } catch (error: any) {
      console.error('Error updating capture status:', error);
      return {
        success: false,
        error: error.message || 'Error updating capture status'
      };
    }
  }

  private mapOrderStatusToCaptureStatus(orderStatus: string): 'pending' | 'verified' | 'rejected' | 'incomplete' {
    switch (orderStatus) {
      case 'delivered':
        return 'verified';
      case 'failed':
        return 'rejected';
      case 'incomplete':
        return 'incomplete';
      default:
        return 'pending';
    }
  }

  private getTodayCount(captures: Capture[]): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return captures.filter(capture => {
      const captureDate = new Date(capture.capturedAt);
      captureDate.setHours(0, 0, 0, 0);
      return captureDate.getTime() === today.getTime();
    }).length;
  }

  private getWeekCount(captures: Capture[]): number {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    return captures.filter(capture => {
      const captureDate = new Date(capture.capturedAt);
      return captureDate >= weekAgo;
    }).length;
  }
}

const captureService = new CaptureService();
export default captureService;