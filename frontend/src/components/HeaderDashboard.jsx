import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/components/HeaderDashboard.css";

export function HeaderDashboard({ isMobileMenuOpen, onToggleMobileMenu }) {
  const [menuAbertoLocal, setMenuAbertoLocal] = useState(false);

  const isControlled = typeof onToggleMobileMenu === "function";
  const menuAberto = isControlled ? Boolean(isMobileMenuOpen) : menuAbertoLocal;

  const handleToggleMenu = () => {
    if (isControlled) {
      onToggleMobileMenu();
      return;
    }

    setMenuAbertoLocal((aberto) => !aberto);
  };

  return (
    <header className="header-dashboard">
      <div className="header-dashboard-container">
        <Link to="/" className="header-dashboard-logo">
          <span className="header-dashboard-ponto" />
          Biblioteca RB<span className="header-dashboard-destaque">.</span>
        </Link>

        <span className="header-dashboard-frase">
          entre livros e boas ideias
        </span>

        <button
          type="button"
          className="header-dashboard-menu-botao"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuAberto}
          onClick={handleToggleMenu}
        >
          {menuAberto ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="m18 6-12 12M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 5h16" />
              <path d="M4 12h16" />
              <path d="M4 19h16" />
            </svg>
          )}
        </button>

        <svg
          className="header-dashboard-livro"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 7v14" />
          <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
        </svg>
      </div>

      {!isControlled && menuAberto && (
        <nav className="header-dashboard-menu">
          <Link to="/" onClick={() => setMenuAbertoLocal(false)}>
            Início
          </Link>
          <Link to="/catalogo" onClick={() => setMenuAbertoLocal(false)}>
            Catálogo
          </Link>
          <Link to="/dashboard" onClick={() => setMenuAbertoLocal(false)}>
            Painel
          </Link>
          <Link to="/loan" onClick={() => setMenuAbertoLocal(false)}>
            Empréstimos
          </Link>
          <Link to="/tree" onClick={() => setMenuAbertoLocal(false)}>
            Árvore Rubro-Negra
          </Link>
        </nav>
      )}
    </header>
  );
}
