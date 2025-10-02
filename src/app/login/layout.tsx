import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login - Entregas Esencial Pack',
  description: 'Iniciar sesión en el sistema de entregas',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Layout específico para login - sin sidebar
  return (
    <>
      {children}
    </>
  )
}
