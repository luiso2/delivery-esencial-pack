'use client';

import { UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CuentaPage() {
  const router = useRouter();

  const handleLogout = () => {
    // In real app, this would clear auth tokens/session
    toast.success('Sesión cerrada exitosamente');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">Mi Cuenta</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="card-base p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="h-20 w-20 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-white text-2xl font-medium">JP</span>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Juan Pérez</h2>
              <p className="text-sm text-gray-500">ID: distribuidor-001</p>
              <p className="text-sm text-gray-500">Distribuidor Activo</p>
            </div>
          </div>
        </div>

        <div className="mt-6 card-base p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Cuenta</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Teléfono</span>
              <span className="text-gray-900">+53 5234 5678</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Zona</span>
              <span className="text-gray-900">La Habana</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estado</span>
              <span className="badge-base badge-delivered">Activo</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="w-full card-base p-4 hover:bg-red-50 transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-600" />
              <span className="text-gray-900 font-medium group-hover:text-red-600">Cerrar Sesión</span>
            </div>
            <span className="text-gray-400 group-hover:text-red-400">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}