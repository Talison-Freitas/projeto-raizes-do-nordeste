const lista = document.getElementById("lista-unidades");

unidades.forEach(function (u) {
  const item = document.createElement("li");
  item.className = "unidade";
  item.innerHTML =
    "<h2>" + u.nome + "</h2>" +
    "<p>" + u.cidade + " · " + u.horario + " · cozinha " + u.cozinha + "</p>" +
    '<a class="botao" href="cardapio.html" data-id="' + u.id + '">Ver cardápio</a>';
  lista.appendChild(item);
});

lista.addEventListener("click", function (e) {
  const link = e.target.closest("a[data-id]");
  if (link) {
    escolherUnidade(Number(link.dataset.id));
  }
});
