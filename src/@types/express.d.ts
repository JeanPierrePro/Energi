import { UserRecord } from 'firebase-admin/auth';

declare global {
  namespace Express {
    interface Request {
      user?: UserRecord; // ou qualquer tipo que você esteja usando para o usuário
    }
  }
}
