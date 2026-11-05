import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { LibraryPage } from "./LibraryPage.jsx";
import { useRedBlackTree } from "../hook/useRedBlackTree.jsx";
import { useDemoRedBlackTree } from "../hook/useDemoRedBlackTree.jsx";
import { LeftSidebar } from "../components/Sidebar.jsx";
import { useAuth } from "../context/auth.context.jsx";

/** Mesma chave usada em Catalogo.jsx */
export const OPEN_BOOK_STORAGE_KEY = "biblioteca:openBook";

function tabFromPath(pathname) {
  if (pathname.includes("/tree")) return "arvore";
  if (pathname.includes("/loan")) return "emprestimos";
  if (pathname.includes("/staff")) return "administracao";
  if (pathname.includes("/catalogo") || pathname.includes("/dashboard")) {
    return "painel";
  }
  return "arvore";
}

export function DashboardTree({ usuarioProp, dados, loans = [], onSair }) {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    user: usuarioAutenticado,
    loading: authLoading,
    loadUser,
    signOut,
  } = useAuth();

  const catalogCtl = useRedBlackTree();
  const demoCtl = useDemoRedBlackTree();

  const [activeTab, setActiveTab] = useState(() =>
    tabFromPath(location.pathname),
  );
  const [isOpenMobile, setIsOpenMobile] = useState(false);

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

  /**
   * Clique no nó da Árvore do catálogo:
   * salva o livro e navega para /catalogo abrindo o modal.
   */
  function handleCatalogNodeClick(nodeId) {
    if (nodeId == null) return;

    const bookFromTree = catalogCtl.bookFor?.(nodeId) ?? null;

    const payload = {
      id: bookFromTree?.id ?? bookFromTree?.key ?? nodeId,
      ...(bookFromTree && typeof bookFromTree === "object" ? bookFromTree : {}),
    };

    try {
      sessionStorage.setItem(OPEN_BOOK_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore */
    }

    void catalogCtl.search?.(nodeId);

    // Rota do catálogo no seu app
    navigate(`/catalogo?book=${encodeURIComponent(String(payload.id))}`, {
      state: { openBook: payload },
    });
  }

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
            onCatalogNodeClick={handleCatalogNodeClick}
            onDemoNodeClick={(value) => {
              if (value != null) demoCtl.search?.(value);
            }}
          />
        )}
      </main>
    </div>
  );
}
