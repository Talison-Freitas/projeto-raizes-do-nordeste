const usuario = usuarioLogado();

if (!usuario) {
  window.location.href = "login.html?voltar=conta.html";
} else {
  const partes = usuario.nascimento.split("-");
  document.getElementById("conta-nome").textContent = usuario.nome;
  document.getElementById("conta-email").textContent = usuario.email;
  document.getElementById("conta-nascimento").textContent = partes[2] + "/" + partes[1] + "/" + partes[0];
  document.getElementById("conta-pontos").textContent = usuario.pontos + " pontos";
  document.getElementById("sair-conta").addEventListener("click", sair);
}
