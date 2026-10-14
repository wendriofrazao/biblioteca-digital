export function Header({ onEntrar }) {
  return (
    <header className="header">
      <a href="#" className="logo">
        <span className="logo-dot" />
        <span className="logo-text">
          Biblioteca RB<span className="logo-accent">.</span>
        </span>
      </a>

      <button className="btn-entrar" onClick={onEntrar}>
        Entrar
        <i className="fa-solid fa-arrow-right" />
      </button>
    </header>
  )
}