'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import MobileNav from './MobileNav';
import DesktopSidebar from './DesktopSidebar';
import { Toaster } from 'react-hot-toast';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();

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
        {/* Desktop Layout */}
        <div className="hidden lg:flex">
          <DesktopSidebar />
          <main className="flex-1 ml-64">
            {children}
          </main>
        </div>

        {/* Mobile Layout */}
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