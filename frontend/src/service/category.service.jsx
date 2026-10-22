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
    throw new Error(
      "O ID da categoria deve ser um número inteiro positivo.",
    );
  }

  return numero;
}

function prepararDadosCategoria(categoria) {
  if (!categoria || typeof categoria !== "object") {
    throw new Error("Informe os dados da categoria.");
  }

  if (!String(categoria.nome ?? "").trim()) {
    throw new Error("O nome da categoria é obrigatório.");
  }

  return {
    nome: String(categoria.nome).trim(),
    descricao: categoria.descricao?.trim() || null,
  };
}

export const CategoryService = {
  async getAllCategories() {
    return request("/category");
  },

  async getCategoryById(id) {
    return request(`/category/${validarId(id)}`);
  },

  async createCategory(categoria) {
    return request("/category", {
      method: "POST",
      body: JSON.stringify(prepararDadosCategoria(categoria)),
    });
  },

  async updateCategory(id, categoria) {
    return request(`/category/${validarId(id)}`, {
      method: "PUT",
      body: JSON.stringify(prepararDadosCategoria(categoria)),
    });
  },

  async deleteCategory(id) {
    return request(`/category/${validarId(id)}`, {
      method: "DELETE",
    });
  },
};
