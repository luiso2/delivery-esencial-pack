'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/services/authService';

interface User {
  id: number;
  name: string;
  code: string;
  vehicleType: string;
  zones: Array<{ id: number; name: string }>;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);
    
    if (authenticated) {
      const userData = authService.getCurrentUser();
      setUser(userData);
    }
    
    setLoading(false);
  };

  const login = async (phone: string, pin: string) => {
    const response = await authService.login(phone, pin);
    
    if (response.success) {
      checkAuth();
      return response;
    }
    
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  const requireAuth = () => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin: authService.isAdmin(),
    login,
    logout,
    requireAuth,
    checkAuth
  };
}
