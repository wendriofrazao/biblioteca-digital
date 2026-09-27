import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({
  adapter,
});

export async function ConnectionDB() {
  try {
    await prisma.$connect();

    console.log("Prisma conectado ao PostgreSQL");
  } catch (error) {
    console.error("Erro acontecido (ConnectionDB):", error);
    throw error;
  }
}
