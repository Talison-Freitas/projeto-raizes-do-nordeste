const usuario = usuarioLogado();
const conteudo = document.getElementById("conteudo");
const codigoUrl = Number(new URLSearchParams(window.location.search).get("codigo"));
const etapasPedido = ["Recebido", "Em preparo", "Pronto", "Retirado"];

const mensagens = {
  "Aguardando pagamento": "Seu pedido ainda não foi pago. Ele só vai para a cozinha depois da confirmação do pagamento.",
  "Pagamento recusado": "O pagamento deste pedido foi recusado. Faça um novo pedido para tentar de novo.",
  "Recebido": "A loja recebeu seu pedido e logo ele vai para a cozinha.",
  "Em preparo": "A cozinha está preparando seu pedido.",
  "Pronto": "Seu pedido está pronto. Retire no local informando a senha abaixo.",
  "Retirado": "Pedido retirado. Obrigado e volte sempre!",
  "Cancelado": "Este pedido foi cancelado."
};

if (!usuario) {
  window.location.href = "login.html?voltar=acompanhamento.html";
}

function pedidoComAlerta(status) {
  return status === "Pagamento recusado" || status === "Cancelado" || status === "Aguardando pagamento";
}

function nomeUnidade(id) {
  return buscarUnidade(id).nome;
}

function meusPedidos() {
  return lerStorage("pedidos", []).filter(function (p) { return p.email === usuario.email; });
}

function montarLista() {
  const pedidos = meusPedidos().reverse();
  let html = "<h1>Meus pedidos</h1>";

  if (pedidos.length === 0) {
    html += '<p class="vazio">Você ainda não fez nenhum pedido. <a href="index.html">Ver cardápio</a></p>';
  } else {
    html += '<ul class="lista-pedidos">';
    pedidos.forEach(function (p) {
      const classe = pedidoComAlerta(p.status) ? "situacao alerta" : "situacao";
      html +=
        "<li><div>" +
        "<h2>Pedido #" + p.codigo + "</h2>" +
        "<p>" + nomeUnidade(p.unidadeId) + " · " + formatarData(p.historico[0].data) + "</p>" +
        "<p>" + formatarPreco(p.total) + "</p>" +
        '<span class="' + classe + '">' + p.status + "</span>" +
        "</div>" +
        '<a class="botao" href="acompanhamento.html?codigo=' + p.codigo + '">Acompanhar</a></li>';
    });
    html += "</ul>";
  }
  conteudo.innerHTML = html;
}

function montarLinhaTempo(pedido) {
  const posicao = etapasPedido.indexOf(pedido.status);
  if (posicao === -1) {
    return "";
  }
  let html = '<ol class="linha-tempo">';
  etapasPedido.forEach(function (etapa, i) {
    const registro = pedido.historico.find(function (h) { return h.status === etapa; });
    let classe = "";
    if (i < posicao) {
      classe = "feito";
    } else if (i === posicao) {
      classe = "atual";
    }
    html += '<li class="' + classe + '">' + etapa;
    if (registro) {
      html += "<small>" + formatarData(registro.data) + "</small>";
    }
    html += "</li>";
  });
  return html + "</ol>";
}

function montarDetalhe(pedido) {
  const alerta = pedidoComAlerta(pedido.status) ? " alerta" : "";
  let html =
    '<a class="voltar" href="acompanhamento.html">&larr; Meus pedidos</a>' +
    "<h1>Pedido #" + pedido.codigo + "</h1>" +
    '<p class="detalhe-info">' + nomeUnidade(pedido.unidadeId) + " · " + pedido.retirada + "</p>" +
    '<p class="mensagem-status' + alerta + '" role="status">' + mensagens[pedido.status] + "</p>";

  html += montarLinhaTempo(pedido);

  if (pedido.status === "Pronto") {
    html += '<p>Senha de retirada: <span class="senha-retirada">' + pedido.codigo + "</span></p>";
  }

  html += "<h2>Itens</h2>" + '<ul class="itens-pedido">';
  pedido.itens.forEach(function (item) {
    const produto = buscarProduto(item.id);
    html += "<li><span>" + item.qtd + "x " + produto.nome + "</span><span>" +
      formatarPreco(produto.preco * item.qtd) + "</span></li>";
  });
  html += "</ul>" +
    '<p class="detalhe-total"><span>Total</span><span>' + formatarPreco(pedido.total) + "</span></p>";

  if (pedido.pagamento) {
    html += '<p class="detalhe-info">Pagamento: ' + pedido.pagamento.metodo + " · " + pedido.pagamento.status + "</p>";
  }
  conteudo.innerHTML = html;
}

function montar() {
  if (!codigoUrl) {
    montarLista();
    return;
  }
  const pedido = meusPedidos().find(function (p) { return p.codigo === codigoUrl; });
  if (!pedido) {
    conteudo.innerHTML = '<h1>Pedido não encontrado</h1><p><a href="acompanhamento.html">Ver meus pedidos</a></p>';
    return;
  }
  montarDetalhe(pedido);
}

if (usuario) {
  montar();
  if (codigoUrl) {
    setInterval(montar, 3000);
  }
}
