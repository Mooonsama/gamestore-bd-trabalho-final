export interface JogoComMedia {
  id: number;
  nome: string;
  genero: string;
  descricao: string | null;
  data_lancamento: Date;
  valor: number;
  id_desenvolvedora: string;
  nome_desenvolvedora: string;
  media_avaliacao: number;
  total_avaliacoes: number;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  user: {
    cpf: string;
    nome: string;
    email: string;
    tipo: 'usuario' | 'administrador';
    permissoes?: string[];
  };
}

export interface CompraRequest {
  id_jogo: number;
  valor_pago: number;
}

export interface AvaliacaoRequest {
  nota: number;
  texto?: string;
}

export interface CartaoRequest {
  numero: string;
  bandeira: string;
  validade_mes: number;
  validade_ano: number;
  codigo_seguranca: string;
}

export interface GerenciaRequest {
  id_admin: string;
  id_jogo: number;
  data_inicio: string;
  data_fim?: string;
}