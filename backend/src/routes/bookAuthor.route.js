import { Router } from "express";
import { BookAuthorController } from "../controllers/bookAuthor.controller.js";
import { authMiddlewarer } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";

export const bookAuthorRouter = Router();

const bookAuthorController = new BookAuthorController();

const adminMiddleware = [authMiddlewarer, isAdmin];

// Associar autor a livro
bookAuthorRouter.post(
  "/",
  adminMiddleware,
  bookAuthorController.createBookAuthor.bind(bookAuthorController),
);

// Listar autores de um livro
bookAuthorRouter.get(
  "/livro/:livroId",
  authMiddlewarer,
  bookAuthorController.getAuthorsByBook.bind(bookAuthorController),
);

// Listar livros de um autor
bookAuthorRouter.get(
  "/autor/:autorId",
  authMiddlewarer,
  bookAuthorController.getBooksByAuthor.bind(bookAuthorController),
);

// Remover autor de um livro
bookAuthorRouter.delete(
  "/livro/:livroId/autor/:autorId",
  adminMiddleware,
  bookAuthorController.deleteBookAuthor.bind(bookAuthorController),
);
