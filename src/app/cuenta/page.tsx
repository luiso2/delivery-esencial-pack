'use client';

import { useEffect, useState } from 'react';
import { 
  UserCircleIcon, 
  ArrowRightOnRectangleIcon, 
  TruckIcon, 
  PhoneIcon, 
  MapPinIcon, 
  IdentificationIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import authService from '@/services/authService';

interface UserData {
  id: number;
  name: string;
  code: string;
  phone?: string;
  vehicle_type?: string;
  zone_name?: string;
  zones?: Array<{ id: number; name: string }>;
}

export default function CuentaPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    // Cargar datos del usuario desde localStorage
    const loadUserData = () => {
      try {
        const carrierData = localStorage.getItem('carrierData');
        if (carrierData) {
          const data = JSON.parse(carrierData);
          setUserData(data);
        } else {
          // Si no hay datos, redirigir al login
          router.push('/login');
        }
      } catch (error) {
        console.error('Error cargando datos del usuario:', error);
        toast.error('Error al cargar los datos del usuario');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  const handleLogout = async () => {
    try {
      // Cerrar sesión usando el servicio
      authService.logout();
      
      // Mostrar mensaje de éxito
      toast.success('Sesión cerrada exitosamente');
      
      // Pequeña espera para que se muestre el toast
      setTimeout(() => {
        // Redirigir al login
        router.push('/login');
      }, 500);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  // Función para obtener las iniciales del nombre
  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Función para obtener el tipo de vehículo en español
  const getVehicleTypeLabel = (type?: string) => {
    const types: Record<string, string> = {
      'bicycle': 'Bicicleta',
      'motorcycle': 'Motocicleta',
      'car': 'Automóvil',
      'van': 'Furgoneta',
      'truck': 'Camión'
    };
    return types[type || ''] || type || 'No especificado';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No se encontró información del usuario</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 text-primary-600 hover:text-primary-700"
          >
            Volver al login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-xl font-semibold text-gray-900">Mi Cuenta</h1>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Información principal del usuario */}
          <div className="card-base p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-20 w-20 rounded-full bg-primary-600 flex items-center justify-center">
                  <span className="text-white text-2xl font-medium">
                    {getInitials(userData.name)}
                  </span>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{userData.name}</h2>
                <p className="text-sm text-gray-500">
                  <span className="inline-flex items-center">
                    <IdentificationIcon className="h-4 w-4 mr-1" />
                    ID: {userData.code || `carrier-${userData.id}`}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  {userData.id === 0 ? 'Administrador' : 'Transportista Activo'}
                </p>
              </div>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="mt-6 card-base p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  Teléfono
                </span>
                <span className="text-gray-900">
                  {userData.phone || '+53 5001-1234'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  Zona
                </span>
                <span className="text-gray-900">
                  {userData.zone_name || userData.zones?.[0]?.name || 'Sin zona asignada'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center">
                  <TruckIcon className="h-4 w-4 mr-2" />
                  Vehículo
                </span>
                <span className="text-gray-900">
                  {getVehicleTypeLabel(userData.vehicle_type)}
                </span>
              </div>
            </div>
          </div>

          {/* Estadísticas del transportista */}
          <div className="mt-6 card-base p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">0</p>
                <p className="text-sm text-gray-600">Entregas Hoy</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">0%</p>
                <p className="text-sm text-gray-600">Tasa de Éxito</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">0</p>
                <p className="text-sm text-gray-600">Esta Semana</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">0</p>
                <p className="text-sm text-gray-600">Este Mes</p>
              </div>
            </div>
          </div>

          {/* Información del sistema */}
          <div className="mt-6 card-base p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Sistema</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Estado de Cuenta</span>
                <span className="badge-base badge-delivered">Activo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Última Conexión</span>
                <span className="text-gray-900">Hace unos momentos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Versión de la App</span>
                <span className="text-gray-900">1.0.0</span>
              </div>
            </div>
          </div>

          {/* Botón de cerrar sesión */}
          <div className="mt-6">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full card-base p-4 hover:bg-red-50 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-600" />
                <span className="text-gray-900 font-medium group-hover:text-red-600">
                  Cerrar Sesión
                </span>
              </div>
              <span className="text-gray-400 group-hover:text-red-400">→</span>
            </button>
          </div>

          {/* Información adicional para admin */}
          {userData.id === 0 && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Modo Administrador:</strong> Tienes acceso completo al sistema.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación de logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirmar Cierre de Sesión
              </h3>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas cerrar sesión? Tendrás que volver a iniciar sesión para acceder a la aplicación.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
