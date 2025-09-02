import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from '@/components/layout/ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Entregas Esencial Pack',
  description: 'Sistema de gestión de entregas para conductores',
  manifest: '/manifest.json',
  applicationName: 'Entregas Esencial Pack',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Entregas App'
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    title: 'Entregas Esencial Pack',
    description: 'Sistema de gestión de entregas para conductores',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Entregas Esencial Pack',
    description: 'Sistema de gestión de entregas para conductores',
  }
}

export const viewport: Viewport = {
  themeColor: '#7c3aed',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
