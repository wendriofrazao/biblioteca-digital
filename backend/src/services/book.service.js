import { BookRepository } from "../repository/book.repository.js";

const bookRepository = new BookRepository();

export class BookService {
  async createBookService(data) {
    const {
      isbn,
      categoriaId,
      titulo,
      editora,
      anoPublicacao,
      quantidade,
      autores,
    } = data;

    if (!isbn || isbn.trim() === "") {
      throw new Error("O ISBN é obrigatório");
    }

    if (!titulo || titulo.trim() === "") {
      throw new Error("O título do livro é obrigatório");
    }

    if (!categoriaId) {
      throw new Error("A categoria é obrigatória");
    }

    if (
      quantidade === undefined ||
      quantidade === null ||
      quantidade < 0
    ) {
      throw new Error("A quantidade deve ser maior ou igual a zero");
    }

    const bookExists =
      await bookRepository.getBookByIsbnRepository(
        isbn.trim(),
      );

    if (bookExists) {
      throw new Error("Já existe um livro com esse ISBN");
    }

    const autoresData = autores?.map((autorId) => ({
      autor: {
        connect: {
          id: Number(autorId),
        },
      },
    })) || [];

    return await bookRepository.createBookRepository({
      isbn: isbn.trim(),
      categoriaId: Number(categoriaId),
      titulo: titulo.trim(),
      editora: editora?.trim() || null,
      anoPublicacao: anoPublicacao
        ? Number(anoPublicacao)
        : null,
      quantidade: Number(quantidade),
      disponiveis: Number(quantidade),

      autores: {
        create: autoresData,
      },
    });
  }

  async getAllBooksService() {
    return await bookRepository.getAllBooksRepository();
  }

  async getBookByIdService(id) {
    const book =
      await bookRepository.getBookByIdRepository(id);

    if (!book) {
      throw new Error("Livro não encontrado");
    }

    return book;
  }

  async updateBookService(id, data) {
    const book =
      await bookRepository.getBookByIdRepository(id);

    if (!book) {
      throw new Error("Livro não encontrado");
    }

    const {
      isbn,
      categoriaId,
      titulo,
      editora,
      anoPublicacao,
      quantidade,
      autores,
    } = data;

    if (!isbn || isbn.trim() === "") {
      throw new Error("O ISBN é obrigatório");
    }

    if (!titulo || titulo.trim() === "") {
      throw new Error("O título do livro é obrigatório");
    }

    const bookWithSameIsbn =
      await bookRepository.getBookByIsbnRepository(
        isbn.trim(),
      );

    if (
      bookWithSameIsbn &&
      bookWithSameIsbn.id !== id
    ) {
      throw new Error("Já existe outro livro com esse ISBN");
    }

    const updateData = {
      isbn: isbn.trim(),
      categoriaId: Number(categoriaId),
      titulo: titulo.trim(),
      editora: editora?.trim() || null,
      anoPublicacao: anoPublicacao
        ? Number(anoPublicacao)
        : null,
    };

    if (quantidade !== undefined) {
      const novaQuantidade = Number(quantidade);

      if (novaQuantidade < 0) {
        throw new Error(
          "A quantidade deve ser maior ou igual a zero",
        );
      }

      const diferenca =
        novaQuantidade - book.quantidade;

      const novasDisponiveis =
        book.disponiveis + diferenca;

      if (novasDisponiveis < 0) {
        throw new Error(
          "A quantidade não pode ser menor que a quantidade de livros emprestados",
        );
      }

      updateData.quantidade = novaQuantidade;
      updateData.disponiveis = novasDisponiveis;
    }

    if (autores !== undefined) {
      updateData.autores = {
        deleteMany: {},

        create: autores.map((autorId) => ({
          autor: {
            connect: {
              id: Number(autorId),
            },
          },
        })),
      };
    }

    return await bookRepository.updateBookRepository(
      id,
      updateData,
    );
  }

  async deleteBookService(id) {
    const book =
      await bookRepository.getBookByIdRepository(id);

    if (!book) {
      throw new Error("Livro não encontrado");
    }

    if (book.emprestimos.length > 0) {
      throw new Error(
        "Não é possível excluir um livro que possui empréstimos registrados",
      );
    }

    return await bookRepository.deleteBookRepository(id);
  }
}