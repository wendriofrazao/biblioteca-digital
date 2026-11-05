import { useCallback, useEffect, useState } from "react";
import { LoanService } from "../service/loan.service.jsx";

/**
 * Converte empréstimo da API → formato da LoansView.
 */
export function mapLoanFromApi(loan) {
  if (!loan) return null;

  const livro = loan.livro ?? loan.book ?? {};

  const autores = Array.isArray(livro.autores)
    ? livro.autores
        .map((item) => item.autor?.nome ?? item.nome ?? item.name)
        .filter(Boolean)
        .join(", ")
    : (livro.autor ?? livro.author ?? loan.author ?? "Autor não informado");

  const statusRaw = String(loan.status ?? "").toUpperCase();
  const isReturned =
    statusRaw === "DEVOLVIDO" ||
    statusRaw === "RETURNED" ||
    Boolean(loan.dataDevolucao);

  const formatDate = (value) => {
    if (!value) return "—";
    try {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return String(value);
      return d.toLocaleDateString("pt-BR");
    } catch {
      return String(value);
    }
  };

  return {
    id: loan.id,
    status: isReturned ? "devolvido" : "ativo",
    code: livro.isbn ?? String(loan.livroId ?? loan.id),
    bookTitle:
      livro.titulo ?? livro.title ?? loan.bookTitle ?? "Título não informado",
    author: autores,
    coverUrl: livro.capaUrl ?? livro.coverUrl ?? loan.coverUrl ?? "",
    loanDate: formatDate(loan.dataEmprestimo ?? loan.loanDate),
    dueDate: formatDate(loan.dataPrevista ?? loan.dueDate),
    renewalCount: Number(loan.renovacoes ?? loan.renewalCount ?? 0),
    maxRenewals: Number(loan.maxRenovacoes ?? loan.maxRenewals ?? 3),
    livroId: loan.livroId ?? livro.id,
    _raw: loan,
  };
}

/**
 * Hook funcional de empréstimos: listar, criar, devolver, recarregar.
 */
export function useLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const clearFeedback = useCallback(() => setFeedback(null), []);

  const loadLoans = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await LoanService.getAllLoans();
      const lista = Array.isArray(data) ? data : [];
      setLoans(lista.map(mapLoanFromApi).filter(Boolean));
      return lista;
    } catch (err) {
      const message =
        err.message || "Não foi possível carregar os empréstimos.";
      setError(message);
      setLoans([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLoans().catch(() => {});
  }, [loadLoans]);

  /** Emprestar livro (catálogo / modal). */
  const borrow = useCallback(
    async ({ livroId, usuarioId, dataPrevista, observacao }) => {
      setBusyId("borrow");
      setFeedback(null);

      try {
        const due = dataPrevista ?? LoanService.defaultDueDate(14);

        const created = await LoanService.createLoan({
          livroId,
          usuarioId,
          dataPrevista: due,
          observacao,
        });

        setFeedback({
          kind: "success",
          text: "Empréstimo realizado com sucesso.",
        });

        await loadLoans().catch(() => {});
        return created;
      } catch (err) {
        const message =
          err.message || "Não foi possível realizar o empréstimo.";
        setFeedback({ kind: "error", text: message });
        throw err;
      } finally {
        setBusyId(null);
      }
    },
    [loadLoans],
  );

  /** Devolver livro. */
  const returnLoan = useCallback(
    async (loanId) => {
      setBusyId(loanId);
      setFeedback(null);

      try {
        const updated = await LoanService.returnBook(loanId);

        setFeedback({
          kind: "success",
          text: "Livro devolvido com sucesso.",
        });

        // Atualiza localmente sem esperar o GET (UX mais rápida)
        setLoans((current) =>
          current.map((item) =>
            item.id === loanId ? { ...item, status: "devolvido" } : item,
          ),
        );

        await loadLoans().catch(() => {});
        return updated;
      } catch (err) {
        const message = err.message || "Não foi possível devolver o livro.";
        setFeedback({ kind: "error", text: message });
        throw err;
      } finally {
        setBusyId(null);
      }
    },
    [loadLoans],
  );

  const activeLoans = loans.filter((l) => l.status !== "devolvido");
  const returnedLoans = loans.filter((l) => l.status === "devolvido");

  return {
    loans,
    activeLoans,
    returnedLoans,
    loading,
    error,
    feedback,
    busyId,
    clearFeedback,
    loadLoans,
    borrow,
    returnLoan,
  };
}
