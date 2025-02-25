import express from "express";
import cors from "cors";

const app = express();

// Configurar CORS corretamente
app.use(cors({
  origin: process.env.NODE_ENV === "production" ? "http://localhost:3000" : "*", 
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

// Dados fictícios para simulação (substitua com seu banco de dados)
const users = [
  { email: "joao@exemplo.com", password: "senha123", name: "João" }
];

// Exemplo de rota de registro
app.post("/api/register", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Nome e email são obrigatórios!" });
  }
  res.json({ message: "Registro bem-sucedido!", user: { name, email } });
});

// Rota de login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  
  // Verifica se o email e a senha foram enviados
  if (!email || !password) {
    return res.status(400).json({ error: "E-mail e senha são obrigatórios!" });
  }

  // Verifica se o usuário existe
  const user = users.find(user => user.email === email);
  
  // Se o usuário não existir, retorna um erro
  if (!user) {
    return res.status(400).json({ error: "Usuário não encontrado!" });
  }

  // Verifica se a senha está correta (simulação simples)
  if (user.password !== password) {
    return res.status(400).json({ error: "Senha incorreta!" });
  }

  // Se tudo estiver correto, retorna um sucesso
  return res.json({ message: "Login bem-sucedido!", user: { name: user.name, email: user.email } });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
