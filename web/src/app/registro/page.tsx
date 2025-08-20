'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function Registro() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cpf: '',
    nome: '',
    email: '',
    telefone: '',
    data_nascimento: '',
    rede_social: '',
    senha: '',
    confirmarSenha: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.senha !== formData.confirmarSenha) {
      toast.error('Senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/registro', {
        cpf: formData.cpf,
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        data_nascimento: formData.data_nascimento,
        rede_social: formData.rede_social || null,
        senha: formData.senha
      });
      
      toast.success('Conta criada com sucesso!');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Criar nova conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            faça login na sua conta existente
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                CPF
              </label>
              <input
                type="text"
                required
                value={formData.cpf}
                onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black"
                placeholder="12345678901"
                maxLength={11}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome completo
              </label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <input
                type="tel"
                required
                value={formData.telefone}
                onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data de nascimento
              </label>
              <input
                type="date"
                required
                value={formData.data_nascimento}
                onChange={(e) => setFormData({...formData, data_nascimento: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rede social (opcional)
              </label>
              <input
                type="text"
                value={formData.rede_social}
                onChange={(e) => setFormData({...formData, rede_social: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black"
                placeholder="@usuario"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                type="password"
                required
                value={formData.senha}
                onChange={(e) => setFormData({...formData, senha: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black"
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirmar senha
              </label>
              <input
                type="password"
                required
                value={formData.confirmarSenha}
                onChange={(e) => setFormData({...formData, confirmarSenha: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black"
                minLength={6}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Criando conta...' : 'Criar conta'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}