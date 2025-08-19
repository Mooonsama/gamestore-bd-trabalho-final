import { Response } from 'express';
import { JogoService } from '../services/jogoService';
import { AuthRequest } from '../middlewares/auth';
import { z } from 'zod';

const jogoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  genero: z.string().min(1, 'Gênero é obrigatório'),
  descricao: z.string().optional(),
  data_lancamento: z.string().refine((date) => !isNaN(Date.parse(date)), 'Data inválida'),
  valor: z.number().min(0, 'Valor deve ser positivo'),
  id_desenvolvedora: z.string().length(14, 'CNPJ deve ter 14 dígitos'),
});

export class JogoController {
  private jogoService = new JogoService();

  getAll = async (req: AuthRequest, res: Response) => {
    try {
      const jogos = await this.jogoService.getAllJogos();
      res.json(jogos);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  getById = async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const jogo = await this.jogoService.getJogoById(id);
      if (!jogo) {
        return res.status(404).json({ error: 'Jogo não encontrado' });
      }

      res.json(jogo);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  create = async (req: AuthRequest, res: Response) => {
    try {
      const data = jogoSchema.parse(req.body);
      const jogo = await this.jogoService.createJogo(data);
      res.status(201).json(jogo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      }
      res.status(500).json({ error: (error as Error).message });
    }
  };

  update = async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const data = jogoSchema.partial().parse(req.body);
      const jogo = await this.jogoService.updateJogo(id, data);
      res.json(jogo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      }
      res.status(500).json({ error: (error as Error).message });
    }
  };

  delete = async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      await this.jogoService.deleteJogo(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  getAvaliacoes = async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const avaliacoes = await this.jogoService.getAvaliacoes(id);
      res.json(avaliacoes);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };
}