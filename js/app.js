function lerStorage(chave, padrao) {
  const valor = localStorage.getItem(chave);
  return valor ? JSON.parse(valor) : padrao;
}

function salvarStorage(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function unidadeAtual() {
  const id = lerStorage("unidadeId", null);
  return unidades.find(function (u) { return u.id === id; });
}

function escolherUnidade(id) {
  const anterior = lerStorage("unidadeId", null);
  if (anterior !== id) {
    salvarStorage("carrinho", []);
  }
  salvarStorage("unidadeId", id);
}

function adicionarAoCarrinho(produtoId) {
  const carrinho = lerStorage("carrinho", []);
  const item = carrinho.find(function (i) { return i.id === produtoId; });
  if (item) {
    item.qtd++;
  } else {
    carrinho.push({ id: produtoId, qtd: 1 });
  }
  salvarStorage("carrinho", carrinho);
  atualizarContador();
}

function totalItensCarrinho() {
  return lerStorage("carrinho", []).reduce(function (soma, i) { return soma + i.qtd; }, 0);
}

function atualizarContador() {
  const contador = document.getElementById("contador");
  if (contador) {
    contador.textContent = totalItensCarrinho();
  }
}

function usuarioLogado() {
  const email = lerStorage("usuarioLogado", null);
  if (!email) {
    return null;
  }
  return lerStorage("usuarios", []).find(function (u) { return u.email === email; });
}

function sair() {
  salvarStorage("usuarioLogado", null);
  window.location.href = "index.html";
}

function montarAreaUsuario() {
  const topo = document.querySelector(".topo");
  if (!topo || document.getElementById("form-login")) {
    return;
  }
  const usuario = usuarioLogado();
  const area = document.createElement("div");
  area.className = "area-usuario";

  if (usuario) {
    area.innerHTML =
      '<a href="acompanhamento.html">Meus pedidos</a> · <span>Olá, ' + usuario.nome.split(" ")[0] +
      '</span> <button class="sair" type="button">Sair</button>';
    area.querySelector("button").addEventListener("click", sair);
  } else {
    area.innerHTML = '<a href="login.html">Entrar</a>';
  }
  topo.appendChild(area);
}

function mostrarBannerLgpd() {
  if (lerStorage("consentimentoCookies", null)) {
    return;
  }
  const banner = document.createElement("section");
  banner.className = "banner-lgpd";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-label", "Aviso de privacidade");
  banner.innerHTML =
    "<p>Usamos o armazenamento do seu navegador para guardar o carrinho e a sessão (essencial). " +
    "Com a sua permissão, também medimos o uso do site para melhorá-lo. " +
    '<a href="privacidade.html">Política de Privacidade</a>.</p>' +
    '<div class="botoes-lgpd">' +
    '<button type="button" data-valor="essenciais">Apenas essenciais</button>' +
    '<button type="button" data-valor="todos" class="aceitar">Aceitar todos</button>' +
    "</div>";

  banner.addEventListener("click", function (e) {
    const valor = e.target.dataset.valor;
    if (valor) {
      salvarStorage("consentimentoCookies", {
        essenciais: true,
        estatisticas: valor === "todos",
        data: new Date().toISOString()
      });
      banner.remove();
    }
  });
  document.body.appendChild(banner);
}

atualizarContador();
montarAreaUsuario();
mostrarBannerLgpd();
