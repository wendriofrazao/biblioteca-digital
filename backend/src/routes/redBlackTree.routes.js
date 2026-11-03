import { Router } from "express";

import { RedBlackTreeController } from "../controllers/redBlackTree.controller.js";
import { authMiddlewarer } from "../middlewares/auth.middleware.js";

export const redBlackTreeRouter = Router();

const redBlackTreeController = new RedBlackTreeController();

// Consultar árvore
redBlackTreeRouter.get(
  "/",
  authMiddlewarer,
  redBlackTreeController.getTree.bind(redBlackTreeController),
);

// Pesquisar livro
redBlackTreeRouter.get(
  "/buscar/:id",
  authMiddlewarer,
  redBlackTreeController.searchBook.bind(redBlackTreeController),
);

// Consultar estatísticas
redBlackTreeRouter.get(
  "/estatisticas",
  authMiddlewarer,
  redBlackTreeController.getTreeStats.bind(redBlackTreeController),
);

// Carregar livros do banco na árvore
redBlackTreeRouter.post(
  "/carregar",
  authMiddlewarer,
  redBlackTreeController.loadBooks.bind(redBlackTreeController),
);
