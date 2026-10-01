import { Router } from "express";
import { BookController } from "../controllers/book.controller.js";
import { authMiddlewarer } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";

export const bookRouter = Router();

const bookController = new BookController();

const adminMiddleware = [authMiddlewarer, isAdmin];

bookRouter.post(
  "/",
  adminMiddleware,
  bookController.createBook.bind(bookController),
);

bookRouter.get("/", bookController.getAllBooks.bind(bookController));

bookRouter.get("/:id", bookController.getBookById.bind(bookController));

bookRouter.put(
  "/:id",
  adminMiddleware,
  bookController.updateBook.bind(bookController),
);

bookRouter.delete(
  "/:id",
  adminMiddleware,
  bookController.deleteBook.bind(bookController),
);
