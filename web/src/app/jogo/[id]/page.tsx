'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Jogo, Avaliacao } from '@/types';
import { Star, Calendar, DollarSign, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function JogoDetalhes() {
  const params = useParams();
  const { user, isAuthenticated } = useAuth();
  const [jogo, setJogo] = useState<Jogo | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [comprando, setComprando] = useState(false);
  const [avaliando, setAvaliando] = useState(false);
  const [nota, setNota] = useState(10);
  const [texto, setTexto] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchJogo();
      fetchAvaliacoes();
    }
  }, [params.id]);

  const fetchJogo = async () => {
    try {
      const response = await api.get(`/jogos/${params.id}`);
      setJogo(response.data);
    } catch (error) {
      toast.error('Erro ao carregar jogo');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvaliacoes = async () => {
    try {
      const response = await api.get(`/jogos/${params.id}/avaliacoes`);
      setAvaliacoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar avaliações');
    }
  };

  const handleCompra = async () => {
    if (!isAuthenticated || !user || !jogo) return;

    setComprando(true);
    try {
      await api.post(`/usuarios/${user.cpf}/compras`, {
        id_jogo: jogo.id,
        valor_pago: jogo.valor,
      });
      toast.success('Compra realizada com sucesso!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao realizar compra');
    } finally {
      setComprando(false);
    }
  };

  const handleAvaliacao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user || !jogo) return;

    setAvaliando(true);
    try {
      await api.post(`/jogos/${jogo.id}/avaliacoes`, {
        nota,
        texto: texto.trim() || undefined,
      });
      toast.success('Avaliação enviada com sucesso!');
      setTexto('');
      fetchAvaliacoes();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao enviar avaliação');
    } finally {
      setAvaliando(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!jogo) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Jogo não encontrado.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Informações do jogo */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{jogo.nome}</h1>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 w-24">Gênero:</span>
                    <span className="text-sm text-gray-900">{jogo.genero}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 w-24">Lançamento:</span>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {new Date(jogo.data_lancamento).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 w-24">Dev:</span>
                    <span className="text-sm text-gray-900">{jogo.nome_desenvolvedora}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 w-24">Avaliação:</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      <span className="text-sm font-medium">
                        {jogo.media_avaliacao > 0 ? jogo.media_avaliacao.toFixed(1) : 'N/A'}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({jogo.total_avaliacoes} avaliações)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 w-24">Preço:</span>
                    <div className="flex items-center text-green-600">
                      <DollarSign className="w-5 h-5 mr-1" />
                      <span className="text-lg font-bold">
                        {jogo.valor === 0 ? 'Grátis' : `R$ ${jogo.valor.toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                </div>

                {jogo.descricao && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Descrição</h3>
                    <p className="text-gray-700">{jogo.descricao}</p>
                  </div>
                )}

                {/* Botão de compra */}
                {isAuthenticated && user?.tipo === 'usuario' && (
                  <div className="mt-8">
                    <button
                      onClick={handleCompra}
                      disabled={comprando}
                      className="flex items-center justify-center w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      {comprando ? 'Comprando...' : 'Comprar Jogo'}
                    </button>
                  </div>
                )}
              </div>

              {/* Formulário de avaliação */}
              {isAuthenticated && user?.tipo === 'usuario' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Avaliar Jogo</h3>
                  <form onSubmit={handleAvaliacao} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nota (0-10)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={nota}
                        onChange={(e) => setNota(parseInt(e.target.value))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comentário (opcional)
                      </label>
                      <textarea
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        rows={4}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-black"
                        placeholder="Compartilhe sua opinião sobre o jogo..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={avaliando}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      {avaliando ? 'Enviando...' : 'Enviar Avaliação'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Avaliações */}
        <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Avaliações ({avaliacoes.length})
            </h3>
            {avaliacoes.length > 0 ? (
              <div className="space-y-4">
                {avaliacoes.map((avaliacao, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        {avaliacao.usuario.pessoa.nome}
                      </span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="font-medium">{avaliacao.nota}/10</span>
                      </div>
                    </div>
                    {avaliacao.texto && (
                      <p className="text-black mb-2">{avaliacao.texto}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {new Date(avaliacao.data_publicacao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhuma avaliação ainda.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}