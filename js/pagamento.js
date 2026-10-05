const usuario = usuarioLogado();
const pedidoAtual = lerStorage("pedidoAtual", null);
const etapas = ["form", "aguardando", "aprovado", "recusado", "indisponivel"];
let metodoEscolhido = "Pix";

if (!usuario) {
  window.location.href = "login.html?voltar=pagamento.html";
} else if (!pedidoAtual) {
  window.location.href = "carrinho.html";
}

function mostrarEtapa(nome) {
  etapas.forEach(function (e) {
    document.getElementById("etapa-" + e).hidden = e !== nome;
  });
}

function montarResumo() {
  const unidade = unidades.find(function (u) { return u.id === pedidoAtual.unidadeId; });
  document.getElementById("info-pedido").textContent =
    unidade.nome + " - " + unidade.cidade + " · " + pedidoAtual.retirada;

  const lista = document.getElementById("resumo-itens");
  pedidoAtual.itens.forEach(function (item) {
    const produto = produtos.find(function (p) { return p.id === item.id; });
    const li = document.createElement("li");
    li.innerHTML = "<span>" + item.qtd + "x " + produto.nome + "</span><span>" +
      formatarPreco(produto.preco * item.qtd) + "</span>";
    lista.appendChild(li);
  });

  document.getElementById("resumo-desconto").textContent = "- " + formatarPreco(pedidoAtual.desconto);
  document.getElementById("resumo-total").textContent = formatarPreco(pedidoAtual.total);
}

function registrarStatus(pedido, status) {
  pedido.status = status;
  pedido.historico.push({ status: status, data: new Date().toISOString() });
}

function registrarPedido(metodo) {
  const pedidos = lerStorage("pedidos", []);
  let pedido = pedidos.find(function (p) { return p.codigo === pedidoAtual.codigo; });

  if (!pedido) {
    pedido = {
      codigo: 1001 + pedidos.length,
      email: usuario.email,
      unidadeId: pedidoAtual.unidadeId,
      itens: pedidoAtual.itens,
      subtotal: pedidoAtual.subtotal,
      desconto: pedidoAtual.desconto,
      total: pedidoAtual.total,
      cupom: pedidoAtual.cupom,
      retirada: pedidoAtual.retirada,
      pontosUsados: pedidoAtual.pontosUsados,
      historico: [],
      pagamento: null
    };
    registrarStatus(pedido, "Aguardando pagamento");
    pedidos.push(pedido);
    pedidoAtual.codigo = pedido.codigo;
    salvarStorage("pedidoAtual", pedidoAtual);
  }

  pedido.pagamento = { metodo: metodo, status: "Em análise", transacao: null };
  salvarStorage("pedidos", pedidos);
  return pedido.codigo;
}

function salvarResultado(codigo, resultado) {
  const pedidos = lerStorage("pedidos", []);
  const pedido = pedidos.find(function (p) { return p.codigo === codigo; });

  if (resultado === "aprovado") {
    pedido.pagamento.status = "Aprovado";
    pedido.pagamento.transacao = "TX" + Date.now();
    pedido.pontosGanhos = Math.floor(pedido.total * regraFidelidade.pontosPorReal);
    registrarStatus(pedido, "Recebido");
  } else if (resultado === "recusado") {
    pedido.pagamento.status = "Recusado";
    registrarStatus(pedido, "Pagamento recusado");
  } else {
    pedido.pagamento.status = "Sem resposta";
    registrarStatus(pedido, "Aguardando pagamento");
  }
  salvarStorage("pedidos", pedidos);
  return pedido;
}

function sortearResultado() {
  const escolha = document.getElementById("simulacao").value;
  if (escolha !== "aleatorio") {
    return escolha;
  }
  const n = Math.random();
  if (n < 0.7) {
    return "aprovado";
  }
  return n < 0.9 ? "recusado" : "indisponivel";
}

function creditarPontos(pontos) {
  const usuarios = lerStorage("usuarios", []);
  const dono = usuarios.find(function (u) { return u.email === usuario.email; });
  dono.pontos += pontos;
  salvarStorage("usuarios", usuarios);
}

function concluirAprovado(pedido) {
  document.getElementById("codigo-pedido").textContent = "#" + pedido.codigo;
  document.getElementById("pontos-ganhos").textContent =
    "Você ganhou " + pedido.pontosGanhos + " pontos no programa de fidelidade.";
  document.getElementById("link-acompanhar").href = "acompanhamento.html?codigo=" + pedido.codigo;

  creditarPontos(pedido.pontosGanhos - pedido.pontosUsados);
  salvarStorage("carrinho", []);
  salvarStorage("cupom", null);
  salvarStorage("pedidoAtual", null);
  atualizarContador();
  mostrarEtapa("aprovado");
}

function pagar() {
  const codigo = registrarPedido(metodoEscolhido);
  mostrarEtapa("aguardando");

  setTimeout(function () {
    const resultado = sortearResultado();
    const pedido = salvarResultado(codigo, resultado);
    if (resultado === "aprovado") {
      concluirAprovado(pedido);
    } else {
      mostrarEtapa(resultado);
    }
  }, 2500);
}

document.getElementById("form-pagamento").addEventListener("submit", function (e) {
  e.preventDefault();
  metodoEscolhido = document.querySelector('input[name="metodo"]:checked').value;
  pagar();
});

document.getElementById("tentar-recusado").addEventListener("click", pagar);
document.getElementById("tentar-indisponivel").addEventListener("click", pagar);
document.getElementById("outro-metodo").addEventListener("click", function () {
  mostrarEtapa("form");
});

if (usuario && pedidoAtual) {
  montarResumo();
}
