import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

// Verificar se o Firebase já foi inicializado
if (!admin.apps.length) {
    admin.initializeApp();
} else {
    admin.app(); // Se já inicializado, usa a instância existente
}

const auth = admin.auth();

// Função para criar o usuário no Firebase Authentication
const createUser = async (email: string, password: string) => {
    try {
        const userRecord = await auth.createUser({
            email: email,
            password: password,
        });

        console.log('Usuário criado com sucesso:', userRecord);
    } catch (error) {
        console.log('Erro ao criar usuário:', error);
    }
};

// Função de registro de usuário
export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username, email, password, phone, nif } = req.body;

        // Verificar se o e-mail já está em uso
        const existingUser = await auth.getUserByEmail(email).catch(() => null);
        if (existingUser) {
            res.status(400).send({ message: 'Usuário já existe' });
            return;
        }

        // Criar o novo usuário
        const newUser = await auth.createUser({
            email,
            password,  // Defina uma senha segura ao registrar
            displayName: username,
            phoneNumber: phone,
        });

        // Adicionar customClaims após a criação do usuário
        await auth.setCustomUserClaims(newUser.uid, { nif });

        res.status(201).send({ message: 'Usuário registrado com sucesso!', user: newUser });

    } catch (error: unknown) {
        console.error('Erro no registro de usuário:', error instanceof Error ? error.message : 'Erro desconhecido');
        res.status(500).send({ message: 'Erro no registro do usuário' });
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        console.log('Tentando autenticar o usuário com e-mail:', email);

        // Verificar se o usuário existe no Firebase Authentication
        const userRecord = await auth.getUserByEmail(email).catch((error) => null);

        if (!userRecord) {
            console.log('Usuário não encontrado:', email);
            // Caso o usuário não seja encontrado, cria automaticamente
            await createUser(email, password);

            res.status(200).send({ message: 'Usuário criado e autenticado com sucesso!' });
            return;
        }

        // Aqui você pode continuar com a lógica de login, como verificar a senha, etc.
        res.status(200).send({ message: 'Usuário autenticado com sucesso!', user: userRecord });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Erro ao logar o usuário:', error.message);
            res.status(500).send({ message: 'Erro ao autenticar o usuário' });
        } else {
            console.error('Erro desconhecido ao autenticar o usuário');
            res.status(500).send({ message: 'Erro desconhecido' });
        }
    }
};
