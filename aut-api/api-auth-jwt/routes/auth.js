// routes/auth.js
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registrar um novo usuário
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Verificar se o usuário já existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email já registrado' });
    }

    // Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Criar o novo usuário
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Salvar o usuário no banco de dados
    await newUser.save();
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Fazer login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Verificar a senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Criar e enviar o JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

module.exports = router;
