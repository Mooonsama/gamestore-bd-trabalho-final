import { prisma } from '../repositories/database';
import { JogoComMedia } from '../types';

export class JogoService {
  async getAllJogos(): Promise<JogoComMedia[]> {
    const result = await prisma.$queryRaw<JogoComMedia[]>`
      SELECT 
        j.id,
        j.nome,
        j.genero,
        j.descricao,
        j.data_lancamento,
        j.valor::float as valor,
        j.id_desenvolvedora,
        d.nome as nome_desenvolvedora,
        COALESCE(ROUND(AVG(a.nota::numeric), 2), 0)::float as media_avaliacao,
        COUNT(a.nota)::int as total_avaliacoes
      FROM jogo j
      LEFT JOIN avaliacao a ON j.id = a.id_jogo
      LEFT JOIN desenvolvedora d ON j.id_desenvolvedora = d.cnpj
      GROUP BY j.id, j.nome, j.genero, j.descricao, j.data_lancamento, j.valor, j.id_desenvolvedora, d.nome
      ORDER BY j.nome
    `;
    return result;
  }

  async getJogoById(id: number): Promise<JogoComMedia | null> {
    const result = await prisma.$queryRaw<JogoComMedia[]>`
      SELECT 
        j.id,
        j.nome,
        j.genero,
        j.descricao,
        j.data_lancamento,
        j.valor::float as valor,
        j.id_desenvolvedora,
        d.nome as nome_desenvolvedora,
        COALESCE(ROUND(AVG(a.nota::numeric), 2), 0)::float as media_avaliacao,
        COUNT(a.nota)::int as total_avaliacoes
      FROM jogo j
      LEFT JOIN avaliacao a ON j.id = a.id_jogo
      LEFT JOIN desenvolvedora d ON j.id_desenvolvedora = d.cnpj
      WHERE j.id = ${id}
      GROUP BY j.id, j.nome, j.genero, j.descricao, j.data_lancamento, j.valor, j.id_desenvolvedora, d.nome
    `;
    return result[0] || null;
  }

  async createJogo(data: any) {
    return prisma.jogo.create({
      data: {
        nome: data.nome,
        genero: data.genero,
        descricao: data.descricao,
        data_lancamento: new Date(data.data_lancamento),
        valor: data.valor,
        id_desenvolvedora: data.id_desenvolvedora,
      },
      include: {
        desenvolvedora: true,
      },
    });
  }

  async updateJogo(id: number, data: any) {
    return prisma.jogo.update({
      where: { id },
      data: {
        nome: data.nome,
        genero: data.genero,
        descricao: data.descricao,
        data_lancamento: data.data_lancamento ? new Date(data.data_lancamento) : undefined,
        valor: data.valor,
        id_desenvolvedora: data.id_desenvolvedora,
      },
      include: {
        desenvolvedora: true,
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