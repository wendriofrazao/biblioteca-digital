import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { LibraryPage } from "./LibraryPage.jsx";
import { useRedBlackTree } from "../hook/useRedBlackTree.jsx";
import { useDemoRedBlackTree } from "../hook/useDemoRedBlackTree.jsx";
import { LeftSidebar } from "../components/Sidebar.jsx";
import { useAuth } from "../context/auth.context.jsx";

/** Mapeia a rota atual para o id da aba da sidebar. */
function tabFromPath(pathname) {
  if (pathname.includes("/tree")) return "arvore";
  if (pathname.includes("/loan")) return "emprestimos";
  if (pathname.includes("/staff")) return "administracao";
  if (pathname.includes("/dashboard") || pathname === "/") return "painel";
  return "arvore";
}

export function DashboardTree({ usuarioProp, dados, loans = [], onSair }) {
  const location = useLocation();

  const {
    user: usuarioAutenticado,
    loading: authLoading,
    loadUser,
    signOut,
  } = useAuth();

  const catalogCtl = useRedBlackTree();
  const demoCtl = useDemoRedBlackTree();

  // Estado inicial alinhado com a rota (esta página é /tree → "arvore")
  const [activeTab, setActiveTab] = useState(() =>
    tabFromPath(location.pathname),
  );
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  // Mantém a aba ativa sincronizada com a URL (corrige o "só ativa no 2º clique")
  useEffect(() => {
    setActiveTab(tabFromPath(location.pathname));
  }, [location.pathname]);

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
            catalogCtl={catalogCtl}
            demoCtl={demoCtl}
            onCatalogNodeClick={(id) => {
              if (id != null) catalogCtl.search?.(id);
            }}
            onDemoNodeClick={(value) => {
              if (value != null) demoCtl.search?.(value);
            }}
          />
        )}
      </main>
    </div>
  );
}
