const API_URL = import.meta.env.VITE_LOCAL_API_URL;

async function request(endpoint, options = {}) {
  if (!API_URL) {
    throw new Error("Configure VITE_LOCAL_API_URL no arquivo .env");
  }

  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message || `Erro na requisição (${response.status}).`,
    );
  }

  return result;
}

function validarId(id) {
  const numero = Number(id);

  if (!Number.isInteger(numero) || numero <= 0) {
    throw new Error("O ID do livro deve ser um número inteiro positivo.");
  }

  return numero;
}

function validarLivro(livro) {
  if (!livro || typeof livro !== "object") {
    throw new Error("Informe os dados do livro.");
  }

  if (!String(livro.isbn ?? "").trim()) {
    throw new Error("O ISBN é obrigatório.");
  }

  if (!String(livro.titulo ?? "").trim()) {
    throw new Error("O título é obrigatório.");
  }

  const categoriaId = Number(livro.categoriaId);

  if (!Number.isInteger(categoriaId) || categoriaId <= 0) {
    throw new Error("Informe uma categoria válida.");
  }

  if (
    livro.quantidade !== undefined &&
    (!Number.isInteger(Number(livro.quantidade)) ||
      Number(livro.quantidade) < 0)
  ) {
    throw new Error("A quantidade deve ser um número inteiro não negativo.");
  }
}

function prepararDadosLivro(livro) {
  const dados = { ...livro };

  if (dados.isbn !== undefined) {
    dados.isbn = String(dados.isbn).trim();
  }

  if (dados.titulo !== undefined) {
    dados.titulo = String(dados.titulo).trim();
  }

  if (dados.categoriaId !== undefined) {
    dados.categoriaId = Number(dados.categoriaId);
  }

  if (
    dados.anoPublicacao !== undefined &&
    dados.anoPublicacao !== null &&
    dados.anoPublicacao !== ""
  ) {
    dados.anoPublicacao = Number(dados.anoPublicacao);
  } else if (dados.anoPublicacao === "") {
    dados.anoPublicacao = null;
  }

  if (dados.quantidade !== undefined && dados.quantidade !== "") {
    dados.quantidade = Number(dados.quantidade);
  }

  if (
    dados.paginas !== undefined &&
    dados.paginas !== null &&
    dados.paginas !== ""
  ) {
    dados.paginas = Number(dados.paginas);
  } else if (dados.paginas === "") {
    dados.paginas = null;
  }

  if (dados.editora === "") dados.editora = null;
  if (dados.edicao === "") dados.edicao = null;
  if (dados.idioma === "") dados.idioma = null;
  if (dados.localizacao === "") dados.localizacao = null;
  if (dados.sinopse === "") dados.sinopse = null;
  if (dados.capaUrl === "") dados.capaUrl = null;

  return dados;
}

export const BookService = {
  async getAllBooks() {
    return request("/book");
  },

  async getBookById(id) {
    return request(`/book/${validarId(id)}`);
  },

  async createBook(livro) {
    validarLivro(livro);

    const dados = prepararDadosLivro(livro);

    return request("/book", {
      method: "POST",
      body: JSON.stringify(dados),
    });
  },

  async updateBook(id, livro) {
    validarId(id);

    const dados = prepararDadosLivro(livro);

    return request(`/book/${Number(id)}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    });
  },

  async deleteBook(id) {
    return request(`/book/${validarId(id)}`, {
      method: "DELETE",
    });
  },
};

