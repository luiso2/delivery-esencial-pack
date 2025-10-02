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
          router.refresh(); // Forzar actualización del layout
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

  return (
    <>
      {/* Toaster para notificaciones */}
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
      
      {/* Pantalla de login completa - sin sidebar */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            {/* Logo y título */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                <FiTruck className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Entregas App</h1>
              <p className="text-gray-600 mt-2">Sistema de Gestión de Entregas</p>
              <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-700">Conectado a Odoo 17</p>
              </div>
            </div>

            {/* Formulario de login */}
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
                    autoFocus
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
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </span>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            {/* Información de prueba */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs font-semibold text-blue-900 mb-2">Datos de prueba:</p>
                <div className="space-y-1 text-xs text-blue-800">
                  <p>📱 Teléfono: <code className="bg-white px-1 py-0.5 rounded">53512345678</code></p>
                  <p>🔑 PIN: <code className="bg-white px-1 py-0.5 rounded">1234</code></p>
                </div>
              </div>
            </div>

            {/* Pie de página */}
            <div className="mt-4 text-xs text-center text-gray-400">
              <p>© 2025 Esencial Pack Cuba</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
