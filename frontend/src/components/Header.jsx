import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import "../styles/components/Header.css";

export function Header({ onEntrar, onRegistrar, user }) {
  const location = useLocation();

  const estaLogado = Boolean(user);
  const caminhoPainel =
    user?.tipo === "ADMIN" || user?.role === "ADMIN"
      ? "/dashboard"
      : "/dashboard";

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
        {estaLogado ? (
          <Link to={caminhoPainel} className="btn-entrar">
            <LayoutDashboard size={17} aria-hidden="true" />
            Ir para o painel
          </Link>
        ) : (
          <>
            <button
              type="button"
              className="btn-registrar"
              onClick={onRegistrar}
            >
              Criar conta
            </button>

            <button type="button" className="btn-entrar" onClick={onEntrar}>
              Entrar
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </header>
  );
}