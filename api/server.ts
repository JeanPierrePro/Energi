import express from "express";
import cors from "cors";

const app = express();

// Configurar CORS corretamente
app.use(cors({
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Exemplo de rota de registro
app.post("/api/register", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Nome e email são obrigatórios!" });
  }
  res.json({ message: "Registro bem-sucedido!", user: { name, email } });
});

// Porta do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT} (${process.env.NODE_ENV || "desenvolvimento"})`);
});
