import { prisma } from "../configs/dbConnecting.js";

export class BookRepository {
  async createBookRepository(data) {
    try {
      return await prisma.livro.create({
        data,
        include: {
          categoria: true,
          autores: {
            include: {
              autor: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Erro ao criar livro (repository): ${error.message}`);
    }
  }

  async getAllBooksRepository() {
    try {
      return await prisma.livro.findMany({
        orderBy: {
          titulo: "asc",
        },
        include: {
          categoria: true,
          autores: {
            include: {
              autor: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Erro ao buscar livros (repository): ${error.message}`);
    }
  }

  async getBookByIdRepository(id) {
    try {
      return await prisma.livro.findUnique({
        where: {
          id,
        },
        include: {
          categoria: true,
          autores: {
            include: {
              autor: true,
            },
          },
          emprestimos: true,
        },
      });
    } catch (error) {
      throw new Error(
        `Erro ao buscar livro por id (repository): ${error.message}`,
      );
    }
  }

  async getBookByIsbnRepository(isbn) {
    try {
      return await prisma.livro.findUnique({
        where: {
          isbn,
        },
      });
    } catch (error) {
      throw new Error(
        `Erro ao buscar livro por ISBN (repository): ${error.message}`,
      );
    }
  }

  async updateBookRepository(id, data) {
    try {
      return await prisma.livro.update({
        where: {
          id,
        },
        data,
        include: {
          categoria: true,
          autores: {
            include: {
              autor: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Erro ao atualizar livro (repository): ${error.message}`);
    }
  }

  async deleteBookRepository(id) {
    try {
      return await prisma.livro.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new Error(`Erro ao excluir livro (repository): ${error.message}`);
    }
  }
}
