'use client';

import {
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

// FUNCIONALIDAD TEMPORALMENTE DESHABILITADA
// Esta página se implementará más adelante con:
// - Optimización automática de rutas
// - Integración con mapas GPS
// - Cálculo de distancias reales
// - Navegación turn-by-turn

export default function RoutesPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Gestión de Rutas</h1>
              <p className="mt-1 text-orange-100">Funcionalidad en desarrollo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border-2 border-orange-200 p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-4">
              <WrenchScrewdriverIcon className="h-8 w-8 text-orange-600" />
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Optimización de Rutas en Desarrollo
            </h2>

            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Esta funcionalidad se está desarrollando e incluirá:
            </p>

            <div className="grid gap-4 text-left max-w-sm mx-auto mb-6">
              <div className="flex items-center text-gray-700">
                <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                Optimización automática de rutas
              </div>
              <div className="flex items-center text-gray-700">
                <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                Integración con mapas GPS
              </div>
              <div className="flex items-center text-gray-700">
                <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                Cálculo de distancias reales
              </div>
              <div className="flex items-center text-gray-700">
                <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                Navegación turn-by-turn
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-orange-600 mr-2" />
                <span className="text-sm text-orange-800">
                  Por ahora, utiliza la sección <strong>Pedidos</strong> para gestionar las entregas
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}