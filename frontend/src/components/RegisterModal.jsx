import { useEffect } from "react";
import "../styles/components/LoginModal.css";

export function RegisterModal({ aberto, onFechar, onSubmit, onAbrirLogin }) {
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
        aria-labelledby="register-title"
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
          <p className="modal-eyebrow">Novo leitor</p>
          <h3 id="register-title" className="modal-title">
            Criar conta
          </h3>
        </div>

        <form className="modal-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="reg-nome">Nome</label>
            <input
              id="reg-nome"
              name="nome"
              type="text"
              required
              placeholder="Seu nome completo"
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">E-mail</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              required
              placeholder="voce@email.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-matricula">Matrícula</label>
            <input
              id="reg-matricula"
              name="matricula"
              type="text"
              required
              placeholder="MAT-884096"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-senha">Senha</label>
            <input
              id="reg-senha"
              name="senha"
              type="password"
              required
              placeholder="Mínimo de 6 caracteres"
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          <button type="submit" className="btn-submit">
            <i className="fa-solid fa-user-plus" aria-hidden="true" />
            <span>Cadastrar e entrar</span>
          </button>
        </form>

        <p className="modal-switch">
          Já tem uma conta?{" "}
          <button type="button" className="modal-link" onClick={onAbrirLogin}>
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
}
