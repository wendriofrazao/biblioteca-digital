import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { router } from "./routes/router.js";
import { ConnectionDB } from "./configs/dbConnecting.js";
import { BookService } from "./services/book.service.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);

app.use(router);

const startServer = async () => {
  try {
    await ConnectionDB();

    const bookService = new BookService();
    const quantidade = await bookService.sincronizarArvore();

    console.log(`${quantidade} livros carregados na Árvore Rubro-Negra`);

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Servidor rodando! -> http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar servidor:", error);
    process.exit(1);
  }
};

startServer();
