import { XMarkIcon } from '@heroicons/react/24/outline';

interface RouteFiltersProps {
  filters: {
    status: string;
    search: string;
  };
  onFilterChange: (filters: any) => void;
  metrics?: {
    total: number;
    active: number;
    draft: number;
    completed: number;
  } | null;
}

export default function RouteFilters({ filters, onFilterChange, metrics }: RouteFiltersProps) {
  const statusOptions = [
    { value: 'all', label: 'Todas', count: metrics?.total || 0 },
    { value: 'active', label: 'Activas', count: metrics?.active || 0, color: 'text-green-600' },
    { value: 'draft', label: 'Borradores', count: metrics?.draft || 0, color: 'text-gray-600' },
    { value: 'completed', label: 'Completadas', count: metrics?.completed || 0, color: 'text-blue-600' }
  ];

  const handleStatusChange = (status: string) => {
    onFilterChange({ status });
  };

  const clearFilters = () => {
    onFilterChange({ status: 'all', search: '' });
  };

  const hasActiveFilters = filters.status !== 'all' || filters.search;

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">Filtros</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
          >
            <XMarkIcon className="h-3 w-3 mr-1" />
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Status Filter */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">Estado</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {statusOptions.map(option => (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${filters.status === option.value
                  ? 'bg-primary-100 text-primary-700 border-2 border-primary-300'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <span className={option.color || ''}>
                {option.label}
              </span>
              <span className="ml-1 text-xs text-gray-500">
                ({option.count})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Additional Filters */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sort By */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-2 block">Ordenar por</label>
            <select 
              className="input-base text-sm"
              onChange={(e) => onFilterChange({ sortBy: e.target.value })}
            >
              <option value="updated">Más recientes</option>
              <option value="name">Nombre</option>
              <option value="orders">Cantidad de pedidos</option>
              <option value="distance">Distancia</option>
            </select>
          </div>

          {/* Color Filter */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-2 block">Color de ruta</label>
            <div className="flex gap-2">
              {['blue', 'green', 'purple', 'yellow', 'red', 'orange'].map(color => (
                <button
                  key={color}
                  onClick={() => onFilterChange({ color })}
                  className={`h-8 w-8 rounded-lg bg-${color}-500 hover:ring-2 hover:ring-${color}-300 transition-all`}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.status !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                Estado: {statusOptions.find(o => o.value === filters.status)?.label}
                <button
                  onClick={() => handleStatusChange('all')}
                  className="ml-1 hover:text-primary-900"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.search && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                Búsqueda: &quot;{filters.search}&quot;
                <button
                  onClick={() => onFilterChange({ search: '' })}
                  className="ml-1 hover:text-primary-900"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}