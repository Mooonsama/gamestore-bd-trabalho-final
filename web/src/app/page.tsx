'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { Jogo } from '@/types';
import { Star, Calendar, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Home() {
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroGenero, setFiltroGenero] = useState('');
  const [descricaoExpandida, setDescricaoExpandida] = useState<{ [key: number]: boolean }>({});

  const toggleDescricao = (id: number) => {
    setDescricaoExpandida((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    fetchJogos();
  }, []);

  const fetchJogos = async () => {
    try {
      const response = await api.get('/jogos');
      setJogos(response.data);
    } catch (error) {
      toast.error('Erro ao carregar jogos');
    } finally {
      setLoading(false);
    }
  };

  const jogosFiltrados = filtroGenero
    ? jogos.filter(jogo => jogo.genero === filtroGenero)
    : jogos;

  const generos = Array.from(new Set(jogos.map(jogo => jogo.genero)));

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Catálogo de Jogos</h1>
          
          {/* Filtro por gênero */}
          <div className="mb-6">
            <select
              value={filtroGenero}
              onChange={(e) => setFiltroGenero(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os gêneros</option>
              {generos.map(genero => (
                <option key={genero} value={genero}>{genero}</option>
              ))}
            </select>
          </div>

          {/* Grid de jogos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {jogosFiltrados.map((jogo) => {
              const descricao = jogo.descricao ?? '';
              const descricaoLonga = descricao.length > 120;
              const expandida = descricaoExpandida[jogo.id];

              return (
                <div
                  key={jogo.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
                >
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{jogo.nome}</h3>
                    <p className="text-sm text-gray-600 mb-2">{jogo.genero}</p>
                    <div className="mb-4">
                      <p
                        className={
                          "text-sm text-gray-500 " +
                          (!expandida && descricaoLonga ? "line-clamp-3" : "")
                        }
                      >
                        {descricao}
                      </p>
                      {descricaoLonga && (
                        <button
                          className="text-blue-600 text-xs mt-1 hover:underline focus:outline-none"
                          onClick={() => toggleDescricao(jogo.id)}
                        >
                          {expandida ? "Ver menos" : "Ver mais"}
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">
                          {jogo.media_avaliacao > 0 ? jogo.media_avaliacao.toFixed(1) : 'N/A'}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          ({jogo.total_avaliacoes})
                        </span>
                      </div>
                      <div className="flex items-center text-green-600">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span className="font-semibold">
                          {jogo.valor === 0 ? 'Grátis' : `R$ ${jogo.valor.toFixed(2)}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center text-xs text-gray-500 mb-4">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(jogo.data_lancamento).toLocaleDateString('pt-BR')}
                    </div>

                    <div className="text-xs text-gray-500 mb-4 flex flex-wrap gap-1">
                      <span className="font-medium">Desenvolvedora:</span>
                      <span className="break-words">{jogo.nome_desenvolvedora}</span>
                    </div>

                    <div className="mt-auto">
                      <Link
                        href={`/jogo/${jogo.id}`}
                        className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {jogosFiltrados.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum jogo encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}