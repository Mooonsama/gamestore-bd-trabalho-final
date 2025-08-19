export interface Jogo {
  id: number;
  nome: string;
  genero: string;
  descricao: string | null;
  data_lancamento: string;
  valor: number;
  id_desenvolvedora: string;
  nome_desenvolvedora: string;
  media_avaliacao: number;
  total_avaliacoes: number;
}

export interface User {
  cpf: string;
  nome: string;
  email: string;
  tipo: 'usuario' | 'administrador';
  permissoes?: string[];
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Compra {
  id_usuario: string;
  id_jogo: number;
  data_compra: string;
  valor_pago: number;
  jogo: Jogo & {
    desenvolvedora: {
      nome: string;
    };
  };
}

export interface Avaliacao {
  id_usuario: string;
  id_jogo: number;
  nota: number;
  texto: string | null;
  data_publicacao: string;
  usuario: {
    pessoa: {
      nome: string;
    };
  };
}

export interface CartaoBancario {
  numero: string;
  bandeira: string;
  validade_mes: number;
  validade_ano: number;
}