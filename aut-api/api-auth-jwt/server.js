// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware para interpretar JSON
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB conectado'))
.catch((err) => console.log(err));

// Importar Rotas
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

// Usar as rotas
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
