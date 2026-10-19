import { useState } from "react";
import "../styles/components/HeaderDashboard.css";

export function HeaderDashboard() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="header-dashboard">
      <div className="header-dashboard-container">
        <a href="/" className="header-dashboard-logo">
          <span className="header-dashboard-ponto" />
          Biblioteca RB<span className="header-dashboard-destaque">.</span>
        </a>

        <span className="header-dashboard-frase">
          entre livros e boas ideias
        </span>

        <button
          type="button"
          className="header-dashboard-menu-botao"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuAberto}
          onClick={() => setMenuAberto((aberto) => !aberto)}
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

      {menuAberto && (
        <nav className="header-dashboard-menu">
          <a href="/">Início</a>
          <a href="/catalogo">Catálogo</a>
          <a href="/emprestimos">Empréstimos</a>
          <a href="/arvore-rb">Árvore Rubro-Negra</a>
        </nav>
      )}
    </header>
  );
}
