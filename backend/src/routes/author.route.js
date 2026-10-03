import { Router } from "express";
import { AuthorController } from "../controllers/author.controller.js";
import { authMiddlewarer } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";

export const authorRouter = Router();

const authorController = new AuthorController();

const adminMiddleware = [authMiddlewarer, isAdmin];

authorRouter.post(
  "/",
  adminMiddleware,
  authorController.createAuthor.bind(authorController),
);

authorRouter.get("/", authMiddlewarer, authorController.getAllAuthors.bind(authorController));

authorRouter.get("/:id", authMiddlewarer, authorController.getAuthorById.bind(authorController));

authorRouter.put(
  "/:id",
  adminMiddleware,
  authorController.updateAuthor.bind(authorController),
);

authorRouter.delete(
  "/:id",
  adminMiddleware,
  authorController.deleteAuthor.bind(authorController),
);
