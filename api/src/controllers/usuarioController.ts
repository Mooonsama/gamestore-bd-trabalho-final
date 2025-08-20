import { Response } from 'express';
import { UsuarioService } from '../services/usuarioService';
import { AuthRequest } from '../middlewares/auth';
import { z } from 'zod';

const compraSchema = z.object({
  id_jogo: z.number().int().positive('ID do jogo deve ser positivo'),
  valor_pago: z.number().min(0, 'Valor deve ser positivo'),
});

const avaliacaoSchema = z.object({
  nota: z.number().int().min(0).max(10, 'Nota deve estar entre 0 e 10'),
  texto: z.string().optional(),
});

const cartaoSchema = z.object({
  numero: z.string().regex(/^\d{16}$/, 'Número deve ter 16 dígitos'),
  bandeira: z.enum(['VISA', 'MASTERCARD', 'ELO', 'AMERICAN_EXPRESS']),
  validade_mes: z.number().int().min(1).max(12),
  validade_ano: z.number().int().min(new Date().getFullYear()),
  codigo_seguranca: z.string().regex(/^\d{3,4}$/, 'Código deve ter 3 ou 4 dígitos'),
});

export class UsuarioController {
  private usuarioService = new UsuarioService();

  createCompra = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.params.id;
      const data = compraSchema.parse(req.body);
      
      // Verificar se o usuário pode fazer compra para si mesmo ou se é admin
      if (req.user?.cpf !== userId && req.user?.tipo !== 'administrador') {
        return res.status(403).json({ error: 'Não autorizado' });
      }

      const compra = await this.usuarioService.createCompra(userId, data);
      res.status(201).json(compra);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      }
      res.status(400).json({ error: (error as Error).message });
    }
  };

  getCompras = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.params.id;
      
      // Verificar se o usuário pode ver suas próprias compras ou se é admin
      if (req.user?.cpf !== userId && req.user?.tipo !== 'administrador') {
        return res.status(403).json({ error: 'Não autorizado' });
      }

      const compras = await this.usuarioService.getCompras(userId);
      res.json(compras);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  createAvaliacao = async (req: AuthRequest, res: Response) => {
    try {
      const jogoId = parseInt(req.params.id);
      const userId = req.user?.cpf;

      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      if (isNaN(jogoId)) {
        return res.status(400).json({ error: 'ID do jogo inválido' });
      }

      const data = avaliacaoSchema.parse(req.body);
      const avaliacao = await this.usuarioService.createAvaliacao(userId, jogoId, data);
      res.status(201).json(avaliacao);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      }
      res.status(400).json({ error: (error as Error).message });
    }
  };

  createCartao = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.params.id;
      
      // Verificar se o usuário pode criar cartão para si mesmo ou se é admin
      if (req.user?.cpf !== userId && req.user?.tipo !== 'administrador') {
        return res.status(403).json({ error: 'Não autorizado' });
      }

      const data = cartaoSchema.parse(req.body);
      const cartao = await this.usuarioService.createCartao(userId, data);
      res.status(201).json(cartao);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      }
      res.status(400).json({ error: (error as Error).message });
    }
  };

  getCartoes = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.params.id;
      
      // Verificar se o usuário pode ver seus próprios cartões ou se é admin
      if (req.user?.cpf !== userId && req.user?.tipo !== 'administrador') {
        return res.status(403).json({ error: 'Não autorizado' });
      }

      const cartoes = await this.usuarioService.getCartoes(userId);
      res.json(cartoes);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  checkCompra = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.params.id;
      const jogoId = parseInt(req.params.jogoId);
      
      if (req.user?.cpf !== userId && req.user?.tipo !== 'administrador') {
        return res.status(403).json({ error: 'Não autorizado' });
      }

      const jaComprou = await this.usuarioService.checkCompra(userId, jogoId);
      res.json({ jaComprou });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };
}