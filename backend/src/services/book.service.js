// services/book.service.js

import { BookRepository } from "../repository/book.repository.js";
import { bookTree } from "../structures/redBlackTree/bookTree.js";

const bookRepository = new BookRepository();

function validarTexto(valor, campo) {
  if (typeof valor !== "string" || !valor.trim()) {
    throw new Error(`${campo} é obrigatório`);
  }
}

function validarInteiro(valor, campo, minimo = 0) {
  const numero = Number(valor);

  if (
    valor === "" ||
    valor === null ||
    valor === undefined ||
    !Number.isInteger(numero) ||
    numero < minimo
  ) {
    throw new Error(
      `${campo} deve ser um número inteiro maior ou igual a ${minimo}`,
    );
  }

  return numero;
}

function normalizarAutores(autores) {
  if (autores === undefined) return undefined;

  if (!Array.isArray(autores)) {
    throw new Error("Os autores devem ser enviados como uma lista de IDs");
  }

  const ids = autores.map((id) => validarInteiro(id, "ID do autor", 1));

  return [...new Set(ids)];
}

function montarRelacaoAutores(ids) {
  return {
    deleteMany: {},
    create: ids.map((autorId) => ({
      autor: {
        connect: { id: autorId },
      },
    })),
  };
}

export class BookService {
  async sincronizarArvore() {
    const livros = await bookRepository.getAllBooksRepository();

    bookTree.clear();

    for (const livro of livros) {
      bookTree.insert(Number(livro.id), livro);
    }

    console.log(`${livros.length} livros carregados na Árvore Rubro-Negra`);

    return livros.length;
  }

  async createBookService(data) {
    const {
      isbn,
      categoriaId,
      titulo,
      editora,
      anoPublicacao,
      quantidade,
      autores = [],
      paginas,
      edicao,
      idioma,
      localizacao,
      sinopse,
      capaUrl,
      tags = [],
    } = data;

    validarTexto(isbn, "O ISBN");
    validarTexto(titulo, "O título");

    const categoria = validarInteiro(categoriaId, "A categoria", 1);
    const total = validarInteiro(quantidade, "A quantidade");

    const ano =
      anoPublicacao === "" ||
      anoPublicacao === null ||
      anoPublicacao === undefined
        ? null
        : validarInteiro(anoPublicacao, "O ano de publicação", 1);

    const paginasNormalizadas =
      paginas === "" || paginas === null || paginas === undefined
        ? null
        : validarInteiro(paginas, "O número de páginas", 1);

    const isbnNormalizado = isbn.trim();
    const tituloNormalizado = titulo.trim();
    const autoresIds = normalizarAutores(autores);

    if (!Array.isArray(tags)) {
      throw new Error("As tags devem ser enviadas como uma lista.");
    }

    const tagsNormalizadas = [
      ...new Set(
        tags
          .filter((tag) => typeof tag === "string" && tag.trim())
          .map((tag) => tag.trim()),
      ),
    ];

    const existente =
      await bookRepository.getBookByIsbnRepository(isbnNormalizado);

    if (existente) {
      throw new Error("Já existe um livro com esse ISBN");
    }

    const livro = await bookRepository.createBookRepository({
      isbn: isbnNormalizado,
      categoriaId: categoria,
      titulo: tituloNormalizado,

      editora:
        typeof editora === "string" && editora.trim() ? editora.trim() : null,

      anoPublicacao: ano,
      quantidade: total,
      disponiveis: total,

      paginas: paginasNormalizadas,

      edicao:
        typeof edicao === "string" && edicao.trim() ? edicao.trim() : null,

      idioma:
        typeof idioma === "string" && idioma.trim() ? idioma.trim() : null,

      localizacao:
        typeof localizacao === "string" && localizacao.trim()
          ? localizacao.trim()
          : null,

      sinopse:
        typeof sinopse === "string" && sinopse.trim() ? sinopse.trim() : null,

      capaUrl:
        typeof capaUrl === "string" && capaUrl.trim() ? capaUrl.trim() : null,

      tags: tagsNormalizadas,

      autores: {
        create: autoresIds.map((autorId) => ({
          autor: {
            connect: { id: autorId },
          },
        })),
      },
    });

    await this.sincronizarArvore();

    return livro;
  }

  async getAllBooksService() {
    return bookRepository.getAllBooksRepository();
  }

  async getBookByIdService(id) {
    const livroId = validarInteiro(id, "O ID do livro", 1);
    const livro = await bookRepository.getBookByIdRepository(livroId);

    if (!livro) {
      throw new Error("Livro não encontrado");
    }

    return livro;
  }

  async updateBookService(id, data) {
    const livroId = validarInteiro(id, "O ID do livro", 1);
    const livroAtual = await bookRepository.getBookByIdRepository(livroId);

    if (!livroAtual) {
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

    validarTexto(isbn, "O ISBN");
    validarTexto(titulo, "O título");

    const isbnNormalizado = isbn.trim();
    const tituloNormalizado = titulo.trim();
    const categoria = validarInteiro(categoriaId, "A categoria", 1);

    const existente =
      await bookRepository.getBookByIsbnRepository(isbnNormalizado);

    if (existente && existente.id !== livroId) {
      throw new Error("Já existe outro livro com esse ISBN");
    }

    const updateData = {
      isbn: isbnNormalizado,
      categoriaId: categoria,
      titulo: tituloNormalizado,
      editora:
        typeof editora === "string" && editora.trim() ? editora.trim() : null,
      anoPublicacao:
        anoPublicacao === "" ||
        anoPublicacao === null ||
        anoPublicacao === undefined
          ? null
          : validarInteiro(anoPublicacao, "O ano de publicação", 1),
    };

    if (quantidade !== undefined) {
      const novaQuantidade = validarInteiro(quantidade, "A quantidade");
      const emprestados = livroAtual.quantidade - livroAtual.disponiveis;

      if (novaQuantidade < emprestados) {
        throw new Error(
          "A quantidade não pode ser menor que a quantidade de exemplares emprestados",
        );
      }

      updateData.quantidade = novaQuantidade;
      updateData.disponiveis = novaQuantidade - emprestados;
    }

    const autoresIds = normalizarAutores(autores);

    if (autoresIds !== undefined) {
      updateData.autores = montarRelacaoAutores(autoresIds);
    }

    const atualizado = await bookRepository.updateBookRepository(
      livroId,
      updateData,
    );

    await this.sincronizarArvore();

    return atualizado;
  }

  async deleteBookService(id) {
    const livroId = validarInteiro(id, "O ID do livro", 1);
    const livro = await bookRepository.getBookByIdRepository(livroId);

    if (!livro) {
      throw new Error("Livro não encontrado");
    }

    if (livro.emprestimos.length > 0) {
      throw new Error(
        "Não é possível excluir um livro que possui empréstimos registrados",
      );
    }

    const resultado = await bookRepository.deleteBookRepository(livroId);

    await this.sincronizarArvore();

    return resultado;
  }
}
