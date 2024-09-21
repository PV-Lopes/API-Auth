require('dotenv').config(); // Para carregar as variáveis de ambiente do .env
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth'); // Importe suas rotas de autenticação
const bodyParser = require('body-parser');

const app = express();

// Middleware para analisar o body das requisições
app.use(bodyParser.json());

// Conecte-se ao banco de dados MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB conectado!'))
    .catch((error) => console.error('Erro ao conectar ao MongoDB:', error));

// Configuração das rotas
app.use('/api/auth', authRoutes); // Use as rotas de autenticação

// Iniciando o servidor na porta definida no arquivo .env ou na porta 3000 por padrão
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
