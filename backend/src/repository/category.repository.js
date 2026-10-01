import { prisma } from "../configs/dbConnecting.js";

export class CategoryRepository {
  async createCategoryRepository(data) {
    try {
      return await prisma.categoria.create({
        data,
      });
    } catch (error) {
      throw new Error(
        `Erro ao criar categoria (repository): ${error.message}`,
      );
    }
  }

  async getAllCategoryRepository() {
    try {
      return await prisma.categoria.findMany({
        orderBy: {
          nome: "asc",
        },
      });
    } catch (error) {
      throw new Error(
        `Erro ao buscar categorias (repository): ${error.message}`,
      );
    }
  }

  async getCategoryByIdRepository(categoryId) {
    try {
      return await prisma.categoria.findUnique({
        where: {
          id: categoryId,
        },
        include: {
          livros: true,
        },
      });
    } catch (error) {
      throw new Error(
        `Erro ao buscar categoria por id (repository): ${error.message}`,
      );
    }
  }

  async getCategoryByNameRepository(nome) {
    try {
      return await prisma.categoria.findFirst({
        where: {
          nome,
        },
      });
    } catch (error) {
      throw new Error(
        `Erro ao buscar categoria por nome (repository): ${error.message}`,
      );
    }
  }

  async updateCategoryRepository(categoryId, data) {
    try {
      return await prisma.categoria.update({
        where: {
          id: categoryId,
        },
        data,
      });
    } catch (error) {
      throw new Error(
        `Erro ao atualizar categoria (repository): ${error.message}`,
      );
    }
  }

  async deleteCategoryRepository(categoryId) {
    try {
      return await prisma.categoria.delete({
        where: {
          id: categoryId,
        },
      });
    } catch (error) {
      throw new Error(
        `Erro ao excluir categoria (repository): ${error.message}`,
      );
    }
  }
}