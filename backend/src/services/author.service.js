import { AuthorRepository } from "../repository/author.repository.js";

const authorRepository = new AuthorRepository();

export class AuthorService {
  async createAuthorService(data) {
    if (!data.nome || data.nome.trim() === "") {
      throw new Error("O nome do autor é obrigatório");
    }

    const authorExists =
      await authorRepository.getAuthorByNameRepository(
        data.nome.trim(),
      );

    if (authorExists) {
      throw new Error("Já existe um autor com esse nome");
    }

    return await authorRepository.createAuthorRepository({
      nome: data.nome.trim(),
      nacionalidade: data.nacionalidade?.trim() || null,
      nascimento: data.nascimento
        ? new Date(data.nascimento)
        : null,
    });
  }

  async getAllAuthorsService() {
    return await authorRepository.getAllAuthorsRepository();
  }

  async getAuthorByIdService(id) {
    const author =
      await authorRepository.getAuthorByIdRepository(id);

    if (!author) {
      throw new Error("Autor não encontrado");
    }

    return author;
  }

  async updateAuthorService(id, data) {
    const author =
      await authorRepository.getAuthorByIdRepository(id);

    if (!author) {
      throw new Error("Autor não encontrado");
    }

    if (!data.nome || data.nome.trim() === "") {
      throw new Error("O nome do autor é obrigatório");
    }

    const authorWithSameName =
      await authorRepository.getAuthorByNameRepository(
        data.nome.trim(),
      );

    if (
      authorWithSameName &&
      authorWithSameName.id !== id
    ) {
      throw new Error("Já existe um autor com esse nome");
    }

    return await authorRepository.updateAuthorRepository(id, {
      nome: data.nome.trim(),
      nacionalidade: data.nacionalidade?.trim() || null,
      nascimento: data.nascimento
        ? new Date(data.nascimento)
        : null,
    });
  }

  async deleteAuthorService(id) {
    const author =
      await authorRepository.getAuthorByIdRepository(id);

    if (!author) {
      throw new Error("Autor não encontrado");
    }

    return await authorRepository.deleteAuthorRepository(id);
  }
}