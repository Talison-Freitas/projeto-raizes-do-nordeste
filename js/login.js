const formLogin = document.getElementById("form-login");
const formCadastro = document.getElementById("form-cadastro");
const abaLogin = document.getElementById("aba-login");
const abaCadastro = document.getElementById("aba-cadastro");
const msgLogin = document.getElementById("msg-login");
const msgCadastro = document.getElementById("msg-cadastro");

function mostrarAba(cadastro) {
  formLogin.hidden = cadastro;
  formCadastro.hidden = !cadastro;
  abaLogin.className = cadastro ? "" : "ativa";
  abaCadastro.className = cadastro ? "ativa" : "";
}

function destino() {
  const voltar = new URLSearchParams(window.location.search).get("voltar");
  if (voltar && /^[a-z]+\.html$/.test(voltar)) {
    return voltar;
  }
  return "index.html";
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

abaLogin.addEventListener("click", function () { mostrarAba(false); });
abaCadastro.addEventListener("click", function () { mostrarAba(true); });

formLogin.addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim().toLowerCase();
  const senha = document.getElementById("login-senha").value;

  const usuario = lerStorage("usuarios", []).find(function (u) {
    return u.email === email && u.senha === senha;
  });

  if (!usuario) {
    msgLogin.textContent = "E-mail ou senha incorretos.";
    return;
  }
  salvarStorage("usuarioLogado", usuario.email);
  window.location.href = destino();
});

formCadastro.addEventListener("submit", function (e) {
  e.preventDefault();
  const nome = document.getElementById("cad-nome").value.trim();
  const email = document.getElementById("cad-email").value.trim().toLowerCase();
  const nascimento = document.getElementById("cad-nascimento").value;
  const senha = document.getElementById("cad-senha").value;
  const usuarios = lerStorage("usuarios", []);

  if (nome.length < 3) {
    msgCadastro.textContent = "Informe seu nome completo.";
    return;
  }
  if (!emailValido(email)) {
    msgCadastro.textContent = "Informe um e-mail válido.";
    return;
  }
  if (!nascimento) {
    msgCadastro.textContent = "Informe sua data de nascimento.";
    return;
  }
  if (calcularIdade(nascimento) < 18) {
    msgCadastro.textContent = "Menores de 18 anos precisam do cadastro feito por um responsável.";
    return;
  }
  if (senha.length < 6) {
    msgCadastro.textContent = "A senha deve ter pelo menos 6 caracteres.";
    return;
  }
  if (!document.getElementById("cons-termos").checked) {
    msgCadastro.textContent = "Para criar a conta, é necessário aceitar a Política de Privacidade.";
    return;
  }
  if (usuarios.some(function (u) { return u.email === email; })) {
    msgCadastro.textContent = "Já existe uma conta com esse e-mail.";
    return;
  }

  usuarios.push({
    nome: nome,
    email: email,
    senha: senha,
    nascimento: nascimento,
    pontos: 0,
    perfil: "cliente",
    consentimentos: {
      termos: true,
      marketing: document.getElementById("cons-marketing").checked,
      perfil: document.getElementById("cons-perfil").checked,
      data: new Date().toISOString()
    }
  });
  salvarStorage("usuarios", usuarios);
  salvarStorage("usuarioLogado", email);
  window.location.href = destino();
});

if (new URLSearchParams(window.location.search).get("aba") === "cadastro") {
  mostrarAba(true);
}
