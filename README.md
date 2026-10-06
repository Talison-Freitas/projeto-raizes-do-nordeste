# Raízes do Nordeste - Front-end

Interface web da rede de lanchonetes Raízes do Nordeste, desenvolvida como trabalho da trilha de Front-end (Opção B: codificação).

- Repositório: https://github.com/Talison-Freitas/projeto-raizes-do-nordeste
- Publicação: https://talison-freitas.github.io/projeto-raizes-do-nordeste/

## Tecnologias

HTML, CSS e JavaScript puros, sem bibliotecas. Os dados (unidades, produtos, promoções e campanhas) são simulados no arquivo `js/dados.js`. Usuários, pedidos e pontos ficam no `localStorage` do navegador.

## Como executar

Basta abrir o `index.html` no navegador ou acessar o link da publicação. Não há instalação nem servidor.

## Páginas

| Página | Função |
|---|---|
| `index.html` | Escolha da unidade |
| `cardapio.html` | Cardápio da unidade, com filtro por categoria |
| `carrinho.html` | Carrinho, retirada, cupom e uso de pontos |
| `login.html` | Login e cadastro, com consentimentos da LGPD |
| `pagamento.html` | Pagamento simulado em serviço externo |
| `acompanhamento.html` | Lista de pedidos e acompanhamento do status |
| `fidelidade.html` | Pontos, promoções e campanhas |
| `privacidade.html` | Política de privacidade, consentimentos e exclusão da conta |
| `cozinha.html` | Painel da cozinha, que atualiza o status dos pedidos |

## Roteiro para testar

1. Em `index.html`, escolha uma unidade e adicione itens no cardápio.
2. No carrinho, aplique um cupom (`BEMVINDO10`, `SAOJOAO15` ou `CAFE5`) e finalize o pedido.
3. Crie uma conta, marcando ou não os consentimentos opcionais.
4. No pagamento, use a opção "Ambiente de demonstração" para ver os resultados aprovado, recusado e serviço indisponível.
5. Abra `cozinha.html` em outra aba e entre com a conta da cozinha (veja a seção abaixo). Selecione a mesma unidade e avance o status do pedido. A tela de acompanhamento do cliente se atualiza sozinha.
6. Em `fidelidade.html`, veja os pontos ganhos. Com 100 pontos, o desconto pode ser usado no carrinho.
7. Em `privacidade.html`, altere os consentimentos ou exclua a conta.

## Conta da cozinha

O painel da cozinha é restrito à equipe da loja. Para acessá-lo, entre em `login.html` com a conta de teste:

- E-mail: `cozinha@raizesdonordeste.com.br`
- Senha: `cozinha123`

Clientes comuns que tentam abrir `cozinha.html` veem uma mensagem de acesso restrito.

## Observações

- Não há back-end. Senhas e dados ficam no navegador apenas para simular o funcionamento.
- O pagamento é totalmente simulado, sem coleta de dados de cartão.
- A restrição do painel da cozinha é apenas visual, feita no navegador. Em um sistema real, essa verificação seria feita no back-end.
