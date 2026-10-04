const unidade = unidadeAtual();

if (!unidade) {
  window.location.href = "index.html";
}

document.getElementById("unidade-info").textContent = "Retirada em " + unidade.nome + " - " + unidade.cidade;

const listaItens = document.getElementById("itens");
const areaCarrinho = document.getElementById("area-carrinho");
const msgCupom = document.getElementById("msg-cupom");
let cupom = lerStorage("cupom", null);

function calcularSubtotal(carrinho) {
  let subtotal = 0;
  carrinho.forEach(function (item) {
    const produto = produtos.find(function (p) { return p.id === item.id; });
    subtotal += produto.preco * item.qtd;
  });
  return subtotal;
}

function calcularDesconto(subtotal) {
  if (!cupom) {
    return 0;
  }
  if (cupom.tipo === "percentual") {
    return subtotal * cupom.valor / 100;
  }
  return Math.min(cupom.valor, subtotal);
}

function montarCarrinho() {
  const carrinho = lerStorage("carrinho", []);
  listaItens.innerHTML = "";

  document.getElementById("vazio").hidden = carrinho.length > 0;
  areaCarrinho.hidden = carrinho.length === 0;

  carrinho.forEach(function (item) {
    const produto = produtos.find(function (p) { return p.id === item.id; });

    const li = document.createElement("li");
    li.className = "item";
    li.innerHTML =
      "<div>" +
      "<h3>" + produto.nome + "</h3>" +
      "<span>" + formatarPreco(produto.preco * item.qtd) + "</span>" +
      "</div>" +
      '<div class="quantidade">' +
      '<button data-acao="menos" data-id="' + item.id + '" aria-label="Diminuir">-</button>' +
      "<span>" + item.qtd + "</span>" +
      '<button data-acao="mais" data-id="' + item.id + '" aria-label="Aumentar">+</button>' +
      '<button class="remover" data-acao="remover" data-id="' + item.id + '">Remover</button>' +
      "</div>";
    listaItens.appendChild(li);
  });

  const subtotal = calcularSubtotal(carrinho);
  const desconto = calcularDesconto(subtotal);
  document.getElementById("subtotal").textContent = formatarPreco(subtotal);
  document.getElementById("desconto").textContent = "- " + formatarPreco(desconto);
  document.getElementById("total").textContent = formatarPreco(subtotal - desconto);
  atualizarContador();
}

listaItens.addEventListener("click", function (e) {
  const acao = e.target.dataset.acao;
  if (!acao) {
    return;
  }
  const id = Number(e.target.dataset.id);
  let carrinho = lerStorage("carrinho", []);
  const item = carrinho.find(function (i) { return i.id === id; });

  if (acao === "mais") {
    item.qtd++;
  } else if (acao === "menos") {
    item.qtd--;
  }
  if (acao === "remover" || item.qtd <= 0) {
    carrinho = carrinho.filter(function (i) { return i.id !== id; });
  }
  salvarStorage("carrinho", carrinho);
  montarCarrinho();
});

document.getElementById("form-cupom").addEventListener("submit", function (e) {
  e.preventDefault();
  const codigo = document.getElementById("codigo-cupom").value.trim().toUpperCase();
  const encontrado = promocoes.find(function (p) { return p.codigo === codigo; });

  if (!encontrado) {
    cupom = null;
    salvarStorage("cupom", null);
    msgCupom.textContent = "Cupom inválido ou expirado.";
    msgCupom.className = "mensagem erro";
  } else {
    cupom = encontrado;
    salvarStorage("cupom", cupom);
    msgCupom.textContent = "Cupom aplicado: " + cupom.descricao + ".";
    msgCupom.className = "mensagem ok";
  }
  montarCarrinho();
});

document.getElementById("finalizar").addEventListener("click", function (e) {
  const carrinho = lerStorage("carrinho", []);
  const subtotal = calcularSubtotal(carrinho);
  const desconto = calcularDesconto(subtotal);
  const retirada = document.querySelector('input[name="retirada"]:checked').value;

  salvarStorage("pedidoAtual", {
    unidadeId: unidade.id,
    itens: carrinho,
    subtotal: subtotal,
    desconto: desconto,
    total: subtotal - desconto,
    cupom: cupom ? cupom.codigo : null,
    retirada: retirada
  });

  if (!usuarioLogado()) {
    e.preventDefault();
    window.location.href = "login.html?voltar=pagamento.html";
  }
});

if (cupom) {
  document.getElementById("codigo-cupom").value = cupom.codigo;
  msgCupom.textContent = "Cupom aplicado: " + cupom.descricao + ".";
  msgCupom.className = "mensagem ok";
}

montarCarrinho();
