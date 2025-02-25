"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.getFile = exports.uploadFile = exports.updateUserProfile = exports.loginUser = exports.registerUser = void 0;
const admin = __importStar(require("firebase-admin"));
const storageService_1 = require("../services/storageService");
// Inicialização do Firebase
if (!admin.apps.length) {
    admin.initializeApp();
}
else {
    admin.app();
}
const auth = admin.auth();
// **Controlador de Usuários**
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, phone, nif } = req.body;
        const existingUser = yield auth.getUserByEmail(email).catch(() => null);
        if (existingUser) {
            res.status(400).send({ message: 'Usuário já existe' });
            return;
        }
        const newUser = yield auth.createUser({
            email,
            password,
            displayName: username,
            phoneNumber: phone,
        });
        yield auth.setCustomUserClaims(newUser.uid, { nif });
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const userRecord = yield auth.getUserByEmail(email);
                if (userRecord) {
                    res.status(201).send({ message: 'Usuário registrado com sucesso!', user: userRecord });
                }
                else {
                    res.status(404).send({ message: 'Usuário não encontrado após registro' });
                }
            }
            catch (error) {
                console.error('Erro ao buscar usuário:', error);
                res.status(500).send({ message: 'Erro ao buscar usuário após registro' });
            }
        }), 2000);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Erro no registro de usuário:', error.message);
            res.status(500).send({ message: 'Erro no registro do usuário' });
        }
        else {
            console.error('Erro desconhecido no registro de usuário');
            res.status(500).send({ message: 'Erro desconhecido' });
        }
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        console.log('Tentando autenticar o usuário com e-mail:', email);
        const userRecord = yield auth.getUserByEmail(email).catch((error) => null);
        if (!userRecord) {
            console.log('Usuário não encontrado:', email);
            res.status(404).send({ message: 'Usuário não encontrado. Você precisa se registrar primeiro.' });
            return;
        }
        res.status(200).send({ message: 'Usuário autenticado com sucesso!', user: userRecord });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Erro ao logar o usuário:', error.message);
            res.status(500).send({ message: 'Erro ao autenticar o usuário' });
        }
        else {
            console.error('Erro desconhecido ao autenticar o usuário');
            res.status(500).send({ message: 'Erro desconhecido' });
        }
    }
});
exports.loginUser = loginUser;
const updateUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { username, email, phone, nif } = req.body;
        if (!username || !email || !phone || !nif) {
            res.status(400).send({ message: 'Todos os campos são obrigatórios' });
            return;
        }
        const updatedUser = yield auth.updateUser(userId, {
            displayName: username,
            email,
            phoneNumber: phone,
        });
        yield auth.setCustomUserClaims(userId, { nif });
        res.status(200).send({ message: 'Perfil atualizado com sucesso', user: updatedUser });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Erro ao atualizar perfil de usuário:', error.message);
            res.status(500).send({ message: 'Erro ao atualizar perfil' });
        }
        else {
            console.error('Erro desconhecido ao atualizar perfil de usuário');
            res.status(500).send({ message: 'Erro desconhecido' });
        }
    }
});
exports.updateUserProfile = updateUserProfile;
// **Controlador de Arquivos**
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Nenhum arquivo foi enviado.' });
        }
        const fileUrl = yield (0, storageService_1.uploadFileToStorage)(req.file);
        return res.status(200).json({ message: 'Arquivo enviado com sucesso!', fileUrl });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Erro ao fazer upload do arquivo:', error.message);
            const errorCode = error.code || 'Código de erro não disponível';
            console.error('Código do erro:', errorCode);
            return res.status(500).json({ message: 'Erro ao enviar o arquivo', errorCode });
        }
        else {
            console.error('Erro desconhecido ao fazer upload do arquivo');
            return res.status(500).json({ message: 'Erro desconhecido ao enviar o arquivo' });
        }
    }
});
exports.uploadFile = uploadFile;
const getFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileName } = req.params;
    try {
        const file = yield (0, storageService_1.getFileFromStorage)(fileName);
        return res.status(200).json({ message: 'Arquivo encontrado', file });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Erro ao obter o arquivo:', error.message);
            const errorCode = error.code || 'Código de erro não disponível';
            console.error('Código do erro:', errorCode);
            return res.status(500).json({ message: 'Erro ao obter o arquivo', errorCode });
        }
        else {
            console.error('Erro desconhecido ao obter o arquivo');
            return res.status(500).json({ message: 'Erro desconhecido ao obter o arquivo' });
        }
    }
});
exports.getFile = getFile;
const deleteFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileName } = req.params;
    try {
        yield (0, storageService_1.deleteFileFromStorage)(fileName);
        return res.status(200).json({ message: 'Arquivo excluído com sucesso!' });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Erro ao excluir o arquivo:', error.message);
            const errorCode = error.code || 'Código de erro não disponível';
            console.error('Código do erro:', errorCode);
            return res.status(500).json({ message: 'Erro ao excluir o arquivo', errorCode });
        }
        else {
            console.error('Erro desconhecido ao excluir o arquivo');
            return res.status(500).json({ message: 'Erro desconhecido ao excluir o arquivo' });
        }
    }
});
exports.deleteFile = deleteFile;
