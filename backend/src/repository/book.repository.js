// repository/book.repository.js

import { prisma } from "../configs/dbConnecting.js";

const incluirDadosLivro = {
  categoria: true,
  autores: {
    include: {
      autor: true,
    },
  },
};

export class BookRepository {
  async createBookRepository(data) {
    return prisma.livro.create({
      data,
      include: incluirDadosLivro,
    });
  }

  async getAllBooksRepository() {
    return prisma.livro.findMany({
      orderBy: {
        titulo: "asc",
      },
      include: incluirDadosLivro,
    });
  }

  async getBookByIdRepository(id) {
    return prisma.livro.findUnique({
      where: { id },
      include: {
        ...incluirDadosLivro,
        emprestimos: true,
      },
    });
  }

  async getBookByIsbnRepository(isbn) {
    return prisma.livro.findUnique({
      where: { isbn },
    });
  }

  async updateBookRepository(id, data) {
    return prisma.livro.update({
      where: { id },
      data,
      include: incluirDadosLivro,
    });
  }

  async deleteBookRepository(id) {
    return prisma.livro.delete({
      where: { id },
    });
  }
}
