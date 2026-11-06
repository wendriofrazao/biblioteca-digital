import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
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
 * Hook de empréstimos: listar, criar, renovar, devolver e recarregar.
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
      const lista = Array.isArray(data)
        ? data
        : (data?.emprestimos ?? data?.loans ?? data?.data ?? []);
      const mapped = (Array.isArray(lista) ? lista : [])
        .map(mapLoanFromApi)
        .filter(Boolean);
      setLoans(mapped);
      return mapped;
    } catch (err) {
      const message =
        err?.message || "Não foi possível carregar os empréstimos.";
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
    async ({ livroId, usuarioId, dataPrevista, observacao, maxLoans }) => {
      setBusyId("borrow");
      setFeedback(null);

      try {
        // Limite de cota (se informado pelo caller)
        if (typeof maxLoans === "number" && maxLoans > 0) {
          const activeCount = loans.filter(
            (item) => item.status !== "devolvido",
          ).length;
          if (activeCount >= maxLoans) {
            const message = `Cota de empréstimos esgotada (${activeCount}/${maxLoans}). Devolva um livro para emprestar outro.`;
            setFeedback({ kind: "error", text: message });
            toast.error(message);
            throw new Error(message);
          }
        }

        const due =
          dataPrevista ??
          (typeof LoanService.defaultDueDate === "function"
            ? LoanService.defaultDueDate(14)
            : undefined);

        const created = await LoanService.createLoan({
          livroId,
          usuarioId,
          dataPrevista: due,
          observacao,
        });

        const successText = "Empréstimo realizado com sucesso.";
        setFeedback({ kind: "success", text: successText });
        toast.success(successText);

        await loadLoans().catch(() => {});
        return created;
      } catch (err) {
        const message =
          err?.message || "Não foi possível realizar o empréstimo.";
        // Evita toast duplicado se já foi emitido no check de cota
        if (!String(err?.message ?? "").includes("Cota de empréstimos")) {
          setFeedback({ kind: "error", text: message });
          toast.error(message);
        }
        throw err;
      } finally {
        setBusyId(null);
      }
    },
    [loadLoans, loans],
  );

  /** Renovar empréstimo (+14 dias, se a API suportar). */
  const renewLoan = useCallback(
    async (loanId) => {
      const current = loans.find((item) => item.id === loanId);
      if (!current) {
        const message = "Empréstimo não encontrado.";
        toast.error(message);
        setFeedback({ kind: "error", text: message });
        throw new Error(message);
      }

      if (current.status === "devolvido") {
        const message = "Não é possível renovar um empréstimo já devolvido.";
        toast.error(message);
        setFeedback({ kind: "error", text: message });
        throw new Error(message);
      }

      if (Number(current.renewalCount) >= Number(current.maxRenewals)) {
        const message = "Limite de renovações atingido para este empréstimo.";
        toast.error(message);
        setFeedback({ kind: "error", text: message });
        throw new Error(message);
      }

      setBusyId(loanId);
      setFeedback(null);

      try {
        let updated = null;

        if (typeof LoanService.renewLoan === "function") {
          updated = await LoanService.renewLoan(loanId);
        } else if (typeof LoanService.renew === "function") {
          updated = await LoanService.renew(loanId);
        } else {
          throw new Error(
            "Renovação não disponível no serviço de empréstimos.",
          );
        }

        const successText = "Empréstimo renovado com sucesso.";
        setFeedback({ kind: "success", text: successText });
        toast.success(successText);

        // Atualização otimista local
        setLoans((list) =>
          list.map((item) =>
            item.id === loanId
              ? {
                  ...item,
                  renewalCount: Number(item.renewalCount ?? 0) + 1,
                }
              : item,
          ),
        );

        await loadLoans().catch(() => {});
        return updated;
      } catch (err) {
        const message =
          err?.message || "Não foi possível renovar o empréstimo.";
        setFeedback({ kind: "error", text: message });
        toast.error(message);
        throw err;
      } finally {
        setBusyId(null);
      }
    },
    [loadLoans, loans],
  );

  /** Devolver livro. */
  const returnLoan = useCallback(
    async (loanId) => {
      setBusyId(loanId);
      setFeedback(null);

      try {
        const updated = await LoanService.returnBook(loanId);

        const successText = "Livro devolvido com sucesso.";
        setFeedback({ kind: "success", text: successText });
        toast.success(successText);

        setLoans((current) =>
          current.map((item) =>
            item.id === loanId ? { ...item, status: "devolvido" } : item,
          ),
        );

        await loadLoans().catch(() => {});
        return updated;
      } catch (err) {
        const message = err?.message || "Não foi possível devolver o livro.";
        setFeedback({ kind: "error", text: message });
        toast.error(message);
        throw err;
      } finally {
        setBusyId(null);
      }
    },
    [loadLoans],
  );

  const activeLoans = loans.filter((l) => l.status !== "devolvido");
  const returnedLoans = loans.filter((l) => l.status === "devolvido");

  /** Helper: verifica se ainda há vaga na cota. */
  const canBorrow = useCallback(
    (maxLoans) => {
      const limit = Number(maxLoans);
      if (!Number.isFinite(limit) || limit <= 0) return true;
      return activeLoans.length < limit;
    },
    [activeLoans.length],
  );

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
    renewLoan,
    returnLoan,
    canBorrow,
  };
}
