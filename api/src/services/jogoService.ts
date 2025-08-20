import { prisma } from '../repositories/database';
import { JogoComMedia } from '../types';

export class JogoService {
  async getAllJogos(): Promise<JogoComMedia[]> {
    const result = await prisma.$queryRaw<JogoComMedia[]>`
      SELECT 
        j.id,
        j.nome,
        STRING_AGG(DISTINCT g.nome, ', ' ORDER BY g.nome) as genero,
        j.descricao,
        j.data_lancamento,
        j.valor::float as valor,
        j.id_desenvolvedora,
        d.nome as nome_desenvolvedora,
        COALESCE(ROUND(AVG(a.nota::numeric), 2), 0)::float as media_avaliacao,
        COUNT(DISTINCT a.id_usuario)::int as total_avaliacoes
      FROM jogo j
      LEFT JOIN jogo_genero jg ON j.id = jg.id_jogo
      LEFT JOIN genero g ON jg.id_genero = g.id
      LEFT JOIN avaliacao a ON j.id = a.id_jogo
      LEFT JOIN desenvolvedora d ON j.id_desenvolvedora = d.cnpj
      GROUP BY j.id, j.nome, j.descricao, j.data_lancamento, j.valor, j.id_desenvolvedora, d.nome
      ORDER BY j.nome
    `;
    return result;
  }

  async getJogoById(id: number): Promise<JogoComMedia | null> {
    const result = await prisma.$queryRaw<JogoComMedia[]>`
      SELECT 
        j.id,
        j.nome,
        STRING_AGG(DISTINCT g.nome, ', ' ORDER BY g.nome) as genero,
        j.descricao,
        j.data_lancamento,
        j.valor::float as valor,
        j.id_desenvolvedora,
        d.nome as nome_desenvolvedora,
        COALESCE(ROUND(AVG(a.nota::numeric), 2), 0)::float as media_avaliacao,
        COUNT(DISTINCT a.id_usuario)::int as total_avaliacoes
      FROM jogo j
      LEFT JOIN jogo_genero jg ON j.id = jg.id_jogo
      LEFT JOIN genero g ON jg.id_genero = g.id
      LEFT JOIN avaliacao a ON j.id = a.id_jogo
      LEFT JOIN desenvolvedora d ON j.id_desenvolvedora = d.cnpj
      WHERE j.id = ${id}
      GROUP BY j.id, j.nome, j.descricao, j.data_lancamento, j.valor, j.id_desenvolvedora, d.nome
    `;
    return result[0] || null;
  }

  async createJogo(data: any) {
    return prisma.jogo.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        data_lancamento: new Date(data.data_lancamento),
        valor: data.valor,
        id_desenvolvedora: data.id_desenvolvedora,
      },
      include: {
        desenvolvedora: true,
        generos: {
          include: {
            genero: true,
          },
        },
      },
    });
  }

  async updateJogo(id: number, data: any) {
    return prisma.jogo.update({
      where: { id },
      data: {
        nome: data.nome,
        descricao: data.descricao,
        data_lancamento: data.data_lancamento ? new Date(data.data_lancamento) : undefined,
        valor: data.valor,
        id_desenvolvedora: data.id_desenvolvedora,
      },
      include: {
        desenvolvedora: true,
        generos: {
          include: {
            genero: true,
          },
        },
      },
    });
  }

  async deleteJogo(id: number) {
    return prisma.jogo.delete({
      where: { id },
    });
  }

  async getAvaliacoes(jogoId: number) {
    return prisma.avaliacao.findMany({
      where: { id_jogo: jogoId },
      include: {
        usuario: {
          include: {
            pessoa: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
      orderBy: {
        data_publicacao: 'desc',
      },
    });
  }
}