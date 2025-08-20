import { prisma } from '../repositories/database';
import { CompraRequest, AvaliacaoRequest, CartaoRequest } from '../types';

export class UsuarioService {
  async createCompra(userId: string, data: CompraRequest) {
    // Verificar se o jogo existe
    const jogo = await prisma.jogo.findUnique({
      where: { id: data.id_jogo },
    });

    if (!jogo) {
      throw new Error('Jogo não encontrado');
    }

    // Verificar se usuário já possui o jogo
    const compraExistente = await prisma.compra.findFirst({
      where: {
        id_usuario: userId,
        id_jogo: data.id_jogo,
      },
    });

    if (compraExistente) {
      throw new Error('Você já possui este jogo');
    }

    // Verificar se a data de lançamento já passou
    if (jogo.data_lancamento > new Date()) {
      throw new Error('Não é possível comprar jogo antes da data de lançamento');
    }

    return prisma.compra.create({
      data: {
        id_usuario: userId,
        id_jogo: data.id_jogo,
        valor_pago: data.valor_pago,
        data_compra: new Date(),
      },
      include: {
        jogo: {
          include: {
            desenvolvedora: true,
          },
        },
      },
    });
  }

  async getCompras(userId: string) {
    return prisma.compra.findMany({
      where: { id_usuario: userId },
      include: {
        jogo: {
          include: {
            desenvolvedora: true,
          },
        },
      },
      orderBy: {
        data_compra: 'desc',
      },
    });
  }

  async createAvaliacao(userId: string, jogoId: number, data: AvaliacaoRequest) {
    // Verificar se o usuário comprou o jogo
    const compra = await prisma.compra.findFirst({
      where: {
        id_usuario: userId,
        id_jogo: jogoId,
      },
    });

    if (!compra) {
      throw new Error('Usuário deve comprar o jogo antes de avaliá-lo');
    }

    // Verificar se a nota está no intervalo válido
    if (data.nota < 0 || data.nota > 10) {
      throw new Error('Nota deve estar entre 0 e 10');
    }

    return prisma.avaliacao.upsert({
      where: {
        id_usuario_id_jogo: {
          id_usuario: userId,
          id_jogo: jogoId,
        },
      },
      update: {
        nota: data.nota,
        texto: data.texto,
        data_publicacao: new Date(),
      },
      create: {
        id_usuario: userId,
        id_jogo: jogoId,
        nota: data.nota,
        texto: data.texto,
        data_publicacao: new Date(),
      },
      include: {
        jogo: true,
      },
    });
  }

  async createCartao(userId: string, data: CartaoRequest) {
    // Validações básicas
    if (!/^\d{16}$/.test(data.numero)) {
      throw new Error('Número do cartão deve ter 16 dígitos');
    }

    if (data.validade_mes < 1 || data.validade_mes > 12) {
      throw new Error('Mês de validade inválido');
    }

    if (data.validade_ano < new Date().getFullYear()) {
      throw new Error('Ano de validade não pode ser no passado');
    }

    if (!/^\d{3,4}$/.test(data.codigo_seguranca)) {
      throw new Error('Código de segurança deve ter 3 ou 4 dígitos');
    }

    const bandeiraValida = ['VISA', 'MASTERCARD', 'ELO', 'AMERICAN_EXPRESS'];
    if (!bandeiraValida.includes(data.bandeira)) {
      throw new Error('Bandeira do cartão inválida');
    }

    return prisma.cartaoBancario.create({
      data: {
        id_usuario: userId,
        numero: data.numero,
        bandeira: data.bandeira,
        validade_mes: data.validade_mes,
        validade_ano: data.validade_ano,
        codigo_seguranca: data.codigo_seguranca,
      },
    });
  }

  async getCartoes(userId: string) {
    return prisma.cartaoBancario.findMany({
      where: { id_usuario: userId },
      select: {
        numero: true,
        bandeira: true,
        validade_mes: true,
        validade_ano: true,
        // Não retornar código de segurança por segurança
      },
    });
  }

  async checkCompra(userId: string, jogoId: number) {
    const compra = await prisma.compra.findFirst({
      where: {
        id_usuario: userId,
        id_jogo: jogoId,
      },
    });
    return !!compra;
  }
}