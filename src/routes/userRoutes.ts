import { Router, Request, Response } from 'express';
import { createUser, getUserByEmail } from '../models/userModel';
import { loginUser } from '../controllers/authController';  // Importando loginUser

const router: Router = Router();

// Rota para registrar usuário
router.post('/register', async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, name, phone, nif } = req.body;
    await createUser({ email, name, phone, nif });
    return res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao registrar usuário',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
});

// Rota para login de usuário
router.post('/auth/login', loginUser);

// Rota para buscar usuário por e-mail
router.get('/getUser/:email', async (req: Request, res: Response): Promise<Response> => {
  const { email } = req.params;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao buscar o usuário',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
});

export default router;
