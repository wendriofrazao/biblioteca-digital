import { JwtService } from "../services/jwt.service.js";
import dotenv from "dotenv";
dotenv.config();

const jwt = new JwtService();

export function authMiddlewarer(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Token não fornecido",
      });
    }

    const decoded = jwt.verifyToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    console.log(`Error acontecido (middlewarer): ${error}`);
    return res.status(401).json({
      success: false,
      message: "Token inválido ou expirado",
    });
  }
}