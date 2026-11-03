export const CATALOG = [
  {
    id: 8,
    title: "Dom Casmurro",
    author: "Machado de Assis",
    year: 1899,
    genre: "Romance",
    pages: 256,
    synopsis:
      "Bentinho reconstrói a juventude com Capitu e a dúvida que o persegue: terá sido traído? Um dos maiores romances da literatura brasileira.",
  },
  {
    id: 12,
    title: "O Cortiço",
    author: "Aluísio Azevedo",
    year: 1890,
    genre: "Naturalismo",
    pages: 240,
    synopsis:
      "A vida numa habitação coletiva do Rio de Janeiro do século XIX, retratada com o olhar cru do naturalismo brasileiro.",
  },
  {
    id: 19,
    title: "Memórias Póstumas de Brás Cubas",
    author: "Machado de Assis",
    year: 1881,
    genre: "Romance",
    pages: 224,
    synopsis:
      "Um defunto autor narra a própria vida com ironia e desencanto, inaugurando a fase madura de Machado de Assis.",
  },
  {
    id: 27,
    title: "Grande Sertão: Veredas",
    author: "João Guimarães Rosa",
    year: 1956,
    genre: "Romance",
    pages: 608,
    synopsis:
      "Riobaldo conta as suas aventuras como jagunço no sertão mineiro, entre o amor por Diadorim e o pacto com o diabo.",
  },
  {
    id: 31,
    title: "Vidas Secas",
    author: "Graciliano Ramos",
    year: 1938,
    genre: "Romance",
    pages: 176,
    synopsis:
      "A saga de uma família de retirantes no sertão nordestino, escrita com a secura e a precisão que o título anuncia.",
  },
  {
    id: 38,
    title: "O Guarani",
    author: "José de Alencar",
    year: 1857,
    genre: "Romance indianista",
    pages: 376,
    synopsis:
      "O amor entre o índio Peri e a donzela Ceci, símbolo fundador do romance indianista brasileiro.",
  },
  {
    id: 41,
    title: "Capitães da Areia",
    author: "Jorge Amado",
    year: 1937,
    genre: "Romance",
    pages: 288,
    synopsis:
      "Um grupo de meninos de rua de Salvador vive de pequenos furtos e de uma amizade maior que a miséria.",
  },
  {
    id: 45,
    title: "A Hora da Estrela",
    author: "Clarice Lispector",
    year: 1977,
    genre: "Romance",
    pages: 96,
    synopsis:
      "Macabéa, datilógrafa alagoana no Rio de Janeiro, é narrada por Rodrigo S.M. no último romance de Clarice Lispector.",
  },
  {
    id: 50,
    title: "Iracema",
    author: "José de Alencar",
    year: 1865,
    genre: "Romance indianista",
    pages: 144,
    synopsis:
      "A índia Iracema e o português Martin vivem um amor trágico que simboliza o nascimento do povo cearense.",
  },
  {
    id: 60,
    title: "Auto da Barca do Inferno",
    author: "Gil Vicente",
    year: 1517,
    genre: "Teatro",
    pages: 112,
    synopsis:
      "Personagens de todas as classes sociais chegam ao julgamento final e tentam embarcar na barca do céu — ou do inferno.",
  },
];

// Índice para localizar livros pelo ID rapidamente.
const booksById = new Map(CATALOG.map((book) => [book.id, book]));

/**
 * Busca um livro pelo seu código.
 * Retorna undefined caso não exista.
 */
export function getBook(id) {
  return booksById.get(Number(id));
}

/**
 * Valores utilizados na construção inicial da árvore.
 */
export const EXAMPLE_VALUES = CATALOG.map((book) => book.id);
