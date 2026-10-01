import { AuthorService } from "../services/author.service.js";

const authorService = new AuthorService();

export class AuthorController {
  async createAuthor(req, res) {
    try {
      const { nome, nacionalidade, nascimento } = req.body;

      const author = await authorService.createAuthorService({
        nome,
        nacionalidade,
        nascimento,
      });

      return res.status(201).json({
        message: "Autor criado com sucesso",
        autor: author,
      });
    } catch (error) {
      console.error("Erro no controller de autor:", error);

      if (error.message.includes("Já existe um autor")) {
        return res.status(409).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async getAllAuthors(req, res) {
    try {
      const authors = await authorService.getAllAuthorsService();

      return res.status(200).json(authors);
    } catch (error) {
      console.error("Erro no controller de autor:", error);

      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async getAuthorById(req, res) {
    try {
      const { id } = req.params;

      const author = await authorService.getAuthorByIdService(Number(id));

      return res.status(200).json(author);
    } catch (error) {
      console.error("Erro no controller de autor:", error);

      if (error.message.includes("não encontrado")) {
        return res.status(404).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async updateAuthor(req, res) {
    try {
      const { id } = req.params;

      const { nome, nacionalidade, nascimento } = req.body;

      const author = await authorService.updateAuthorService(Number(id), {
        nome,
        nacionalidade,
        nascimento,
      });

      return res.status(200).json({
        message: "Autor atualizado com sucesso",
        autor: author,
      });
    } catch (error) {
      console.error("Erro no controller de autor:", error);

      if (error.message.includes("não encontrado")) {
        return res.status(404).json({
          message: error.message,
        });
      }

      if (error.message.includes("Já existe um autor")) {
        return res.status(409).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async deleteAuthor(req, res) {
    try {
      const { id } = req.params;

      await authorService.deleteAuthorService(Number(id));

      return res.status(200).json({
        message: "Autor excluído com sucesso",
      });
    } catch (error) {
      console.error("Erro no controller de autor:", error);

      if (error.message.includes("não encontrado")) {
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
