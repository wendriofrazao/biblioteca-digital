import { prisma } from "../configs/dbConnecting.js";

export class LoanRepository {
  async createLoanRepository(data) {
    try {
      return await prisma.emprestimo.create({
        data,
        include: {
          livro: true,
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
              matricula: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(
        `Erro ao criar empréstimo (repository): ${error.message}`,
      );
    }
  }

  async getAllLoansRepository() {
    try {
      return await prisma.emprestimo.findMany({
        orderBy: {
          dataEmprestimo: "desc",
        },
        include: {
          livro: true,
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
              matricula: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(
        `Erro ao buscar empréstimos (repository): ${error.message}`,
      );
    }
  }

  async getLoanByIdRepository(id) {
    try {
      return await prisma.emprestimo.findUnique({
        where: {
          id,
        },
        include: {
          livro: true,
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
              matricula: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(
        `Erro ao buscar empréstimo por id (repository): ${error.message}`,
      );
    }
  }

  async getActiveLoanByUserAndBookRepository(usuarioId, livroId) {
    try {
      return await prisma.emprestimo.findFirst({
        where: {
          usuarioId,
          livroId,
          dataDevolucao: null,
        },
      });
    } catch (error) {
      throw new Error(
        `Erro ao verificar empréstimo ativo (repository): ${error.message}`,
      );
    }
  }

  async updateLoanRepository(id, data) {
    try {
      return await prisma.emprestimo.update({
        where: {
          id,
        },
        data,
        include: {
          livro: true,
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
              matricula: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(
        `Erro ao atualizar empréstimo (repository): ${error.message}`,
      );
    }
  }

  async deleteLoanRepository(id) {
    try {
      return await prisma.emprestimo.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new Error(
        `Erro ao excluir empréstimo (repository): ${error.message}`,
      );
    }
  }

  async findUserRepository(usuarioId) {
    try {
      return await prisma.usuario.findUnique({
        where: {
          id: usuarioId,
        },
      });
    } catch (error) {
      throw new Error(`Erro ao buscar usuário (repository): ${error.message}`);
    }
  }

  async findBookRepository(livroId) {
    try {
      return await prisma.livro.findUnique({
        where: {
          id: livroId,
        },
      });
    } catch (error) {
      throw new Error(`Erro ao buscar livro (repository): ${error.message}`);
    }
  }

  async decreaseAvailableBooksRepository(livroId) {
    try {
      return await prisma.livro.update({
        where: {
          id: livroId,
        },
        data: {
          disponiveis: {
            decrement: 1,
          },
        },
      });
    } catch (error) {
      throw new Error(
        `Erro ao diminuir exemplares disponíveis (repository): ${error.message}`,
      );
    }
  }

  async increaseAvailableBooksRepository(livroId) {
    try {
      return await prisma.livro.update({
        where: {
          id: livroId,
        },
        data: {
          disponiveis: {
            increment: 1,
          },
        },
      });
    } catch (error) {
      throw new Error(
        `Erro ao aumentar exemplares disponíveis (repository): ${error.message}`,
      );
    }
  }
}
