import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const uploadDir = path.join(__dirname, '../../uploads');

// Garante que a pasta de uploads exista
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

class FileController {
    // Lista todos os arquivos na pasta de uploads
    static async listFiles(req: Request, res: Response) {
        try {
            const files = fs.readdirSync(uploadDir);
            res.json({ files });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar arquivos' });
        }
    }

    // Faz o upload de um arquivo
    static async uploadFile(req: Request, res: Response) {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado' });
        }
        res.json({ message: 'Upload realizado com sucesso', file: req.file.filename });
    }

    // Baixa um arquivo pelo nome
    static async getFile(req: Request, res: Response) {
        const { name } = req.params;
        const filePath = path.join(uploadDir, name);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Arquivo não encontrado' });
        }

        res.download(filePath);
    }

    // Exclui um arquivo
    static async deleteFile(req: Request, res: Response) {
        const { name } = req.params;
        const filePath = path.join(uploadDir, name);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Arquivo não encontrado' });
        }

        try {
            fs.unlinkSync(filePath);
            res.json({ message: 'Arquivo deletado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao excluir o arquivo' });
        }
    }
}

export default FileController;
