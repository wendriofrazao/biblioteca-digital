import { prisma } from "../configs/dbConnecting.js";
import { bookTree } from "../structures/redBlackTree/bookTree.js";

export class RedBlackTreeService {
  async carregarLivrosNaArvore() {
    const livros = await prisma.livro.findMany({
      include: {
        categoria: true,
        autores: {
          include: {
            autor: true,
          },
        },
      },
    });

    // Reconstrói a árvore para evitar inserções duplicadas.
    bookTree.clear();

    for (const livro of livros) {
      bookTree.insert(Number(livro.id), livro);
    }

    return livros.length;
  }

  getTreeService() {
    return bookTree.toJSON();
  }

  searchBookService(id) {
    const livro = bookTree.search(Number(id));

    if (!livro) {
      throw new Error("Livro não encontrado na árvore");
    }

    return livro;
  }

  getTreeStatsService() {
    const raiz = bookTree.getTree();

    if (!raiz) {
      return {
        quantidadeNos: 0,
        raiz: null,
        altura: 0,
      };
    }

    return {
      quantidadeNos: this.contarNos(raiz),
      raiz: raiz.key,
      altura: this.calcularAltura(raiz),
    };
  }

  contarNos(no) {
    if (!no) return 0;

    return 1 + this.contarNos(no.left) + this.contarNos(no.right);
  }

  calcularAltura(no) {
    if (!no) return 0;

    return (
      1 + Math.max(this.calcularAltura(no.left), this.calcularAltura(no.right))
    );
  }
}
