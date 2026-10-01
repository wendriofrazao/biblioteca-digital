import { CategoryRepository } from "../repository/category.repository.js";

const categoryRepository = new CategoryRepository();

export class CategoryService {
  async createCategoryService(data) {
    if (!data.nome || data.nome.trim() === "") {
      throw new Error("O nome da categoria é obrigatório");
    }

    const categoriaExistente =
      await categoryRepository.getCategoryByNameRepository(data.nome);

    if (categoriaExistente) {
      throw new Error("Já existe uma categoria com esse nome");
    }

    return await categoryRepository.createCategoryRepository({
      nome: data.nome.trim(),
      descricao: data.descricao?.trim() || null,
    });
  }

  async getAllCategoryService() {
    return await categoryRepository.getAllCategoryRepository();
  }

  async getCategoryByIdService(id) {
    const categoria = await categoryRepository.getCategoryByIdRepository(id);

    if (!categoria) {
      throw new Error("Categoria não encontrada");
    }

    return categoria;
  }

  async updateCategoryService(id, data) {
    const categoria = await categoryRepository.getCategoryByIdRepository(id);

    if (!categoria) {
      throw new Error("Categoria não encontrada");
    }

    if (!data.nome || data.nome.trim() === "") {
      throw new Error("O nome da categoria é obrigatório");
    }

    const categoriaComMesmoNome =
      await categoryRepository.getCategoryByNameRepository(data.nome);

    if (categoriaComMesmoNome && categoriaComMesmoNome.id !== id) {
      throw new Error("Já existe uma categoria com esse nome");
    }

    return await categoryRepository.updateCategoryRepository(id, {
      nome: data.nome.trim(),
      descricao: data.descricao?.trim() || null,
    });
  }

  async deleteCategoryService(id) {
    const categoria = await categoryRepository.getCategoryByIdRepository(id);

    if (!categoria) {
      throw new Error("Categoria não encontrada");
    }

    return await categoryRepository.deleteCategoryRepository(id);
  }
}
