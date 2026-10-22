import { Router } from "express";
import { authMiddlewarer } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";
import { AuthController } from "../controllers/auth.controller.js";
import {
  loginLimiter,
  registerLimiter,
} from "../middlewares/middlewarerRateLitime.js";

const auth = new AuthController();

export const authRouter = Router();

const adminMiddleware = [authMiddlewarer, isAdmin];

authRouter.post("/login", loginLimiter, auth.loginController);
authRouter.post("/register", registerLimiter, auth.registerController);
authRouter.get("/profile", authMiddlewarer, auth.profileController);
authRouter.get("/user", adminMiddleware, auth.getAllUsersController);
