import { RedBlackTreeService } from "../services/redBlackTree.service.js";

const redBlackTreeService = new RedBlackTreeService();

export class RedBlackTreeController {
  // GET /tree
  // Retorna a estrutura completa da árvore
  async getTree(req, res) {
    try {
      const tree = redBlackTreeService.getTreeService();

      return res.status(200).json({
        success: true,
        message: "Árvore Rubro-Negra consultada com sucesso.",
        data: tree,
      });
    } catch (error) {
      console.error("Erro ao buscar árvore:", error);

      return res.status(500).json({
        success: false,
        message: "Erro ao buscar Árvore Rubro-Negra.",
      });
    }
  }

  // GET /tree/buscar/:id
  // Pesquisa um livro pelo ID
  async searchBook(req, res) {
    try {
      const { id } = req.params;

      if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({
          success: false,
          message: "Informe um ID de livro válido.",
        });
      }

      const book = redBlackTreeService.searchBookService(id);

      return res.status(200).json({
        success: true,
        message: "Livro encontrado na Árvore Rubro-Negra.",
        data: book,
      });
    } catch (error) {
      console.error("Erro ao buscar livro na árvore:", error);

      if (error.message === "Livro não encontrado na árvore") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Erro ao pesquisar livro na árvore.",
      });
    }
  }

  // GET /tree/estatisticas
  // Retorna as estatísticas da árvore
  async getTreeStats(req, res) {
    try {
      const stats = redBlackTreeService.getTreeStatsService();

      return res.status(200).json({
        success: true,
        message: "Estatísticas consultadas com sucesso.",
        data: stats,
      });
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);

      return res.status(500).json({
        success: false,
        message: "Erro ao buscar estatísticas da árvore.",
      });
    }
  }

  // POST /tree/carregar
  // Carrega os livros existentes no banco para a árvore
  async loadBooks(req, res) {
    try {
      const quantidade = await redBlackTreeService.carregarLivrosNaArvore();

      return res.status(200).json({
        success: true,
        message: "Livros carregados na Árvore Rubro-Negra.",
        data: {
          quantidade,
        },
      });
    } catch (error) {
      console.error("Erro ao carregar livros na árvore:", error);

      return res.status(500).json({
        success: false,
        message: "Erro ao carregar livros na árvore.",
      });
    }
  }
}
