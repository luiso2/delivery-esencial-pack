'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  ShoppingCartIcon,
  MapIcon,
  CameraIcon,
  CreditCardIcon,
  UserCircleIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Inicio', href: '/', icon: HomeIcon },
  { name: 'Pedidos', href: '/pedidos', icon: ShoppingCartIcon },
  { name: 'Rutas', href: '/rutas', icon: MapIcon },
  { name: 'Capturas', href: '/capturas', icon: CameraIcon },
  { name: 'Pagos', href: '/pagos', icon: CreditCardIcon },
  { name: 'Mi Cuenta', href: '/cuenta', icon: UserCircleIcon },
];

export default function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <TruckIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Entregas</h2>
              <p className="text-xs text-gray-500">Esencial Pack</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
                            (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-3 py-2 rounded-lg text-sm font-medium
                  transition-colors duration-150 ease-in-out
                  ${isActive 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-white font-medium">JD</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Juan Driver
              </p>
              <p className="text-xs text-gray-500 truncate">
                driver-001
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}