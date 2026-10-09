import { RedBlackTreeService } from "../services/redBlackTree.service.js";

const redBlackTreeService = new RedBlackTreeService();

export class RedBlackTreeController {
  getTree(req, res) {
    try {
      const tree = redBlackTreeService.getTreeService();

      return res.status(200).json({
        message: "Árvore Rubro-Negra consultada com sucesso",
        data: tree,
      });
    } catch (error) {
      console.error("Erro ao buscar árvore:", error);

      return res.status(500).json({
        message: "Erro ao buscar árvore",
      });
    }
  }

  searchBook(req, res) {
    try {
      const { id } = req.params;

      const book = redBlackTreeService.searchBookService(id);

      return res.status(200).json({
        message: "Livro encontrado na árvore",
        data: book,
      });
    } catch (error) {
      console.error("Erro ao buscar livro na árvore:", error);

      if (error.message === "Livro não encontrado na árvore") {
        return res.status(404).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Erro ao buscar livro na árvore",
      });
    }
  }

  getTreeStats(req, res) {
    try {
      const stats = redBlackTreeService.getTreeStatsService();

      return res.status(200).json(stats);
    } catch (error) {
      console.error("Erro ao buscar estatísticas da árvore:", error);

      return res.status(500).json({
        message: "Erro ao buscar estatísticas da árvore",
      });
    }
  }
}
