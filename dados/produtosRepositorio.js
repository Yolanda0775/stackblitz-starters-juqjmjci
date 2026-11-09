const banco = require('./banco');

function iniciar() {
  banco.executar(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      preco REAL NOT NULL
    )
  `);

  const [{ total }] = banco.consultar('SELECT COUNT(*) AS total FROM produtos');
  if (total === 0) {
    banco.executar('INSERT INTO produtos (nome, preco) VALUES (?, ?)', ['Camiseta', 49.9]);
    banco.executar('INSERT INTO produtos (nome, preco) VALUES (?, ?)', ['Calça', 129.9]);
    banco.executar('INSERT INTO produtos (nome, preco) VALUES (?, ?)', ['Tênis', 299.9]);
  }
}

function listar() {
  return banco.consultar('SELECT * FROM produtos');
}

function buscarPorId(id) {
  return banco.consultar('SELECT * FROM produtos WHERE id = ?', [id])[0];
}

function criar(nome, preco) {
  const { ultimoId } = banco.executar('INSERT INTO produtos (nome, preco) VALUES (?, ?)', [nome, preco]);
  return buscarPorId(ultimoId);
}

function atualizar(id, nome, preco) {
  banco.executar('UPDATE produtos SET nome = ?, preco = ? WHERE id = ?', [nome, preco, id]);
  return buscarPorId(id);
}

function remover(id) {
  const { alteradas } = banco.executar('DELETE FROM produtos WHERE id = ?', [id]);
  return alteradas > 0;
}

module.exports = { iniciar, listar, buscarPorId, criar, atualizar, remover };