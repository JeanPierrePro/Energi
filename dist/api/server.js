"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// Configurar CORS corretamente
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === "production" ? "https://seu-dominio.com" : "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
// Middleware para pré-requisições (preflight requests)
app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(200);
});
// Middlewares para JSON e dados de formulário
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Exemplo de rota de registro
app.post("/api/register", (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: "Nome e email são obrigatórios!" });
    }
    res.json({ message: "Registro bem-sucedido!", user: { name, email } });
});
// Exportação para Vercel
exports.default = app;
