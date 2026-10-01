import { Router } from "express";
import { CategoryController } from "../controllers/category.controller.js";
import { authMiddlewarer } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";

export const categoryRouter = Router();

const categoryController = new CategoryController();

const adminMiddleware = [authMiddlewarer, isAdmin];

categoryRouter.post(
  "/",
  adminMiddleware,
  categoryController.createCategory.bind(categoryController),
);

categoryRouter.get(
  "/",
  categoryController.getAllCategories.bind(categoryController),
);

categoryRouter.get(
  "/:id",
  categoryController.getCategoryById.bind(categoryController),
);

categoryRouter.put(
  "/:id",
  adminMiddleware,
  categoryController.updateCategory.bind(categoryController),
);

categoryRouter.delete(
  "/:id",
  adminMiddleware,
  categoryController.deleteCategory.bind(categoryController),
);
