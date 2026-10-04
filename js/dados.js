const unidades = [
  { id: 1, nome: "Boa Viagem", cidade: "Recife - PE", cozinha: "completa", horario: "06h às 22h" },
  { id: 2, nome: "Pelourinho", cidade: "Salvador - BA", cozinha: "completa", horario: "07h às 21h" },
  { id: 3, nome: "Meireles", cidade: "Fortaleza - CE", cozinha: "reduzida", horario: "06h às 20h" },
  { id: 4, nome: "Centro", cidade: "Caruaru - PE", cozinha: "reduzida", horario: "06h às 19h" }
];

const produtos = [
  { id: 1, nome: "Tapioca de queijo coalho", descricao: "Goma de tapioca recheada com queijo coalho derretido.", preco: 9.5, categoria: "Tapiocas", unidades: [1, 2, 3, 4] },
  { id: 2, nome: "Tapioca de carne de sol", descricao: "Carne de sol desfiada com manteiga de garrafa.", preco: 14, categoria: "Tapiocas", unidades: [1, 2, 3] },
  { id: 3, nome: "Tapioca de coco", descricao: "Coco ralado e leite condensado.", preco: 8, categoria: "Tapiocas", unidades: [1, 2, 3, 4] },
  { id: 4, nome: "Cuscuz com ovo", descricao: "Cuscuz de milho com ovo mexido e manteiga.", preco: 11, categoria: "Cuscuz", unidades: [1, 2, 3, 4] },
  { id: 5, nome: "Cuscuz recheado de frango", descricao: "Cuscuz recheado com frango desfiado e requeijão.", preco: 16.5, categoria: "Cuscuz", unidades: [1, 2] },
  { id: 6, nome: "Cuscuz com charque", descricao: "Cuscuz com charque desfiado e queijo.", preco: 17, categoria: "Cuscuz", unidades: [1, 2, 4] },
  { id: 7, nome: "Bolo de macaxeira", descricao: "Fatia de bolo de macaxeira com coco.", preco: 7, categoria: "Doces", unidades: [1, 2, 3, 4] },
  { id: 8, nome: "Bolo de rolo", descricao: "Fatia de bolo de rolo com goiabada.", preco: 8.5, categoria: "Doces", unidades: [1, 4] },
  { id: 9, nome: "Canjica", descricao: "Canjica cremosa com canela. Edição junina.", preco: 9, categoria: "Doces", unidades: [1, 2, 3, 4], sazonal: true },
  { id: 10, nome: "Pamonha", descricao: "Pamonha de milho verde. Edição junina.", preco: 10, categoria: "Doces", unidades: [1, 4], sazonal: true },
  { id: 11, nome: "Suco de cajá", descricao: "Copo de 400 ml.", preco: 7.5, categoria: "Bebidas", unidades: [1, 2, 3, 4] },
  { id: 12, nome: "Suco de umbu", descricao: "Copo de 400 ml.", preco: 7.5, categoria: "Bebidas", unidades: [1, 2, 3] },
  { id: 13, nome: "Café coado", descricao: "Café passado na hora, 200 ml.", preco: 5, categoria: "Bebidas", unidades: [1, 2, 3, 4] },
  { id: 14, nome: "Café da manhã completo", descricao: "Cuscuz, ovo, tapioca, café e suco.", preco: 29.9, categoria: "Combos", unidades: [1, 2] }
];
