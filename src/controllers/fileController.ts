import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import { uploadFileToStorage, getFileFromStorage, deleteFileFromStorage } from '../services/storageService';



// Inicialização do Firebase
if (!admin.apps.length) {
    admin.initializeApp();
} else {
    admin.app();
}

const auth = admin.auth();

// **Controlador de Usuários**

export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username, email, password, phone, nif } = req.body;

        const existingUser = await auth.getUserByEmail(email).catch(() => null);
        if (existingUser) {
            res.status(400).send({ message: 'Usuário já existe' });
            return;
        }

        const newUser = await auth.createUser({
            email,
            password,
            displayName: username,
            phoneNumber: phone,
        });

        await auth.setCustomUserClaims(newUser.uid, { nif });

        setTimeout(async () => {
            try {
                const userRecord = await auth.getUserByEmail(email);
                if (userRecord) {
                    res.status(201).send({ message: 'Usuário registrado com sucesso!', user: userRecord });
                } else {
                    res.status(404).send({ message: 'Usuário não encontrado após registro' });
                }
            } catch (error) {
                console.error('Erro ao buscar usuário:', error);
                res.status(500).send({ message: 'Erro ao buscar usuário após registro' });
            }
        }, 2000);

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Erro no registro de usuário:', error.message);
            res.status(500).send({ message: 'Erro no registro do usuário' });
        } else {
            console.error('Erro desconhecido no registro de usuário');
            res.status(500).send({ message: 'Erro desconhecido' });
        }
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        console.log('Tentando autenticar o usuário com e-mail:', email);

        const userRecord = await auth.getUserByEmail(email).catch((error) => null);

        if (!userRecord) {
            console.log('Usuário não encontrado:', email);
            res.status(404).send({ message: 'Usuário não encontrado. Você precisa se registrar primeiro.' });
            return;
        }

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

export const updateUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req.params;
        const { username, email, phone, nif } = req.body;

        if (!username || !email || !phone || !nif) {
            res.status(400).send({ message: 'Todos os campos são obrigatórios' });
            return;
        }

        const updatedUser = await auth.updateUser(userId, {
            displayName: username,
            email,
            phoneNumber: phone,
        });

        await auth.setCustomUserClaims(userId, { nif });

        res.status(200).send({ message: 'Perfil atualizado com sucesso', user: updatedUser });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Erro ao atualizar perfil de usuário:', error.message);
            res.status(500).send({ message: 'Erro ao atualizar perfil' });
        } else {
            console.error('Erro desconhecido ao atualizar perfil de usuário');
            res.status(500).send({ message: 'Erro desconhecido' });
        }
    }
};

// **Controlador de Arquivos**

export const uploadFile = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Nenhum arquivo foi enviado.' });
        }

        const fileUrl = await uploadFileToStorage(req.file);
        return res.status(200).json({ message: 'Arquivo enviado com sucesso!', fileUrl });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Erro ao fazer upload do arquivo:', error.message);

            const errorCode = (error as any).code || 'Código de erro não disponível';
            console.error('Código do erro:', errorCode);

            return res.status(500).json({ message: 'Erro ao enviar o arquivo', errorCode });
        } else {
            console.error('Erro desconhecido ao fazer upload do arquivo');
            return res.status(500).json({ message: 'Erro desconhecido ao enviar o arquivo' });
        }
    }
};

export const getFile = async (req: Request, res: Response): Promise<Response> => {
    const { fileName } = req.params;

    try {
        const file = await getFileFromStorage(fileName);
        return res.status(200).json({ message: 'Arquivo encontrado', file });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Erro ao obter o arquivo:', error.message);

            const errorCode = (error as any).code || 'Código de erro não disponível';
            console.error('Código do erro:', errorCode);

            return res.status(500).json({ message: 'Erro ao obter o arquivo', errorCode });
        } else {
            console.error('Erro desconhecido ao obter o arquivo');
            return res.status(500).json({ message: 'Erro desconhecido ao obter o arquivo' });
        }
    }
};

export const deleteFile = async (req: Request, res: Response): Promise<Response> => {
    const { fileName } = req.params;

    try {
        await deleteFileFromStorage(fileName);
        return res.status(200).json({ message: 'Arquivo excluído com sucesso!' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Erro ao excluir o arquivo:', error.message);

            const errorCode = (error as any).code || 'Código de erro não disponível';
            console.error('Código do erro:', errorCode);

            return res.status(500).json({ message: 'Erro ao excluir o arquivo', errorCode });
        } else {
            console.error('Erro desconhecido ao excluir o arquivo');
            return res.status(500).json({ message: 'Erro desconhecido ao excluir o arquivo' });
        }
    }
};
