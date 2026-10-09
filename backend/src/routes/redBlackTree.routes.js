import { Router } from "express";
import { RedBlackTreeController } from "../controllers/redBlackTree.controller.js";
import { authMiddlewarer } from "../middlewares/auth.middleware.js";

export const redBlackTreeRouter = Router();

const redBlackTreeController = new RedBlackTreeController();

redBlackTreeRouter.get(
  "/",
  authMiddlewarer,
  redBlackTreeController.getTree.bind(redBlackTreeController),
);

redBlackTreeRouter.get(
  "/buscar/:id",
  authMiddlewarer,
  redBlackTreeController.searchBook.bind(redBlackTreeController),
);

redBlackTreeRouter.get(
  "/estatisticas",
  authMiddlewarer,
  redBlackTreeController.getTreeStats.bind(redBlackTreeController),
);
