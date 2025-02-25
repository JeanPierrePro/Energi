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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userModel_1 = require("../models/userModel");
const authController_1 = require("../controllers/authController"); // Importando loginUser
const router = (0, express_1.Router)();
// Rota para registrar usuário
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, phone, nif } = req.body;
        yield (0, userModel_1.createUser)({ email, name, phone, nif });
        return res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Erro ao registrar usuário',
            error: error instanceof Error ? error.message : 'Erro desconhecido',
        });
    }
}));
// Rota para login de usuário
router.post('/auth/login', authController_1.loginUser); // A rota de login agora está associada à função loginUser
// Rota para buscar usuário por e-mail
router.get('/getUser/:email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    try {
        const user = yield (0, userModel_1.getUserByEmail)(email);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({
            message: 'Erro ao buscar o usuário',
            error: error instanceof Error ? error.message : 'Erro desconhecido',
        });
    }
}));
exports.default = router;
