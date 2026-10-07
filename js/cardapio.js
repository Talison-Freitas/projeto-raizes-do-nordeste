const unidade = unidadeAtual();

if (!unidade) {
  window.location.href = "index.html";
}

const listaProdutos = document.getElementById("lista-produtos");
const navCategorias = document.getElementById("categorias");
let categoriaAtiva = "Todos";

document.getElementById("nome-unidade").textContent = unidade.nome;
document.getElementById("info-unidade").textContent =
  unidade.cidade + " · cozinha " + unidade.cozinha + " · " + unidade.horario;

const produtosDaUnidade = produtos.filter(function (p) {
  return p.unidades.includes(unidade.id);
});

function montarCategorias() {
  const nomes = ["Todos"];
  produtosDaUnidade.forEach(function (p) {
    if (!nomes.includes(p.categoria)) {
      nomes.push(p.categoria);
    }
  });

  navCategorias.innerHTML = "";
  nomes.forEach(function (nome) {
    const botao = document.createElement("button");
    botao.textContent = nome;
    botao.dataset.categoria = nome;
    if (nome === categoriaAtiva) {
      botao.className = "ativa";
    }
    navCategorias.appendChild(botao);
  });
}

function montarProdutos() {
  listaProdutos.innerHTML = "";
  produtosDaUnidade.forEach(function (p) {
    if (categoriaAtiva !== "Todos" && p.categoria !== categoriaAtiva) {
      return;
    }
    const item = document.createElement("li");
    item.className = "produto";
    const selo = p.sazonal ? ' <span class="selo">Junino</span>' : "";
    item.innerHTML =
      '<img src="' + p.imagem + '" alt="Foto de ' + p.nome + '" width="120" height="120" loading="lazy">' +
      "<div>" +
      "<h2>" + p.nome + selo + "</h2>" +
      "<p>" + p.descricao + "</p>" +
      '<span class="preco">' + formatarPreco(p.preco) + "</span>" +
      "</div>" +
      '<button class="botao" data-id="' + p.id + '">Adicionar</button>';
    listaProdutos.appendChild(item);
  });
}

navCategorias.addEventListener("click", function (e) {
  if (e.target.dataset.categoria) {
    categoriaAtiva = e.target.dataset.categoria;
    montarCategorias();
    montarProdutos();
  }
});

listaProdutos.addEventListener("click", function (e) {
  const id = e.target.dataset.id;
  if (id) {
    adicionarAoCarrinho(Number(id));
    e.target.textContent = "Adicionado";
    setTimeout(function () { e.target.textContent = "Adicionar"; }, 800);
  }
});

montarCategorias();
montarProdutos();
