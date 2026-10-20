// controllers/book.controller.js

import { BookService } from "../services/book.service.js";

const bookService = new BookService();

function responderErro(res, error) {
  console.error("Erro no controller de livro:", error);

  if (error.code === "P2002" || error.message.includes("Já existe")) {
    return res.status(409).json({
      message: error.message.includes("Já existe")
        ? error.message
        : "Já existe um registro com esse valor único.",
    });
  }

  if (error.code === "P2003" || error.code === "P2014") {
    return res.status(400).json({
      message:
        "A categoria, o autor ou outro registro relacionado não existe ou não pode ser removido.",
    });
  }

  if (error.code === "P2025" || error.message.includes("não encontrado")) {
    return res.status(404).json({
      message: error.message.includes("não encontrado")
        ? error.message
        : "Registro não encontrado.",
    });
  }

  if (
    error.message.includes("obrigatório") ||
    error.message.includes("quantidade") ||
    error.message.includes("ISBN") ||
    error.message.includes("título") ||
    error.message.includes("categoria") ||
    error.message.includes("autor") ||
    error.message.includes("ano de publicação") ||
    error.message.includes("número inteiro") ||
    error.message.includes("lista de IDs")
  ) {
    return res.status(400).json({
      message: error.message,
    });
  }

  return res.status(500).json({
    message: "Erro interno ao processar a operação com livros.",
  });
}

export class BookController {
  async createBook(req, res) {
    try {
      const livro = await bookService.createBookService(req.body);

      return res.status(201).json({
        message: "Livro criado com sucesso",
        livro,
      });
    } catch (error) {
      return responderErro(res, error);
    }
  }

  async getAllBooks(req, res) {
    try {
      const livros = await bookService.getAllBooksService();

      return res.status(200).json(livros);
    } catch (error) {
      return responderErro(res, error);
    }
  }

  async getBookById(req, res) {
    try {
      const livro = await bookService.getBookByIdService(req.params.id);

      return res.status(200).json(livro);
    } catch (error) {
      return responderErro(res, error);
    }
  }

  async updateBook(req, res) {
    try {
      const livro = await bookService.updateBookService(
        req.params.id,
        req.body,
      );

      return res.status(200).json({
        message: "Livro atualizado com sucesso",
        livro,
      });
    } catch (error) {
      return responderErro(res, error);
    }
  }

  async deleteBook(req, res) {
    try {
      await bookService.deleteBookService(req.params.id);

      return res.status(200).json({
        message: "Livro excluído com sucesso",
      });
    } catch (error) {
      return responderErro(res, error);
    }
  }
}
