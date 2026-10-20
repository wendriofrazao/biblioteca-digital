import { Link, useLocation } from "react-router-dom";
import "../styles/components/Header.css";

export function Header({ onEntrar, onRegistrar }) {
  const location = useLocation();

  return (
    <header className="header">
      <Link to="/" className="logo">
        <span className="logo-dot" />
        <span className="logo-text">
          Biblioteca RB<span className="logo-accent">.</span>
        </span>
      </Link>

      <nav className="header-nav" aria-label="Navegação principal">
        <Link
          to="/"
          className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
        >
          Home
        </Link>

        <Link
          to="/catalogo"
          className={`nav-link ${
            location.pathname === "/catalogo" ? "active" : ""
          }`}
        >
          Catálogo
        </Link>
      </nav>

      <div className="header-actions">
        <button type="button" className="btn-registrar" onClick={onRegistrar}>
          Criar conta
        </button>

        <button type="button" className="btn-entrar" onClick={onEntrar}>
          Entrar
          <i className="fa-solid fa-arrow-right" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
