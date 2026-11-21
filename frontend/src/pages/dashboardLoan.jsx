import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { LoansView } from "../components/LoansView.jsx";
import { useAuth } from "../context/auth.context.jsx";
import { useLoans } from "../hook/useLoans.jsx";

export function DashboardLoan({ usuarioProp }) {
  const navigate = useNavigate();
  const { user: usuarioAutenticado } = useAuth();
  const { usuario: layoutUsuario, setLoanCount } = useOutletContext() ?? {};

  const {
    loans,
    loading: loadingLoans,
    error: loanError,
    feedback,
    clearFeedback,
    loadLoans,
    returnLoan,
  } = useLoans();

  const usuarioBase = usuarioProp ?? layoutUsuario ?? usuarioAutenticado ?? {};

  const usuarioLoans = {
    ...usuarioBase,
    maxLoans: Number(usuarioBase.maxLoans) || 5,
  };

  const activeCount = loans.filter((l) => l.status !== "devolvido").length;

  useEffect(() => {
    if (!loadingLoans && !loanError) {
      setLoanCount?.(activeCount);
    }
  }, [activeCount, loadingLoans, loanError, setLoanCount]);

  async function handleReturnLoan(loanId) {
    const ok = window.confirm("Confirmar devolução deste livro?");
    if (!ok) return;

    try {
      await returnLoan(loanId);
    } catch {
      /* feedback já setado no hook */
    }
  }

  function handleRenewLoan() {
    window.alert("Renovação ainda não está disponível no backend.");
  }

  function handleExploreCatalog() {
    navigate("/catalogo");
  }

  return (
    <>
      {loadingLoans && loans.length === 0 && (
        <p style={{ padding: "1.5rem", color: "#64748b" }}>
          Carregando empréstimos...
        </p>
      )}

      {loanError && loans.length === 0 && (
        <p
          role="alert"
          style={{
            padding: "1.5rem",
            color: "#991b1b",
            display: "flex",
            gap: "0.75rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span>{loanError}</span>
          <button
            type="button"
            onClick={() => void loadLoans()}
            style={{
              background: "#0f172a",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "0.4rem 0.75rem",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            Tentar novamente
          </button>
        </p>
      )}

      <LoansView
        loans={loans}
        user={usuarioLoans}
        onRenewLoan={handleRenewLoan}
        onReturnLoan={handleReturnLoan}
        onExploreCatalog={handleExploreCatalog}
      />

      {feedback && (
        <div
          role="status"
          onClick={clearFeedback}
          style={{
            position: "fixed",
            bottom: "1.5rem",
            right: "1.5rem",
            zIndex: 9999,
            padding: "0.75rem 1rem",
            borderRadius: "10px",
            background: feedback.kind === "success" ? "#ecfdf5" : "#fef2f2",
            color: feedback.kind === "success" ? "#065f46" : "#991b1b",
            border: `1px solid ${
              feedback.kind === "success" ? "#a7f3d0" : "#fecaca"
            }`,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            maxWidth: "22rem",
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          {feedback.text}
        </div>
      )}
    </>
  );
}
