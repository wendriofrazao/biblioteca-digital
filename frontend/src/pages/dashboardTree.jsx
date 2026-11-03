import { useEffect, useState } from "react";

import { LibraryPage } from "./LibraryPage.jsx";
import { useRedBlackTree } from "../hook/useRedBlackTree.jsx";
import { LeftSidebar } from "../components/Sidebar.jsx";
import { useAuth } from "../context/auth.context.jsx";

export function DashboardTree({ usuarioProp, dados, loans = [], onSair }) {
  const {
    user: usuarioAutenticado,
    loading: authLoading,
    loadUser,
    signOut,
  } = useAuth();

  const ctl = useRedBlackTree();

  const [activeTab, setActiveTab] = useState("catalogo");
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
          <LibraryPage
            ctl={ctl}
            snapshot={ctl.snapshot}
            highlight={ctl.highlight}
            bookFor={ctl.bookFor}
            onNodeClick={ctl.onNodeClick}
          />
        )}
      </main>
    </div>
  );
}
