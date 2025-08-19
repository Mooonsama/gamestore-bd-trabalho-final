'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Compra } from '@/types';
import { Calendar, DollarSign, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MinhasCompras() {
  const params = useParams();
  const { user, isAuthenticated } = useAuth();
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id && isAuthenticated) {
      fetchCompras();
    }
  }, [params.id, isAuthenticated]);

  const fetchCompras = async () => {
    try {
      const response = await api.get(`/usuarios/${params.id}/compras`);
      setCompras(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao carregar compras');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Você precisa estar logado para ver suas compras.</p>
          <Link href="/login" className="text-blue-600 hover:text-blue-800">
            Fazer login
          </Link>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  const totalGasto = compras.reduce((total, compra) => total + Number(compra.valor_pago), 0);

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Minhas Compras</h1>
          
          {compras.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-800">
                    <strong>{compras.length}</strong> jogos comprados
                  </p>
                </div>
                <div className="flex items-center text-blue-800">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span className="font-semibold">
                    Total gasto: R$ {totalGasto.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {compras.length > 0 ? (
            <div className="space-y-4">
              {compras.map((compra, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {compra.jogo.nome}
                      </h3>
                        <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
                            <div className="grid grid-cols-2 gap-x-16 gap-y-2">
                              <div className="flex items-center">
                                <span className="w-36 font-medium text-gray-500 flex items-center">
                                  <span className="mr-2">🎮</span>Gênero:
                                </span>
                                <span className="ml-2 flex items-center">
                                  {compra.jogo.genero}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="w-36 font-medium text-gray-500 flex items-center">
                                  <span className="mr-2">🏢</span>Desenvolvedora:
                                </span>
                                <span className="ml-2 flex items-center">
                                  {compra.jogo.desenvolvedora.nome}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="w-36 font-medium text-gray-500 flex items-center">
                                  <Calendar className="w-4 h-4 mr-2 text-blue-500" />Compra:
                                </span>
                                <span className="ml-2">
                                  {new Date(compra.data_compra).toLocaleDateString('pt-BR')} às{' '}
                                  {new Date(compra.data_compra).toLocaleTimeString('pt-BR')}
                                </span>
                              </div>
                              <div className="flex items-center text-green-700">
                                <span className="w-36 font-medium text-gray-500 flex items-center">
                                  <DollarSign className="w-4 h-4 mr-2" />Valor:
                                </span>
                                <span className="ml-2 font-semibold">
                                  {Number(compra.valor_pago) === 0 ? 'Grátis' : `R$ ${Number(compra.valor_pago).toFixed(2)}`}
                                </span>
                              </div>
                            </div>
                        </div>
                    </div>
                    <div className="ml-4">
                      <Link
                        href={`/jogo/${compra.jogo.id}`}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Ver Jogo
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Você ainda não fez nenhuma compra.</p>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Explorar Jogos
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}