"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uploadDir = path_1.default.join(__dirname, '../../uploads');
// Garante que a pasta de uploads exista
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
class FileController {
    // Lista todos os arquivos na pasta de uploads
    static listFiles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = fs_1.default.readdirSync(uploadDir);
                res.json({ files });
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao listar arquivos' });
            }
        });
    }
    // Faz o upload de um arquivo
    static uploadFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.file) {
                return res.status(400).json({ error: 'Nenhum arquivo enviado' });
            }
            res.json({ message: 'Upload realizado com sucesso', file: req.file.filename });
        });
    }
    // Baixa um arquivo pelo nome
    static getFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.params;
            const filePath = path_1.default.join(uploadDir, name);
            if (!fs_1.default.existsSync(filePath)) {
                return res.status(404).json({ error: 'Arquivo não encontrado' });
            }
            res.download(filePath);
        });
    }
    // Exclui um arquivo
    static deleteFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.params;
            const filePath = path_1.default.join(uploadDir, name);
            if (!fs_1.default.existsSync(filePath)) {
                return res.status(404).json({ error: 'Arquivo não encontrado' });
            }
            try {
                fs_1.default.unlinkSync(filePath);
                res.json({ message: 'Arquivo deletado com sucesso' });
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao excluir o arquivo' });
            }
        });
    }
}
exports.default = FileController;
