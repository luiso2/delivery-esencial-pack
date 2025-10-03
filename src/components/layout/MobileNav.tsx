'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  ShoppingCartIcon,
  MapIcon,
  CreditCardIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  ShoppingCartIcon as ShoppingCartIconSolid,
  MapIcon as MapIconSolid,
  CreditCardIcon as CreditCardIconSolid,
  UserCircleIcon as UserCircleIconSolid
} from '@heroicons/react/24/solid';

const navigation = [
  { name: 'Inicio', href: '/', icon: HomeIcon, activeIcon: HomeIconSolid },
  { name: 'Pedidos', href: '/pedidos', icon: ShoppingCartIcon, activeIcon: ShoppingCartIconSolid },
  { name: 'Pagos', href: '/pagos', icon: CreditCardIcon, activeIcon: CreditCardIconSolid },
  { name: 'Cuenta', href: '/cuenta', icon: UserCircleIcon, activeIcon: UserCircleIconSolid },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom z-50">
      <div className="grid grid-cols-4 h-16">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
                          (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = isActive ? item.activeIcon : item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex flex-col items-center justify-center space-y-1
                touch-manipulation no-select
                ${isActive 
                  ? 'text-primary-600' 
                  : 'text-gray-500 hover:text-gray-700'
                }
              `}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}