import "../styles/components/Header.css";

export function Header({ onEntrar, onRegistrar }) {
  return (
    <header className="header">
      <a href="/" className="logo">
        <span className="logo-dot" />
        <span className="logo-text">
          Biblioteca RB<span className="logo-accent">.</span>
        </span>
      </a>

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
