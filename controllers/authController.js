
authController.js
100%
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const repo = require('../dados/usuariosRepositorio');

function montarResposta(usuario) {
  const token = jwt.sign(
    { id: usuario.id, nome: usuario.nome },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
  return { token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } };
}

function texto(valor) {
  return typeof valor === 'string' ? valor.trim() : '';
}

async function registrar(req, res) {
  const nome = texto(req.body?.nome);
  const email = texto(req.body?.email).toLowerCase();
  const senha = typeof req.body?.senha === 'string' ? req.body.senha : '';

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Informe nome, e-mail e senha' });
  }
  if (!email.includes('@')) {
    return res.status(400).json({ erro: 'Informe um e-mail válido' });
  }
  if (senha.length < 6) {
    return res.status(400).json({ erro: 'A senha precisa ter pelo menos 6 caracteres' });
  }
  if (repo.buscarPorEmail(email)) {
    return res.status(409).json({ erro: 'Este e-mail já está cadastrado' });
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const usuario = repo.criar(nome, email, senhaHash);
  res.status(201).json(montarResposta(usuario));
}

async function login(req, res) {
  const email = texto(req.body?.email).toLowerCase();
  const senha = typeof req.body?.senha === 'string' ? req.body.senha : '';

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Informe e-mail e senha' });
  }

  const usuario = repo.buscarPorEmail(email);
  const confere = usuario ? await bcrypt.compare(senha, usuario.senha_hash) : false;

  if (!confere) {
    return res.status(401).json({ erro: 'E-mail ou senha incorretos' });
  }

  res.json(montarResposta(usuario));
}

module.exports = { registrar, login };
Exibindo authController.js…