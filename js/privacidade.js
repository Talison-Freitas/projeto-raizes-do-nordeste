const usuario = usuarioLogado();
const caixaCookies = document.getElementById("cookies-estatisticas");
const msgCookies = document.getElementById("msg-cookies");

function formatarData(iso) {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

const cookies = lerStorage("consentimentoCookies", null);
caixaCookies.checked = cookies ? cookies.estatisticas : false;

caixaCookies.addEventListener("change", function () {
  salvarStorage("consentimentoCookies", {
    essenciais: true,
    estatisticas: caixaCookies.checked,
    data: new Date().toISOString()
  });
  msgCookies.textContent = "Preferência salva.";
  const banner = document.querySelector(".banner-lgpd");
  if (banner) {
    banner.remove();
  }
});

if (!usuario) {
  document.getElementById("aviso-login").hidden = false;
} else {
  document.getElementById("area-conta").hidden = false;
  document.getElementById("dados-conta").textContent = usuario.nome + " (" + usuario.email + ")";
  document.getElementById("cons-marketing").checked = usuario.consentimentos.marketing;
  document.getElementById("cons-perfil").checked = usuario.consentimentos.perfil;
  document.getElementById("data-consentimento").textContent =
    "Última atualização: " + formatarData(usuario.consentimentos.data);
}

document.getElementById("salvar-consentimentos").addEventListener("click", function () {
  const usuarios = lerStorage("usuarios", []);
  const dono = usuarios.find(function (u) { return u.email === usuario.email; });
  dono.consentimentos.marketing = document.getElementById("cons-marketing").checked;
  dono.consentimentos.perfil = document.getElementById("cons-perfil").checked;
  dono.consentimentos.data = new Date().toISOString();
  salvarStorage("usuarios", usuarios);

  document.getElementById("data-consentimento").textContent =
    "Última atualização: " + formatarData(dono.consentimentos.data);
  document.getElementById("msg-consentimentos").textContent = "Autorizações salvas.";
});

document.getElementById("excluir").addEventListener("click", function () {
  document.getElementById("confirmar-exclusao").hidden = false;
  this.hidden = true;
});

document.getElementById("cancelar").addEventListener("click", function () {
  document.getElementById("confirmar-exclusao").hidden = true;
  document.getElementById("excluir").hidden = false;
});

document.getElementById("confirmar").addEventListener("click", function () {
  const usuarios = lerStorage("usuarios", []).filter(function (u) {
    return u.email !== usuario.email;
  });
  const pedidos = lerStorage("pedidos", []);
  pedidos.forEach(function (p) {
    if (p.email === usuario.email) {
      p.email = "anonimizado";
    }
  });

  salvarStorage("usuarios", usuarios);
  salvarStorage("pedidos", pedidos);
  salvarStorage("usuarioLogado", null);
  salvarStorage("carrinho", []);
  salvarStorage("cupom", null);
  salvarStorage("pedidoAtual", null);
  window.location.href = "index.html";
});
