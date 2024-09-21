// routes/posts.js
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const User = require('../models/User');

// Middleware para verificar o token
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Acesso negado' });

  try {
    const verified = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Token inválido' });
  }
};

// Criar um novo post
router.post('/', authMiddleware, async (req, res) => {
  const { title, content } = req.body;

  try {
    const post = new Post({
      title,
      content,
      user: req.user.id,
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Obter todos os posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', ['username', 'email']);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

module.exports = router;
