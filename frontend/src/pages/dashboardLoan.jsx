import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LeftSidebar } from "../components/Sidebar.jsx";
import { LoansView } from "../components/LoansView.jsx";
import { useAuth } from "../context/auth.context.jsx";
import { useLoans } from "../hook/useLoans.jsx";

export function DashboardLoan({ usuarioProp, dados, onSair }) {
  const navigate = useNavigate();

  const {
    user: usuarioAutenticado,
    loading: authLoading,
    loadUser,
    signOut,
  } = useAuth();

  const {
    loans,
    loading: loadingLoans,
    error: loanError,
    feedback,
    clearFeedback,
    loadLoans,
    returnLoan,
  } = useLoans();

  const [activeTab, setActiveTab] = useState("emprestimos");
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  useEffect(() => {
    if (!usuarioProp && !usuarioAutenticado && !authLoading) {
      void loadUser();
    }
  }, [usuarioProp, usuarioAutenticado, authLoading, loadUser]);

  const usuarioOriginal = usuarioProp ?? usuarioAutenticado ?? {};

  const nomeUsuario =
    usuarioOriginal.name ??
    usuarioOriginal.nome ??
    usuarioOriginal.nomeCompleto ??
    usuarioOriginal.nome_completo ??
    usuarioOriginal.username ??
    usuarioOriginal.email ??
    "Usuário";

  const matriculaUsuario =
    usuarioOriginal.code ??
    usuarioOriginal.matricula ??
    usuarioOriginal.codigo ??
    usuarioOriginal.registration ??
    "";

  const tipoUsuario =
    usuarioOriginal.tipo ??
    usuarioOriginal.role ??
    usuarioOriginal.tipoUsuario ??
    usuarioOriginal.tipo_usuario ??
    usuarioOriginal.perfil ??
    "USER";

  const usuario = {
    ...usuarioOriginal,
    name: nomeUsuario,
    nome: nomeUsuario,
    code: matriculaUsuario,
    matricula: matriculaUsuario,
    tipo: tipoUsuario,
    role: tipoUsuario,
  };

  const usuarioLoans = {
    ...usuario,
    maxLoans: Number(usuarioOriginal.maxLoans) || 5,
  };

  const handleSair = onSair ?? signOut;

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

  const activeCount = loans.filter((l) => l.status !== "devolvido").length;

  return (
    <div className="biblioteca-layout">
      <LeftSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        user={usuario}
        loanCount={dados?.emprestimos ?? activeCount}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
        onSwitchUser={handleSair}
      />

      <main className="biblioteca-main">
        {authLoading && !usuarioProp && !usuarioAutenticado ? (
          <div className="admin-page">
            <p>Carregando dados do usuário...</p>
          </div>
        ) : (
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
          </>
        )}
      </main>

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
    </div>
  );
}
