const filtro = document.getElementById("filtro-unidade");
const fila = document.getElementById("fila");

const proximo = {
  "Recebido": { status: "Em preparo", texto: "Iniciar preparo", classe: "recebido" },
  "Em preparo": { status: "Pronto", texto: "Marcar como pronto", classe: "preparo" },
  "Pronto": { status: "Retirado", texto: "Confirmar retirada", classe: "pronto" }
};

unidades.forEach(function (u) {
  const opcao = document.createElement("option");
  opcao.value = u.id;
  opcao.textContent = u.nome + " - " + u.cidade;
  filtro.appendChild(opcao);
});

function formatarHora(iso) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function montarFila() {
  const unidadeId = Number(filtro.value);
  const emAndamento = lerStorage("pedidos", []).filter(function (p) {
    return p.unidadeId === unidadeId && proximo[p.status];
  });

  fila.innerHTML = "";
  document.getElementById("vazio").hidden = emAndamento.length > 0;

  emAndamento.forEach(function (p) {
    const etapa = proximo[p.status];
    const itens = p.itens.map(function (item) {
      const produto = produtos.find(function (prod) { return prod.id === item.id; });
      return "<li>" + item.qtd + "x " + produto.nome + "</li>";
    }).join("");

    const li = document.createElement("li");
    li.className = "pedido " + etapa.classe;
    li.innerHTML =
      "<h2>Pedido #" + p.codigo + " · " + p.status + "</h2>" +
      '<p class="detalhe">' + p.retirada + " · feito às " + formatarHora(p.historico[0].data) + "</p>" +
      "<ul>" + itens + "</ul>" +
      '<button class="botao" data-codigo="' + p.codigo + '">' + etapa.texto + "</button>";
    fila.appendChild(li);
  });
}

fila.addEventListener("click", function (e) {
  const codigo = Number(e.target.dataset.codigo);
  if (!codigo) {
    return;
  }
  const pedidos = lerStorage("pedidos", []);
  const pedido = pedidos.find(function (p) { return p.codigo === codigo; });
  const etapa = proximo[pedido.status];

  pedido.status = etapa.status;
  pedido.historico.push({ status: etapa.status, data: new Date().toISOString() });
  salvarStorage("pedidos", pedidos);
  montarFila();
});

filtro.addEventListener("change", montarFila);

montarFila();
setInterval(montarFila, 3000);
