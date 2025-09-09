/**
 * Cliente para comunicación con Odoo a través de XML-RPC
 */

import { apiConfig } from '@/config/api.config';

interface LoginResponse {
  success: boolean;
  token?: string;
  carrier?: {
    id: number;
    name: string;
    code: string;
    vehicle_type: string;
    zones: Array<{ id: number; name: string }>;
    phone: string;
  };
  error?: string;
  details?: string;
}

interface TokenVerificationResponse {
  valid: boolean;
  carrier?: {
    id: number;
    name: string;
  };
  error?: string;
}

class OdooApiClient {
  private baseUrl: string;
  private database: string;
  private carrierId: string | null = null;
  private token: string | null = null;
  
  constructor() {
    // Verificar que apiConfig esté disponible y tenga las propiedades necesarias
    if (!apiConfig || !apiConfig.baseUrl || !apiConfig.database) {
      console.error('apiConfig is undefined or incomplete. Using fallback configuration.');
      this.baseUrl = 'http://localhost:8069';
      this.database = 'odoo';
    } else {
      this.baseUrl = apiConfig.baseUrl;
      this.database = apiConfig.database;
    }
    
    // Recuperar datos de sesión si existen
    if (typeof window !== 'undefined') {
      this.carrierId = localStorage.getItem('carrierId');
      this.token = localStorage.getItem('token');
    }
  }

  /**
   * Establecer cookies para persistir la sesión
   */
  private setCookies(carrierId: string, token: string) {
    if (typeof document !== 'undefined') {
      // Establecer cookies con 7 días de expiración
      const expires = new Date();
      expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000));
      
      document.cookie = `carrierId=${carrierId}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
      document.cookie = `token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    }
  }

  /**
   * Limpiar cookies
   */
  private clearCookies() {
    if (typeof document !== 'undefined') {
      document.cookie = 'carrierId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  }

  /**
   * Login del transportista usando XML-RPC
   */
  async login(phone: string, pin: string): Promise<LoginResponse> {
    console.log('[OdooAPI] Iniciando login con XML-RPC para:', phone);
    
    try {
      // Llamar al nuevo endpoint que usa XML-RPC
      const response = await fetch('/api/auth/carrier-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, pin }),
      });

      const data: LoginResponse = await response.json();
      console.log('[OdooAPI] Respuesta del servidor:', data);

      if (data.success && data.token && data.carrier) {
        this.carrierId = data.carrier.id.toString();
        this.token = data.token;
        
        console.log('[OdooAPI] Login exitoso:', { 
          carrierId: this.carrierId, 
          carrierName: data.carrier.name 
        });
        
        // Guardar en localStorage y cookies
        if (typeof window !== 'undefined') {
          localStorage.setItem('carrierId', this.carrierId);
          localStorage.setItem('token', this.token);
          localStorage.setItem('carrierData', JSON.stringify(data.carrier));
          
          // También establecer cookies para el middleware
          this.setCookies(this.carrierId, this.token);
        }
      } else {
        console.error('[OdooAPI] Login fallido:', data.error);
      }

      return data;
    } catch (error: any) {
      console.error('[OdooAPI] Error en login:', error);
      return {
        success: false,
        error: error.message || 'Error al conectar con el servidor'
      };
    }
  }

  /**
   * Verificar token
   */
  async verifyToken(): Promise<TokenVerificationResponse> {
    if (!this.token) {
      return { valid: false, error: 'No hay token' };
    }

    try {
      const response = await fetch('/api/auth/carrier-login', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      const data: TokenVerificationResponse = await response.json();
      return data;
    } catch (error: any) {
      console.error('[OdooAPI] Error verificando token:', error);
      return { valid: false, error: 'Error al verificar token' };
    }
  }

  /**
   * Logout del transportista
   */
  logout() {
    console.log('[OdooAPI] Cerrando sesión');
    
    this.carrierId = null;
    this.token = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('carrierId');
      localStorage.removeItem('token');
      localStorage.removeItem('carrierData');
      localStorage.removeItem('userData');
      
      // Limpiar cookies también
      this.clearCookies();
    }
  }

  /**
   * Verificar si está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.carrierId && !!this.token;
  }

  /**
   * Obtener ID del transportista
   */
  getCarrierId(): string | null {
    return this.carrierId;
  }

  /**
   * Obtener token actual
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Obtener datos del transportista
   */
  getCarrierData(): any {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('carrierData');
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  /**
   * Hacer llamadas genéricas a la API (para otros endpoints si es necesario)
   */
  async call<T = any>(endpoint: string, method: string = 'POST', body?: any): Promise<T> {
    const headers: any = {
      'Content-Type': 'application/json',
    };

    // Agregar token si está disponible
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(endpoint, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('[OdooAPI] Error en llamada:', error);
      throw error;
    }
  }
}

// Exportar instancia única (singleton)
const odooApiClient = new OdooApiClient();
export default odooApiClient;
