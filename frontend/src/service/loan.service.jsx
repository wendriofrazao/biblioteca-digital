const API_URL = import.meta.env.VITE_LOCAL_API_URL;

async function loanRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  let response;

  try {
    response = await fetch(`${API_URL}/loan${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });
  } catch {
    throw new Error("Não foi possível conectar ao servidor.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        data.error ||
        "Erro ao processar a solicitação de empréstimo.",
    );
  }

  return data;
}

/** Cria um novo empréstimo. */
export async function createLoan(payload) {
  const { livroId, usuarioId, dataPrevista, observacao } = payload;

  if (!livroId) throw new Error("O livro é obrigatório.");
  if (!usuarioId) throw new Error("O usuário é obrigatório.");
  if (!dataPrevista) {
    throw new Error("A data prevista para devolução é obrigatória.");
  }

  const body = {
    livroId: Number(livroId),
    usuarioId,
    dataPrevista:
      dataPrevista instanceof Date ? dataPrevista.toISOString() : dataPrevista,
    ...(observacao != null && String(observacao).trim() !== ""
      ? { observacao: String(observacao).trim() }
      : {}),
  };

  const response = await loanRequest("/", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return response.emprestimo ?? response.data ?? response;
}

/** Lista empréstimos (do usuário logado ou todos, se admin). */
export async function getAllLoans() {
  const response = await loanRequest("/", { method: "GET" });
  return Array.isArray(response)
    ? response
    : (response.data ?? response.emprestimos ?? []);
}

/** Busca um empréstimo pelo ID. */
export async function getLoanById(id) {
  const loanId = Number(id);
  if (!Number.isInteger(loanId) || loanId <= 0) {
    throw new Error("Informe um ID de empréstimo válido.");
  }

  const response = await loanRequest(`/${loanId}`, { method: "GET" });
  return response.emprestimo ?? response.data ?? response;
}

/** Registra a devolução. */
export async function returnBook(id) {
  const loanId = Number(id);
  if (!Number.isInteger(loanId) || loanId <= 0) {
    throw new Error("Informe um ID de empréstimo válido.");
  }

  const response = await loanRequest(`/${loanId}/devolucao`, {
    method: "PATCH",
  });

  return response.emprestimo ?? response.data ?? response;
}

/** Exclui empréstimo (admin). */
export async function deleteLoan(id) {
  const loanId = Number(id);
  if (!Number.isInteger(loanId) || loanId <= 0) {
    throw new Error("Informe um ID de empréstimo válido.");
  }

  return loanRequest(`/${loanId}`, { method: "DELETE" });
}

/** Data prevista padrão (hoje + N dias) em ISO. */
export function defaultDueDate(days = 14) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(23, 59, 59, 999);
  return date.toISOString();
}

export const LoanService = {
  createLoan,
  getAllLoans,
  getLoanById,
  returnBook,
  deleteLoan,
  defaultDueDate,
};
