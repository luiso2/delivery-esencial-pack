'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import MobileNav from './MobileNav';
import DesktopSidebar from './DesktopSidebar';
import { Toaster } from 'react-hot-toast';

interface ClientLayoutProps {
  children: ReactNode;
}

// Rutas que NO deben mostrar el sidebar
const NO_SIDEBAR_ROUTES = ['/login', '/register', '/forgot-password'];

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const [showSidebar, setShowSidebar] = useState(false);
  
  useEffect(() => {
    // Verificar si debemos mostrar el sidebar
    const shouldShowSidebar = !NO_SIDEBAR_ROUTES.includes(pathname);
    setShowSidebar(shouldShowSidebar);
    
    // Log para debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('[ClientLayout] Current path:', pathname);
      console.log('[ClientLayout] Show sidebar:', shouldShowSidebar);
    }
  }, [pathname]);

  // Si estamos en una ruta sin sidebar, solo renderizar el contenido
  if (!showSidebar) {
    return (
      <>
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
        {children}
      </>
    );
  }

  // Layout normal con sidebar
  return (
    <>
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
      
      <div className="min-h-screen bg-gray-50">
        {/* Desktop Layout with Sidebar */}
        <div className="hidden lg:flex">
          <DesktopSidebar />
          <main className="flex-1 ml-64">
            {children}
          </main>
        </div>

        {/* Mobile Layout with Bottom Navigation */}
        <div className="lg:hidden">
          <main className="pb-16">
            {children}
          </main>
          <MobileNav />
        </div>
      </div>
    </>
  );
}
