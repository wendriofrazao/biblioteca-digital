import { useEffect } from 'react'

export function LoginModal({ aberto, onFechar, onSubmit }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onFechar()
    }
    if (aberto) document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [aberto, onFechar])

  return (
    <div
      className={`modal-overlay ${aberto ? 'open' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onFechar()
      }}
    >
      <div className="card modal-box">
        <button className="modal-close" onClick={onFechar} aria-label="Fechar">
          <i className="fa-solid fa-xmark" />
        </button>

        <div>
          <p className="modal-eyebrow">Acervo restrito</p>
          <h3 className="modal-title">Entrar no acervo</h3>
        </div>

        <form className="modal-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="matricula">Matrícula</label>
            <input
              id="matricula"
              type="text"
              required
              placeholder="MAT-884096"
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn-submit">
            Confirmar e entrar
          </button>
        </form>
      </div>
    </div>
  )
}