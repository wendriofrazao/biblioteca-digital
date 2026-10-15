import { useEffect } from "react";
import "../styles/components/LoginModal.css";

export function LoginModal({ aberto, onFechar, onSubmit, onAbrirCadastro }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onFechar();
    };

    if (aberto) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => document.removeEventListener("keydown", handleEsc);
  }, [aberto, onFechar]);

  return (
    <div
      className={`modal-overlay ${aberto ? "open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
    >
      <div
        className="card modal-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
      >
        <button
          type="button"
          className="modal-close"
          onClick={onFechar}
          aria-label="Fechar"
        >
          <i className="fa-solid fa-xmark" aria-hidden="true" />
        </button>

        <div>
          <p className="modal-eyebrow">Acervo restrito</p>
          <h3 id="login-title" className="modal-title">
            Entrar no acervo
          </h3>
        </div>

        <form className="modal-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="matricula">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="nome_exemplo@gmail.com"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              name="senha"
              type="password"
              required
              placeholder="Digite sua senha"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn-submit">
            <i className="fa-solid fa-right-to-bracket" aria-hidden="true" />
            <span>Confirmar e entrar</span>
          </button>
        </form>

        <p className="modal-switch">
          Ainda não tem uma conta?{" "}
          <button
            type="button"
            className="modal-link"
            onClick={onAbrirCadastro}
          >
            Criar conta
          </button>
        </p>
      </div>
    </div>
  );
}
