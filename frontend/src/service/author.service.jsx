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
    throw new Error("O ID do autor deve ser um número inteiro positivo.");
  }

  return numero;
}

function prepararDadosAutor(autor) {
  if (!autor || typeof autor !== "object") {
    throw new Error("Informe os dados do autor.");
  }

  if (!String(autor.nome ?? "").trim()) {
    throw new Error("O nome do autor é obrigatório.");
  }

  return {
    nome: String(autor.nome).trim(),
    nacionalidade: autor.nacionalidade?.trim() || null,
    nascimento: autor.nascimento || null,
  };
}

export const AuthorService = {
  async getAllAuthors() {
    return request("/author");
  },

  async getAuthorById(id) {
    return request(`/author/${validarId(id)}`);
  },

  async createAuthor(autor) {
    return request("/author", {
      method: "POST",
      body: JSON.stringify(prepararDadosAutor(autor)),
    });
  },

  async updateAuthor(id, autor) {
    return request(`/author/${validarId(id)}`, {
      method: "PUT",
      body: JSON.stringify(prepararDadosAutor(autor)),
    });
  },

  async deleteAuthor(id) {
    return request(`/author/${validarId(id)}`, {
      method: "DELETE",
    });
  },
};
