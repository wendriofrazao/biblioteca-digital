import { BookService } from "../services/book.service.js";

const bookService = new BookService();

export class BookController {
  async createBook(req, res) {
    try {
      const {
        isbn,
        categoriaId,
        titulo,
        editora,
        anoPublicacao,
        quantidade,
        autores,
      } = req.body;

      const book = await bookService.createBookService({
        isbn,
        categoriaId,
        titulo,
        editora,
        anoPublicacao,
        quantidade,
        autores,
      });

      return res.status(201).json({
        message: "Livro criado com sucesso",
        livro: book,
      });
    } catch (error) {
      console.error("Erro no controller de livro:", error);

      if (error.message.includes("Já existe")) {
        return res.status(409).json({
          message: error.message,
        });
      }

      if (
        error.message.includes("obrigatório") ||
        error.message.includes("quantidade")
      ) {
        return res.status(400).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async getAllBooks(req, res) {
    try {
      const books = await bookService.getAllBooksService();

      return res.status(200).json(books);
    } catch (error) {
      console.error("Erro no controller de livro:", error);

      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async getBookById(req, res) {
    try {
      const { id } = req.params;

      const book = await bookService.getBookByIdService(Number(id));

      return res.status(200).json(book);
    } catch (error) {
      console.error("Erro no controller de livro:", error);

      if (error.message.includes("não encontrado")) {
        return res.status(404).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async updateBook(req, res) {
    try {
      const { id } = req.params;

      const {
        isbn,
        categoriaId,
        titulo,
        editora,
        anoPublicacao,
        quantidade,
        autores,
      } = req.body;

      const book = await bookService.updateBookService(Number(id), {
        isbn,
        categoriaId,
        titulo,
        editora,
        anoPublicacao,
        quantidade,
        autores,
      });

      return res.status(200).json({
        message: "Livro atualizado com sucesso",
        livro: book,
      });
    } catch (error) {
      console.error("Erro no controller de livro:", error);

      if (error.message.includes("não encontrado")) {
        return res.status(404).json({
          message: error.message,
        });
      }

      if (error.message.includes("Já existe")) {
        return res.status(409).json({
          message: error.message,
        });
      }

      if (
        error.message.includes("obrigatório") ||
        error.message.includes("quantidade")
      ) {
        return res.status(400).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async deleteBook(req, res) {
    try {
      const { id } = req.params;

      await bookService.deleteBookService(Number(id));

      return res.status(200).json({
        message: "Livro excluído com sucesso",
      });
    } catch (error) {
      console.error("Erro no controller de livro:", error);

      if (error.message.includes("não encontrado")) {
        return res.status(404).json({
          message: error.message,
        });
      }

      if (error.message.includes("empréstimos registrados")) {
        return res.status(409).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: error.message,
      });
    }
  }
}
