import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { JogoController } from '../controllers/jogoController';
import { UsuarioController } from '../controllers/usuarioController';
import { authenticateToken, requireAdmin, requirePermission } from '../middlewares/auth';

const router = Router();

// Controllers
const authController = new AuthController();
const jogoController = new JogoController();
const usuarioController = new UsuarioController();

// Rotas de autenticação
router.post('/auth/login', authController.login);
router.post('/auth/registro', authController.registro);

// Rotas de jogos
router.get('/jogos', jogoController.getAll);
router.get('/jogos/:id', jogoController.getById);
router.post('/jogos', authenticateToken, requirePermission('gerenciar_jogos'), jogoController.create);
router.put('/jogos/:id', authenticateToken, requirePermission('gerenciar_jogos'), jogoController.update);
router.delete('/jogos/:id', authenticateToken, requirePermission('gerenciar_jogos'), jogoController.delete);

// Rotas de avaliações
router.get('/jogos/:id/avaliacoes', jogoController.getAvaliacoes);
router.post('/jogos/:id/avaliacoes', authenticateToken, usuarioController.createAvaliacao);

// Rotas de usuários
router.post('/usuarios/:id/compras', authenticateToken, usuarioController.createCompra);
router.get('/usuarios/:id/compras', authenticateToken, usuarioController.getCompras);
router.get('/usuarios/:id/compras/:jogoId', authenticateToken, usuarioController.checkCompra);
router.post('/usuarios/:id/cartoes', authenticateToken, usuarioController.createCartao);
router.get('/usuarios/:id/cartoes', authenticateToken, usuarioController.getCartoes);

// Rota de health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default router;