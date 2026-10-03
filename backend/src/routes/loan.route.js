import { Router } from "express";
import { LoanController } from "../controllers/loan.controller.js";
import { authMiddlewarer } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";

export const loanRouter = Router();

const loanController = new LoanController();

const adminMiddleware = [authMiddlewarer, isAdmin];

loanRouter.post("/", authMiddlewarer, loanController.createLoan.bind(loanController));

loanRouter.get("/", authMiddlewarer, loanController.getAllLoans.bind(loanController));

loanRouter.get("/:id", authMiddlewarer, loanController.getLoanById.bind(loanController));

loanRouter.patch("/:id/devolucao", authMiddlewarer, loanController.returnBook.bind(loanController));

loanRouter.delete("/:id", adminMiddleware, loanController.deleteLoan.bind(loanController));