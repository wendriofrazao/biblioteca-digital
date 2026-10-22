import { useEffect, useState } from "react";
import { AdminPage } from "../components/Staff.jsx";
import { LeftSidebar } from "../components/Sidebar.jsx";
import { useAuth } from "../context/auth.context.jsx";

export function Staff({
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

  const [activeTab, setActiveTab] = useState("administracao");
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  useEffect(() => {
    if (!usuarioProp && !usuarioAutenticado && !authLoading) {
      void loadUser();
    }
  }, [usuarioProp, usuarioAutenticado, authLoading, loadUser]);

  const usuarioOriginal = usuarioProp ?? usuarioAutenticado ?? {};

  const usuario = {
    ...usuarioOriginal,

    nome:
      usuarioOriginal.nome ??
      usuarioOriginal.name ??
      usuarioOriginal.nomeCompleto ??
      usuarioOriginal.nome_completo ??
      usuarioOriginal.username ??
      usuarioOriginal.email ??
      "Usuário",

    name:
      usuarioOriginal.name ??
      usuarioOriginal.nome ??
      usuarioOriginal.username ??
      usuarioOriginal.email ??
      "Usuário",

    tipo:
      usuarioOriginal.tipo ??
      usuarioOriginal.role ??
      usuarioOriginal.tipoUsuario ??
      usuarioOriginal.tipo_usuario ??
      usuarioOriginal.perfil ??
      "USER",

    role:
      usuarioOriginal.role ??
      usuarioOriginal.tipo ??
      usuarioOriginal.tipoUsuario ??
      usuarioOriginal.tipo_usuario ??
      usuarioOriginal.perfil ??
      "USER",

    matricula:
      usuarioOriginal.matricula ??
      usuarioOriginal.code ??
      usuarioOriginal.codigo ??
      usuarioOriginal.registration ??
      "",

    code:
      usuarioOriginal.code ??
      usuarioOriginal.matricula ??
      usuarioOriginal.codigo ??
      usuarioOriginal.registration ??
      "",
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
        {authLoading && !usuarioProp ? (
          <div className="admin-page">
            <p>Carregando dados do usuário...</p>
          </div>
        ) : (
          <AdminPage />
        )}
      </main>
    </div>
  );
}
