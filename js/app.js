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
