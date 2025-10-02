import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/login', '/register', '/forgot-password', '/test'];

// Rutas de API que no requieren autenticación
const publicApiRoutes = ['/api/auth/carrier-login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Permitir acceso a rutas de API públicas
  if (publicApiRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Permitir acceso a recursos estáticos
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/static') || 
      pathname.includes('.')) {
    return NextResponse.next();
  }
  
  // Verificar si es una ruta pública
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Obtener token de las cookies
  const token = request.cookies.get('token')?.value;
  const carrierId = request.cookies.get('carrierId')?.value;
  
  // Si no hay token y no es una ruta pública, redirigir a login
  if (!token && !carrierId && !isPublicRoute) {
    console.log('[Middleware] No autorizado, redirigiendo a login');
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Si hay token y está intentando acceder a login, redirigir a pedidos
  if ((token || carrierId) && isPublicRoute) {
    console.log('[Middleware] Usuario autenticado en ruta pública, redirigiendo a pedidos');
    return NextResponse.redirect(new URL('/pedidos', request.url));
  }
  
  return NextResponse.next();
}

// Configurar las rutas donde se aplicará el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
