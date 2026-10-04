import { BookAuthorService } from "../services/bookAuthor.service.js";

const bookAuthorService = new BookAuthorService();

export class BookAuthorController {
  async createBookAuthor(req, res) {
    try {
      const association = await bookAuthorService.createBookAuthorService(
        req.body,
      );

      return res.status(201).json({
        message: "Autor associado ao livro com sucesso",
        data: association,
      });
    } catch (error) {
      console.error("Erro no controller livro-autor:", error);

      if (error.message.includes("já está associado")) {
        return res.status(409).json({
          message: error.message,
        });
      }

      if (
        error.message.includes("obrigatório") ||
        error.message.includes("inválido")
      ) {
        return res.status(400).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Erro interno do servidor",
      });
    }
  }

  async getAuthorsByBook(req, res) {
    try {
      const { livroId } = req.params;

      const authors = await bookAuthorService.getAuthorsByBookService(livroId);

      return res.status(200).json(authors);
    } catch (error) {
      console.error("Erro no controller livro-autor:", error);

      if (error.message.includes("inválido")) {
        return res.status(400).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Erro interno do servidor",
      });
    }
  }

  async getBooksByAuthor(req, res) {
    try {
      const { autorId } = req.params;

      const books = await bookAuthorService.getBooksByAuthorService(autorId);

      return res.status(200).json(books);
    } catch (error) {
      console.error("Erro no controller livro-autor:", error);

      if (error.message.includes("inválido")) {
        return res.status(400).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Erro interno do servidor",
      });
    }
  }

  async deleteBookAuthor(req, res) {
    try {
      const { livroId, autorId } = req.params;

      await bookAuthorService.deleteBookAuthorService(livroId, autorId);

      return res.status(200).json({
        message: "Autor removido do livro com sucesso",
      });
    } catch (error) {
      console.error("Erro no controller livro-autor:", error);

      if (error.message.includes("não existe")) {
        return res.status(404).json({
          message: error.message,
        });
      }

      if (error.message.includes("inválido")) {
        return res.status(400).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Erro interno do servidor",
      });
    }
  }
}
