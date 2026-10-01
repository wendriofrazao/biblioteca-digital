import { prisma } from "../configs/dbConnecting.js";

export class AuthorRepository {
  async createAuthorRepository(data) {
    try {
      return await prisma.autor.create({
        data,
      });
    } catch (error) {
      throw new Error(`Erro ao criar autor (repository): ${error.message}`);
    }
  }

  async getAllAuthorsRepository() {
    try {
      return await prisma.autor.findMany({
        orderBy: {
          nome: "asc",
        },
      });
    } catch (error) {
      throw new Error(`Erro ao buscar autores (repository): ${error.message}`);
    }
  }

  async getAuthorByIdRepository(id) {
    try {
      return await prisma.autor.findUnique({
        where: {
          id,
        },
        include: {
          livros: {
            include: {
              livro: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(
        `Erro ao buscar autor por id (repository): ${error.message}`,
      );
    }
  }

  async getAuthorByNameRepository(nome) {
    try {
      return await prisma.autor.findFirst({
        where: {
          nome,
        },
      });
    } catch (error) {
      throw new Error(
        `Erro ao buscar autor por nome (repository): ${error.message}`,
      );
    }
  }

  async updateAuthorRepository(id, data) {
    try {
      return await prisma.autor.update({
        where: {
          id,
        },
        data,
      });
    } catch (error) {
      throw new Error(`Erro ao atualizar autor (repository): ${error.message}`);
    }
  }

  async deleteAuthorRepository(id) {
    try {
      return await prisma.autor.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new Error(`Erro ao excluir autor (repository): ${error.message}`);
    }
  }
}
