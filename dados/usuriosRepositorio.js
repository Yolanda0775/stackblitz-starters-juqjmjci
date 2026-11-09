
const banco = require('./banco');

function iniciar() {
  banco.executar(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha_hash TEXT NOT NULL
    )
  `);
}

function buscarPorEmail(email) {
  return banco.consultar('SELECT * FROM usuarios WHERE email = ?', [email])[0];
}

function criar(nome, email, senhaHash) {
  const { ultimoId } = banco.executar(
    'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)',
    [nome, email, senhaHash]
  );
  return { id: ultimoId, nome, email };
}

module.exports = { iniciar, buscarPorEmail, criar };