const usuario = usuarioLogado();

function mascararEmail(email) {
  const partes = email.split("@");
  if (partes.length < 2) {
    return email;
  }
  return partes[0].charAt(0) + "***@" + partes[1];
}

function preencher(idTabela, linhas, colunas) {
  const corpo = document.getElementById(idTabela);
  if (linhas.length === 0) {
    corpo.innerHTML = '<tr><td colspan="' + colunas + '">Sem dados ainda.</td></tr>';
    return;
  }
  corpo.innerHTML = linhas.map(function (l) {
    return "<tr><td>" + l.join("</td><td>") + "</td></tr>";
  }).join("");
}

function montarPainel() {
  const pedidos = lerStorage("pedidos", []);
  const vendas = pedidos.filter(function (p) {
    return p.pagamento && p.pagamento.status === "Aprovado";
  });
  const recusados = pedidos.filter(function (p) {
    return p.status === "Pagamento recusado";
  });

  const faturamento = vendas.reduce(function (soma, p) { return soma + p.total; }, 0);
  const descontos = vendas.reduce(function (soma, p) { return soma + p.desconto; }, 0);
  document.getElementById("faturamento").textContent = formatarPreco(faturamento);
  document.getElementById("descontos").textContent = formatarPreco(descontos);
  document.getElementById("recusados").textContent = recusados.length;

  const porUnidade = unidades.map(function (u) {
    const dela = vendas.filter(function (p) { return p.unidadeId === u.id; });
    const total = dela.reduce(function (soma, p) { return soma + p.total; }, 0);
    return [u.nome + " - " + u.cidade, dela.length, formatarPreco(total)];
  });
  preencher("tabela-unidades", porUnidade, 3);

  const quantidades = {};
  vendas.forEach(function (p) {
    p.itens.forEach(function (item) {
      quantidades[item.id] = (quantidades[item.id] || 0) + item.qtd;
    });
  });
  const ranking = Object.keys(quantidades)
    .sort(function (a, b) { return quantidades[b] - quantidades[a]; })
    .slice(0, 5)
    .map(function (id) { return [buscarProduto(Number(id)).nome, quantidades[id]]; });
  preencher("tabela-produtos", ranking, 2);

  const comDesconto = vendas.filter(function (p) { return p.desconto > 0; }).map(function (p) {
    const origem = [];
    if (p.cupom) {
      origem.push("Cupom " + p.cupom);
    }
    if (p.pontosUsados > 0) {
      origem.push(p.pontosUsados + " pontos");
    }
    return ["#" + p.codigo, formatarData(p.historico[0].data), mascararEmail(p.email),
      origem.join(" + "), formatarPreco(p.desconto)];
  });
  preencher("tabela-descontos", comDesconto, 5);
}

if (!usuario) {
  window.location.href = "login.html?voltar=gerente.html";
} else if (usuario.perfil !== "gerente") {
  document.getElementById("restrito").hidden = false;
} else {
  document.getElementById("painel").hidden = false;
  montarPainel();
}
