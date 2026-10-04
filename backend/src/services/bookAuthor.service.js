import { BookAuthorRepository } from "../repository/bookAuthor.repository.js";

const bookAuthorRepository = new BookAuthorRepository();

export class BookAuthorService {
  async createBookAuthorService(data) {
    const livroId = Number(data.livroId);
    const autorId = Number(data.autorId);

    if (!livroId) {
      throw new Error("O livro é obrigatório");
    }

    if (!autorId) {
      throw new Error("O autor é obrigatório");
    }

    const association = await bookAuthorRepository.findBookAuthorRepository(
      livroId,
      autorId,
    );

    if (association) {
      throw new Error("Este autor já está associado a este livro");
    }

    return await bookAuthorRepository.createBookAuthorRepository({
      livroId,
      autorId,
    });
  }

  async getAuthorsByBookService(livroId) {
    livroId = Number(livroId);

    if (!livroId) {
      throw new Error("ID do livro inválido");
    }

    return await bookAuthorRepository.getAuthorsByBookRepository(livroId);
  }

  async getBooksByAuthorService(autorId) {
    autorId = Number(autorId);

    if (!autorId) {
      throw new Error("ID do autor inválido");
    }

    return await bookAuthorRepository.getBooksByAuthorRepository(autorId);
  }

  async deleteBookAuthorService(livroId, autorId) {
    livroId = Number(livroId);
    autorId = Number(autorId);

    if (!livroId) {
      throw new Error("ID do livro inválido");
    }

    if (!autorId) {
      throw new Error("ID do autor inválido");
    }

    const association = await bookAuthorRepository.findBookAuthorRepository(
      livroId,
      autorId,
    );

    if (!association) {
      throw new Error("Esta associação não existe");
    }

    return await bookAuthorRepository.deleteBookAuthorRepository(
      livroId,
      autorId,
    );
  }
}
