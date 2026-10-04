import { prisma } from "../configs/dbConnecting.js";

export class BookAuthorRepository {
  async createBookAuthorRepository(data) {
    try {
      return await prisma.livroAutor.create({
        data: {
          livro: {
            connect: { id: data.livroId },
          },
          autor: {
            connect: { id: data.autorId },
          },
        },
        include: {
          livro: true,
          autor: true,
        },
      });
    } catch (error) {
      throw new Error(
        `Erro ao associar autor ao livro (repository): ${error.message}`,
      );
    }
  }

  async findBookAuthorRepository(livroId, autorId) {
    try {
      return await prisma.livroAutor.findUnique({
        where: {
          livroId_autorId: {
            livroId,
            autorId,
          },
        },
        include: {
          livro: true,
          autor: true,
        },
      });
    } catch (error) {
      throw new Error(
        `Erro ao buscar associação livro-autor (repository): ${error.message}`,
      );
    }
  }

  async getAuthorsByBookRepository(livroId) {
    try {
      return await prisma.livroAutor.findMany({
        where: {
          livroId,
        },
        include: {
          autor: true,
        },
        orderBy: {
          autor: {
            nome: "asc",
          },
        },
      });
    } catch (error) {
      throw new Error(
        `Erro ao buscar autores do livro (repository): ${error.message}`,
      );
    }
  }

  async getBooksByAuthorRepository(autorId) {
    try {
      return await prisma.livroAutor.findMany({
        where: {
          autorId,
        },
        include: {
          livro: true,
        },
        orderBy: {
          livro: {
            titulo: "asc",
          },
        },
      });
    } catch (error) {
      throw new Error(
        `Erro ao buscar livros do autor (repository): ${error.message}`,
      );
    }
  }

  async deleteBookAuthorRepository(livroId, autorId) {
    try {
      return await prisma.livroAutor.delete({
        where: {
          livroId_autorId: {
            livroId,
            autorId,
          },
        },
      });
    } catch (error) {
      throw new Error(
        `Erro ao remover associação livro-autor (repository): ${error.message}`,
      );
    }
  }
}
