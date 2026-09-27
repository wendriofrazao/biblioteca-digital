import { prisma } from "../configs/dbConnecting.js";

export class AuthRepository {
  async getUserById(userId) {
    try {
      return await prisma.usuario.findUnique({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      throw new Error(`Erro ao buscar usuário por id (repository): ${error}`);
    }
  }

  async getByEmail(email) {
    try {
      return await prisma.usuario.findUnique({
        where: {
          email: email,
        },
      });
    } catch (error) {
      throw new Error(
        `Erro ao buscar usuário por email (repository): ${error}`,
      );
    }
  }

  async createUser(data) {
    try {
      if (typeof data !== Object && !Object.entries(data)) {
        throw new Error(`Não se enquadra ao formato obrigatório`);
      }
      return await prisma.usuario.create({ data });
    } catch (error) {
      throw new Error(`Erro ao criar usuário (repository): ${error}`);
    }
  }
}
