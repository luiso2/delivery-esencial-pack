/**
 * Servicio de autenticación con Odoo
 */

import odooApiClient from './odooApiClient';

interface LoginResponse {
  success: boolean;
  token?: string;
  carrier?: {
    id: number;
    name: string;
    code: string;
    vehicle_type: string;
    zones: Array<{ id: number; name: string }>;
  };
  error?: string;
}

class AuthService {
  /**
   * Login del transportista
   */
  async login(phone: string, pin: string): Promise<LoginResponse> {
    try {
      const response = await odooApiClient.login(phone, pin);
      
      if (response.success) {
        // Guardar datos adicionales si es necesario
        this.saveUserData(response.carrier);
      }
      
      return response;    } catch (error: any) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: error.message || 'Error al iniciar sesión'
      };
    }
  }

  /**
   * Logout del transportista
   */
  logout(): void {
    odooApiClient.logout();
    if (typeof window !== 'undefined') {
      // Limpiar cualquier dato adicional
      localStorage.removeItem('userData');
      // Redirigir al login si es necesario
      window.location.href = '/';
    }
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return odooApiClient.isAuthenticated();
  }

  /**
   * Obtener datos del usuario actual
   */  getCurrentUser(): any {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('carrierData');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  /**
   * Guardar datos del usuario
   */
  private saveUserData(carrier: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userData', JSON.stringify({
        id: carrier.id,
        name: carrier.name,
        code: carrier.code,
        vehicleType: carrier.vehicle_type,
        zones: carrier.zones,
        loginTime: new Date().toISOString()
      }));
    }
  }

  /**
   * Verificar si es usuario administrador
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user && user.id === 0; // ID 0 es admin según el documento
  }
}

// Exportar instancia única
const authService = new AuthService();
export default authService;
