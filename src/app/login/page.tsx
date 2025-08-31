'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/services/authService';
import { FiPhone, FiLock, FiTruck } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('[Login] Iniciando proceso de login...');
    
    try {
      const response = await authService.login(phone, pin);
      console.log('[Login] Respuesta del servicio:', response);
      
      if (response.success) {
        console.log('[Login] Login exitoso, redirigiendo...');
        toast.success(`Bienvenido ${response.carrier?.name || 'Transportista'}`);
        
        // Pequeña espera para asegurar que las cookies se establecen
        setTimeout(() => {
          router.push('/pedidos');
        }, 100);
      } else {
        console.error('[Login] Login fallido:', response.error);
        setError(response.error || 'Credenciales incorrectas');
        toast.error(response.error || 'Credenciales incorrectas');
      }
    } catch (err: any) {
      console.error('[Login] Error en el proceso:', err);
      setError('Error al conectar con el servidor');
      toast.error('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Función para login rápido con datos de prueba reales
  const handleQuickLogin = () => {
    setPhone('53512345678');
    setPin('1234');
    toast('Datos de prueba cargados (Pedro Delivery)', {
      icon: 'ℹ️',
      duration: 3000,
    });
  };

  // Login automático con datos de prueba reales
  const handleAutoLogin = async () => {
    setPhone('53512345678');
    setPin('1234');
    setLoading(true);
    
    try {
      const response = await authService.login('53512345678', '1234');
      
      if (response.success) {
        toast.success(`Bienvenido ${response.carrier?.name || 'Transportista'}`);
        setTimeout(() => {
          router.push('/pedidos');
        }, 100);
      } else {
        setError(response.error || 'Error en login automático');
        toast.error(response.error || 'Error en login automático');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      toast.error('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Login con datos antiguos (para compatibilidad)
  const handleLegacyLogin = async () => {
    setPhone('+53 5001-1234');
    setPin('0001');
    setLoading(true);
    
    try {
      const response = await authService.login('+53 5001-1234', '0001');
      
      if (response.success) {
        toast.success(`Bienvenido ${response.carrier?.name || 'Transportista'}`);
        setTimeout(() => {
          router.push('/pedidos');
        }, 100);
      } else {
        setError(response.error || 'Error en login');
        toast.error(response.error || 'Error en login');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      toast.error('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toaster local para la página de login */}
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#22c55e',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
      
      {/* Contenedor principal sin sidebar */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <FiTruck className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Entregas App</h1>
            <p className="text-gray-600 mt-2">Sistema de Gestión de Entregas</p>
            <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs text-green-700">Conectado a Odoo 17 (XML-RPC)</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="53512345678"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={loading}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Sin espacios, guiones o símbolos</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PIN
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  maxLength={4}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
            <button
              onClick={handleQuickLogin}
              disabled={loading}
              className="w-full text-sm text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50"
            >
              Cargar datos de Pedro Delivery
            </button>
            
            <button
              onClick={handleAutoLogin}
              disabled={loading}
              className="w-full text-sm bg-green-100 text-green-700 py-2 px-4 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
            >
              Login automático (Pedro Delivery)
            </button>

            <button
              onClick={handleLegacyLogin}
              disabled={loading}
              className="w-full text-sm bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Probar con datos anteriores
            </button>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 mb-2">Datos de prueba actualizados:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p><strong>Pedro Delivery (ID: 50)</strong></p>
              <p>📱 Teléfono: 53512345678</p>
              <p>🔑 PIN: 1234</p>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500">Datos anteriores (legacy):</p>
              <p className="text-xs text-gray-500">Tel: +53 5001-1234 | PIN: 0001</p>
            </div>
          </div>

          <div className="mt-4 text-xs text-center text-gray-400">
            <p>Sistema usando XML-RPC vía Next.js API Route</p>
            <p>Odoo 17 en http://localhost:30017</p>
          </div>
        </div>
      </div>
    </>
  );
}
