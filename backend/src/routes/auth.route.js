import { Router } from "express";
import { authMiddlewarer } from "../middlewares/auth.middleware.js";
import { AuthController } from "../controllers/auth.controller.js";
import { loginLimiter, registerLimiter } from "../middlewares/middlewarerRateLitime.js";

const auth = new AuthController();

export const authRouter = Router();

authRouter.post("/login", loginLimiter, auth.loginController);
authRouter.post("/register", registerLimiter, auth.registerController);
authRouter.get("/profile", authMiddlewarer, auth.profileController);