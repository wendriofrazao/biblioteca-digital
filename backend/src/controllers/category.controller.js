import { CategoryService } from "../services/category.service.js";

const categoryService = new CategoryService();

export class CategoryController {
  async createCategory(req, res) {
    try {
      const { nome, descricao } = req.body;

      const categoria = await categoryService.createCategoryService({
        nome,
        descricao,
      });

      return res.status(201).json({
        message: "Categoria criada com sucesso",
        categoria,
      });
    } catch (error) {
      console.error("Erro no controller de categoria:", error);

      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async getAllCategories(req, res) {
    try {
      const categorias =
        await categoryService.getAllCategoryService();

      return res.status(200).json(categorias);
    } catch (error) {
      console.error("Erro no controller de categoria:", error);

      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async getCategoryById(req, res) {
    try {
      const { id } = req.params;

      const categoria =
        await categoryService.getCategoryByIdService(Number(id));

      return res.status(200).json(categoria);
    } catch (error) {
      console.error("Erro no controller de categoria:", error);

      if (error.message.includes("não encontrada")) {
        return res.status(404).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao } = req.body;

      const categoria =
        await categoryService.updateCategoryService(
          Number(id),
          {
            nome,
            descricao,
          },
        );

      return res.status(200).json({
        message: "Categoria atualizada com sucesso",
        categoria,
      });
    } catch (error) {
      console.error("Erro no controller de categoria:", error);

      if (error.message.includes("não encontrada")) {
        return res.status(404).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async deleteCategory(req, res) {
    try {
      const { id } = req.params;

      await categoryService.deleteCategoryService(Number(id));

      return res.status(200).json({
        message: "Categoria excluída com sucesso",
      });
    } catch (error) {
      console.error("Erro no controller de categoria:", error);

      if (error.message.includes("não encontrada")) {
        return res.status(404).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: error.message,
      });
    }
  }
}