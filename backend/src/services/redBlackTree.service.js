import { prisma } from "../configs/dbConnecting.js";
import { bookTree } from "../structures/redBlackTree/bookTree.js";

export class RedBlackTreeService {
  constructor() {
    this.loaded = false;
    this.loadingPromise = null;
  }

  // Carrega os livros reais do banco para a árvore
  async carregarLivrosNaArvore() {
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = (async () => {
      try {
        const livros = await prisma.livro.findMany({
          include: {
            categoria: true,
            autores: {
              include: {
                autor: true,
              },
            },
          },
          orderBy: {
            id: "asc",
          },
        });

        // Reconstrói a árvore sem duplicações
        bookTree.clear();

        for (const livro of livros) {
          bookTree.insert(Number(livro.id), livro);
        }

        this.loaded = true;

        return livros.length;
      } catch (error) {
        this.loaded = false;
        throw error;
      } finally {
        this.loadingPromise = null;
      }
    })();

    return this.loadingPromise;
  }

  // Garante que a árvore esteja carregada
  async garantirArvoreCarregada() {
    if (this.loaded) return;

    await this.carregarLivrosNaArvore();
  }

  // Retorna a estrutura da árvore
  getTreeService() {
    return bookTree.toJSON();
  }

  // Pesquisa um livro pelo ID
  searchBookService(id) {
    const livro = bookTree.search(Number(id));

    if (!livro) {
      throw new Error("Livro não encontrado na árvore");
    }

    return livro;
  }

  // Estatísticas da árvore
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

  // Conta os nós
  contarNos(no) {
    if (!no) return 0;

    return 1 + this.contarNos(no.left) + this.contarNos(no.right);
  }

  // Calcula a altura
  calcularAltura(no) {
    if (!no) return 0;

    return (
      1 + Math.max(this.calcularAltura(no.left), this.calcularAltura(no.right))
    );
  }
}
