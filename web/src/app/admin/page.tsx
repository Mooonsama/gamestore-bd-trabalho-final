'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Jogo } from '@/types';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const { user, isAdmin, hasPermission } = useAuth();
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingJogo, setEditingJogo] = useState<Jogo | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    genero: '',
    descricao: '',
    data_lancamento: '',
    valor: 0,
    id_desenvolvedora: ''
  });
  const [desenvolvedoras, setDesenvolvedoras] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && (user.tipo === 'administrador' || (user.permissoes && user.permissoes.length > 0))) {
      fetchJogos();
    } else if (user) {
      setLoading(false);
    }
  }, [user]);

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

  const fetchDesenvolvedoras = async () => {
    try {
      const response = await api.get('/desenvolvedoras');
      setDesenvolvedoras(response.data);
    } catch (error) {
      // Se não existir endpoint, usar dados mock
      setDesenvolvedoras([
        { cnpj: '12345678000195', nome: 'Epic Games' },
        { cnpj: '23456789000186', nome: 'Ubisoft' },
        { cnpj: '34567890000177', nome: 'CD Projekt' }
      ]);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      genero: '',
      descricao: '',
      data_lancamento: '',
      valor: 0,
      id_desenvolvedora: ''
    });
  };

  const handleCreateJogo = () => {
    resetForm();
    setShowCreateForm(true);
    fetchDesenvolvedoras();
  };

  const handleEditJogo = (jogo: Jogo) => {
    setFormData({
      nome: jogo.nome,
      genero: jogo.genero,
      descricao: jogo.descricao || '',
      data_lancamento: jogo.data_lancamento.split('T')[0],
      valor: jogo.valor,
      id_desenvolvedora: jogo.id_desenvolvedora
    });
    setEditingJogo(jogo);
    fetchDesenvolvedoras();
  };

  const handleSubmitJogo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingJogo) {
        await api.put(`/jogos/${editingJogo.id}`, formData);
        toast.success('Jogo atualizado com sucesso!');
      } else {
        await api.post('/jogos', formData);
        toast.success('Jogo criado com sucesso!');
      }
      
      setShowCreateForm(false);
      setEditingJogo(null);
      resetForm();
      fetchJogos();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao salvar jogo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelForm = () => {
    setShowCreateForm(false);
    setEditingJogo(null);
    resetForm();
  };

  const handleDeleteJogo = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este jogo?')) return;

    try {
      await api.delete(`/jogos/${id}`);
      toast.success('Jogo excluído com sucesso!');
      fetchJogos();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao excluir jogo');
    }
  };

  if (user && !(user.tipo === 'administrador' || (user.permissoes && user.permissoes.length > 0))) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Acesso restrito a administradores.</p>
        </div>
      </Layout>
    );
  }

  if (!user && !loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Faça login como administrador para acessar esta página.</p>
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

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
            {hasPermission('gerenciar_jogos') && (
              <button
                onClick={handleCreateJogo}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Jogo
              </button>
            )}
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Settings className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total de Jogos
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {jogos.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Settings className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Jogos Gratuitos
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {jogos.filter(j => j.valor === 0).length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Settings className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Média de Avaliação
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {jogos.length > 0 
                          ? (jogos.reduce((acc, j) => acc + j.media_avaliacao, 0) / jogos.length).toFixed(1)
                          : '0.0'
                        }
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de jogos */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Gerenciar Jogos
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Lista de todos os jogos cadastrados no sistema.
              </p>
            </div>
            <ul className="divide-y divide-gray-200">
              {jogos.map((jogo) => (
                <li key={jogo.id}>
                  <div className="px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {jogo.nome}
                        </div>
                        <div className="text-sm text-gray-500">
                          {jogo.genero} • {jogo.nome_desenvolvedora} • 
                          {jogo.valor === 0 ? ' Grátis' : ` R$ ${jogo.valor.toFixed(2)}`}
                        </div>
                      </div>
                    </div>
                    {hasPermission('gerenciar_jogos') && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditJogo(jogo)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteJogo(jogo.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {jogos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum jogo cadastrado.</p>
            </div>
          )}
        </div>

        {/* Modal de formulário */}
        {(showCreateForm || editingJogo) && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingJogo ? 'Editar Jogo' : 'Novo Jogo'}
                </h3>
                <form onSubmit={handleSubmitJogo} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <input
                      type="text"
                      required
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gênero</label>
                    <input
                      type="text"
                      required
                      value={formData.genero}
                      onChange={(e) => setFormData({...formData, genero: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Descrição</label>
                    <textarea
                      value={formData.descricao}
                      onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Data de Lançamento</label>
                    <input
                      type="date"
                      required
                      value={formData.data_lancamento}
                      onChange={(e) => setFormData({...formData, data_lancamento: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Valor</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.valor}
                      onChange={(e) => setFormData({...formData, valor: parseFloat(e.target.value)})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Desenvolvedora</label>
                    <select
                      required
                      value={formData.id_desenvolvedora}
                      onChange={(e) => setFormData({...formData, id_desenvolvedora: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900"
                    >
                      <option value="">Selecione uma desenvolvedora</option>
                      {desenvolvedoras.map((dev) => (
                        <option key={dev.cnpj} value={dev.cnpj}>{dev.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCancelForm}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {submitting ? 'Salvando...' : (editingJogo ? 'Atualizar' : 'Criar')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}