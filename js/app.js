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

atualizarContador();
