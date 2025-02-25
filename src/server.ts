import express from "express";
import cors from "cors";

const app = express();

// Configurar CORS corretamente
app.use(cors({
  origin: "*", // Para testar localmente, mas no deploy troque por seu domínio real
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

app.use(express.json());

// Exemplo de rota de registro
app.post("/api/register", (req, res) => {
  res.json({ message: "Registro bem-sucedido!" });
});

// Porta do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
