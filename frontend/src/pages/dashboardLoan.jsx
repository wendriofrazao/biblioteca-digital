import { useEffect, useState } from "react";
import { LeftSidebar } from "../components/Sidebar.jsx";
import { LoansView } from "../components/LoansView.jsx";
import { useAuth } from "../context/auth.context.jsx";

export function DashboardLoan({
  usuarioProp,
  dados,
  loans = [],
  onSair,
  onRenewLoan = () => {},
  onReturnLoan = () => {},
  onExploreCatalog = () => {},
}) {
  const {
    user: usuarioAutenticado,
    loading: authLoading,
    loadUser,
    signOut,
  } = useAuth();

  const [activeTab, setActiveTab] = useState("emprestimos");
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  // Busca o perfil quando os dados do usuário ainda não estão disponíveis.
  useEffect(() => {
    if (!usuarioProp && !usuarioAutenticado && !authLoading) {
      void loadUser();
    }
  }, [usuarioProp, usuarioAutenticado, authLoading, loadUser]);

  const usuarioOriginal = usuarioProp ?? usuarioAutenticado ?? {};

  // Normaliza os campos para aceitar diferentes formatos da API.
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

  return (
    <div className="biblioteca-layout">
      <LeftSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        user={usuario}
        loanCount={dados?.emprestimos ?? loans.length}
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
          <LoansView
            loans={loans}
            user={usuarioLoans}
            onRenewLoan={onRenewLoan}
            onReturnLoan={onReturnLoan}
            onExploreCatalog={onExploreCatalog}
          />
        )}
      </main>
    </div>
  );
}
