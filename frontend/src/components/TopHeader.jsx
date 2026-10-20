import { BookOpen, Menu, BookMarked } from "lucide-react";
import "../styles/components/TopHeader.css";

export function TopHeader({
  onOpenMobileMenu,
  activeTab,
  onSelectTab,
  loanCount,
}) {
  return (
    <header className="top-header" data-purpose="top-navigation">
      <div className="top-header-quote">~ entre livros e boas ideias ~</div>
      <div className="top-header-brand">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="mobile-menu-button"
          aria-label="Abrir menu lateral"
        >
          <Menu size={20} strokeWidth={1.75} />
        </button>

        <button
          type="button"
          onClick={() => onSelectTab("painel")}
          className="top-header-logo"
          aria-label="Ir para o painel"
        >

        </button>
      </div>


      <div className="top-header-actions">
        <button
          type="button"
          onClick={() => onSelectTab("emprestimos")}
          className={`loans-button ${
            activeTab === "emprestimos" ? "active" : ""
          }`}
          title="Ver meus empréstimos ativos"
        >
          <BookMarked size={16} strokeWidth={1.75} />

          <span className="loans-button-label">Meus Empréstimos</span>

          {loanCount > 0 && <span className="loans-count">{loanCount}</span>}
        </button>

        <button
          type="button"
          onClick={() => onSelectTab("catalogo")}
          className={`catalog-button ${
            activeTab === "catalogo" ? "active" : ""
          }`}
          aria-label="Acessar acervo geral"
          title="Acessar acervo geral"
        >
          <BookOpen size={20} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}
