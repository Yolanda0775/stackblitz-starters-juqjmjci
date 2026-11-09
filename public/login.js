const formulario = document.getElementById('form-login');
const campoNome = document.getElementById('campo-nome-login');
const campoEmail = document.getElementById('campo-email-login');
const campoSenha = document.getElementById('campo-senha-login');
const titulo = document.getElementById('titulo-login');
const subtitulo = document.getElementById('subtitulo-login');
const botao = document.getElementById('botao-login');
const mensagem = document.getElementById('mensagem-login');
const textoTroca = document.getElementById('texto-troca-login');
const linkTroca = document.getElementById('link-troca-login');

let modoCadastro = false;

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = tipo;
}

function trocarModo() {
  modoCadastro = !modoCadastro;

  campoNome.hidden = !modoCadastro;
  campoNome.required = modoCadastro;
  campoSenha.autocomplete = modoCadastro ? 'new-password' : 'current-password';

  titulo.textContent = modoCadastro ? 'Criar conta' : 'Entrar';
  subtitulo.textContent = modoCadastro
    ? 'Cadastre-se para gerenciar os produtos'
    : 'Acesse sua conta para gerenciar os produtos';
  botao.textContent = modoCadastro ? 'Criar conta' : 'Entrar';
  textoTroca.textContent = modoCadastro ? 'Já tem conta?' : 'Não tem conta?';
  linkTroca.textContent = modoCadastro ? 'Entrar' : 'Criar conta';
  mostrarMensagem('', '');
}

async function enviar(evento) {
  evento.preventDefault();

  const dados = { email: campoEmail.value.trim(), senha: campoSenha.value };
  if (modoCadastro) dados.nome = campoNome.value.trim();
  const caminho = modoCadastro ? '/auth/registrar' : '/auth/login';

  try {
    const resposta = await fetch(caminho, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    const corpo = await resposta.json();

    if (!resposta.ok) {
      mostrarMensagem(corpo.erro, 'erro');
      return;
    }

    localStorage.setItem('token', corpo.token);
    localStorage.setItem('usuario', JSON.stringify(corpo.usuario));
    window.location.href = 'index.html';
  } catch {
    mostrarMensagem('Erro de conexão com o servidor.', 'erro');
  }
}

formulario.addEventListener('submit', enviar);
linkTroca.addEventListener('click', trocarModo);
linkTroca.addEventListener('keydown', evento => {
  if (evento.key === 'Enter') trocarModo();
});