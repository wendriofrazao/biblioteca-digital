const API_URL = import.meta.env.VITE_LOCAL_API_URL;

async function treeRequest(endpoint) {
  const token = localStorage.getItem("token");

  let response;

  try {
    response = await fetch(`${API_URL}/tree${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      },
    });
  } catch {
    throw new Error("Não foi possível conectar ao servidor.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Erro ao consultar a Árvore Rubro-Negra.");
  }

  return data;
}

export async function getRedBlackTree() {
  const response = await treeRequest("/");
  return response.data;
}

export async function searchBookInTree(id) {
  const bookId = Number(id);

  if (!Number.isInteger(bookId) || bookId <= 0) {
    throw new Error("Informe um ID de livro válido.");
  }

  const response = await treeRequest(`/buscar/${bookId}`);
  return response.data;
}

export async function getRedBlackTreeStats() {
  const response = await treeRequest("/estatisticas");

  return {
    nodeCount: response.quantidadeNos,
    root: response.raiz,
    height: response.altura,
  };
}
