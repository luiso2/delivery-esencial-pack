'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import MobileNav from './MobileNav';
import DesktopSidebar from './DesktopSidebar';
import { Toaster } from 'react-hot-toast';
import authService from '@/services/authService';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Verificar autenticación
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      // Verificar si debemos mostrar el sidebar
      // El sidebar solo se muestra si:
      // 1. El usuario está autenticado
      // 2. NO estamos en una página de login/registro
      const isLoginPage = pathname.includes('/login') || 
                         pathname.includes('/register') || 
                         pathname.includes('/forgot-password');
      
      const shouldShowSidebar = authenticated && !isLoginPage;
      setShowSidebar(shouldShowSidebar);
      
      // Log para debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('[ClientLayout] Current path:', pathname);
        console.log('[ClientLayout] Authenticated:', authenticated);
        console.log('[ClientLayout] Is login page:', isLoginPage);
        console.log('[ClientLayout] Show sidebar:', shouldShowSidebar);
      }
    };
    
    checkAuth();
  }, [pathname]);

  // Si no hay autenticación o estamos en página de login, mostrar solo el contenido
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          {children}
        </div>
      </>
    );
  }

  // Layout normal con sidebar (solo para usuarios autenticados)
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
