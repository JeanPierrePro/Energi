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
exports.loginUser = exports.registerUser = void 0;
const admin = __importStar(require("firebase-admin"));
// Verificar se o Firebase já foi inicializado
if (!admin.apps.length) {
    admin.initializeApp();
}
else {
    admin.app(); // Se já inicializado, usa a instância existente
}
const auth = admin.auth();
// Função para criar o usuário no Firebase Authentication
const createUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRecord = yield auth.createUser({
            email: email,
            password: password,
        });
        console.log('Usuário criado com sucesso:', userRecord);
    }
    catch (error) {
        console.log('Erro ao criar usuário:', error);
    }
});
// Função de registro de usuário
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, phone, nif } = req.body;
        // Verificar se o e-mail já está em uso
        const existingUser = yield auth.getUserByEmail(email).catch(() => null);
        if (existingUser) {
            res.status(400).send({ message: 'Usuário já existe' });
            return;
        }
        // Criar o novo usuário
        const newUser = yield auth.createUser({
            email,
            password, // Defina uma senha segura ao registrar
            displayName: username,
            phoneNumber: phone,
        });
        // Adicionar customClaims após a criação do usuário
        yield auth.setCustomUserClaims(newUser.uid, { nif });
        res.status(201).send({ message: 'Usuário registrado com sucesso!', user: newUser });
    }
    catch (error) {
        console.error('Erro no registro de usuário:', error instanceof Error ? error.message : 'Erro desconhecido');
        res.status(500).send({ message: 'Erro no registro do usuário' });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        console.log('Tentando autenticar o usuário com e-mail:', email);
        // Verificar se o usuário existe no Firebase Authentication
        const userRecord = yield auth.getUserByEmail(email).catch((error) => null);
        if (!userRecord) {
            console.log('Usuário não encontrado:', email);
            // Caso o usuário não seja encontrado, cria automaticamente
            yield createUser(email, password);
            res.status(200).send({ message: 'Usuário criado e autenticado com sucesso!' });
            return;
        }
        // Aqui você pode continuar com a lógica de login, como verificar a senha, etc.
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
