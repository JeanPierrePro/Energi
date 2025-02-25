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
exports.updateUser = exports.getUserByEmail = exports.createUser = void 0;
const firebase_1 = require("../config/firebase");
// Função para criar um novo usuário
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRef = firebase_1.db.collection('users').doc(userData.email); // Usando o e-mail como identificador único
        yield userRef.set({
            email: userData.email,
            name: userData.name,
            phone: userData.phone,
            nif: userData.nif
        });
        console.log('Usuário criado com sucesso!');
    }
    catch (error) {
        console.error('Erro ao salvar usuário:', error);
        throw error;
    }
});
exports.createUser = createUser;
// Função para buscar usuário por e-mail
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRef = firebase_1.db.collection('users').doc(email);
        const userDoc = yield userRef.get();
        if (userDoc.exists) {
            return userDoc.data();
        }
        else {
            console.log('Usuário não encontrado!');
            return null;
        }
    }
    catch (error) {
        console.error('Erro ao buscar o usuário:', error);
        throw error;
    }
});
exports.getUserByEmail = getUserByEmail;
// Função para atualizar usuário
const updateUser = (userId, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRef = firebase_1.db.collection('users').doc(userId);
        yield userRef.update(updatedData); // Atualiza os dados do usuário
        const updatedUserDoc = yield userRef.get();
        return updatedUserDoc.data();
    }
    catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        throw error;
    }
});
exports.updateUser = updateUser;
