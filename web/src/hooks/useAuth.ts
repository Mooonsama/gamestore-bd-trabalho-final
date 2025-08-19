import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { User } from '@/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    const userData = Cookies.get('user');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Erro ao parsear dados do usuário:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    Cookies.set('token', token, { expires: 1 }); // 1 dia
    Cookies.set('user', JSON.stringify(userData), { expires: 1 });
    setUser(userData);
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    setUser(null);
  };

  const isAdmin = () => {
    return user?.tipo === 'administrador' || (user?.permissoes && user.permissoes.length > 0);
  };

  const hasPermission = (permission: string) => {
    return user?.permissoes?.includes(permission) || false;
  };

  return {
    user,
    loading,
    login,
    logout,
    isAdmin,
    hasPermission,
    isAuthenticated: !!user,
  };
};