const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const CAMINHO = path.join(__dirname, 'loja.db');
let db;

async function abrir() {
  const SQL = await initSqlJs();
  db = fs.existsSync(CAMINHO)
    ? new SQL.Database(fs.readFileSync(CAMINHO))
    : new SQL.Database();
}

function salvarArquivo() {
  fs.writeFileSync(CAMINHO, Buffer.from(db.export()));
}

function consultar(sql, params = []) {
  const comando = db.prepare(sql);
  comando.bind(params);
  const linhas = [];
  while (comando.step()) {
    linhas.push(comando.getAsObject());
  }
  comando.free();
  return linhas;
}

// Executa INSERT/UPDATE/DELETE e salva o arquivo.
// O id e a contagem são lidos ANTES de salvar, porque db.export() reabre o banco.
function executar(sql, params = []) {
  db.run(sql, params);
  const alteradas = db.getRowsModified();
  const [{ id }] = consultar('SELECT last_insert_rowid() AS id');
  salvarArquivo();
  return { alteradas, ultimoId: id };
}

module.exports = { abrir, consultar, executar };