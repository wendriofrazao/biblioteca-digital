import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { router } from "./routes/router.js";

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

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando! -> http:///localhost:${process.env.PORT}`);
});
