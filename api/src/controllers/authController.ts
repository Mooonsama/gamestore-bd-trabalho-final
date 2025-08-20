import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

const registroSchema = z.object({
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve ter 11 dígitos'),
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
  data_nascimento: z.string(),
  rede_social: z.string().nullable().optional(),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export class AuthController {
  private authService = new AuthService();

  login = async (req: Request, res: Response) => {
    try {
      const data = loginSchema.parse(req.body);
      const result = await this.authService.login(data);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      }
      res.status(401).json({ error: (error as Error).message });
    }
  };

  registro = async (req: Request, res: Response) => {
    try {
      const data = registroSchema.parse(req.body);
      const result = await this.authService.registro(data);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      }
      res.status(400).json({ error: (error as Error).message });
    }
  };
}