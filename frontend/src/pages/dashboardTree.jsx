import { useNavigate } from "react-router-dom";

import { LibraryPage } from "./LibraryPage.jsx";
import { useRedBlackTree } from "../hook/useRedBlackTree.jsx";
import { useDemoRedBlackTree } from "../hook/useDemoRedBlackTree.jsx";

/** Mesma chave usada em Catalogo.jsx */
export const OPEN_BOOK_STORAGE_KEY = "biblioteca:openBook";

export function DashboardTree() {
  const navigate = useNavigate();

  const catalogCtl = useRedBlackTree();
  const demoCtl = useDemoRedBlackTree();

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

    navigate(`/catalogo?book=${encodeURIComponent(String(payload.id))}`, {
      state: { openBook: payload },
    });
  }

  return (
    <LibraryPage
      catalogCtl={catalogCtl}
      demoCtl={demoCtl}
      onCatalogNodeClick={handleCatalogNodeClick}
      onDemoNodeClick={(value) => {
        if (value != null) demoCtl.search?.(value);
      }}
    />
  );
}
