const usuario = usuarioLogado();

if (!usuario) {
  window.location.href = "login.html?voltar=fidelidade.html";
}

function montarCampanhas(lista, destino) {
  destino.innerHTML = "";
  lista.forEach(function (c) {
    const li = document.createElement("li");
    li.innerHTML = "<h3>" + c.titulo + "</h3><p>" + c.descricao + "</p>";
    destino.appendChild(li);
  });
}

if (usuario) {
  document.getElementById("saldo").textContent = usuario.pontos;

  const gerais = campanhas.filter(function (c) { return !c.segmentada; });
  montarCampanhas(gerais, document.getElementById("campanhas-gerais"));

  const aviso = document.getElementById("aviso-perfil");
  if (!usuario.consentimentos.perfil) {
    aviso.innerHTML =
      "Você não autorizou o uso do seu perfil, por isso não mostramos ofertas personalizadas. " +
      'Você pode mudar isso a qualquer momento em <a href="privacidade.html">Privacidade</a>.';
  } else {
    const idade = calcularIdade(usuario.nascimento);
    const doPerfil = campanhas.filter(function (c) {
      return c.segmentada && idade >= c.idadeMin && idade <= c.idadeMax;
    });
    aviso.textContent = "Ofertas escolhidas com base na sua idade, conforme sua autorização.";
    montarCampanhas(doPerfil, document.getElementById("campanhas-perfil"));
  }
}
