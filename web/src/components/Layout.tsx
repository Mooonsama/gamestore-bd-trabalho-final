import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User, ShoppingCart, Star, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                MAETS
              </Link>
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Jogos
                </Link>
                {user && (
                  <Link
                    href={`/usuario/${user.cpf}/compras`}
                    className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Minhas Compras
                  </Link>
                )}
                {isAdmin() && (
                  <Link
                    href="/admin"
                    className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Admin
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700 flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {user.nome}
                  </span>
                  <button
                    onClick={logout}
                    className="text-gray-500 hover:text-gray-900 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Sair
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/registro"
                    className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium border border-blue-600 hover:border-blue-700"
                  >
                    Criar Conta
                  </Link>
                  <Link
                    href="/login"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Entrar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}