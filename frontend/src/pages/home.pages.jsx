import { useState, useCallback } from "react";
import { Hero } from "../components/Hero.jsx";
import { BookShelf } from "../components/BookShelf.jsx";
import { QuoteCard } from "../components/QuoteCard.jsx";
import { ActionCards } from "../components/ActionCards.jsx";
import { LoginModal } from "../components/LoginModal.jsx";
import { RegisterModal } from "../components/RegisterModal.jsx";
import { livros } from "../components/livros.jsx";

export function Home() {
  const [indice, setIndice] = useState(0);
  const [modalAberto, setModalAberto] = useState(null);
  const [toast, setToast] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [fade, setFade] = useState(false);

  const livroAtual = livros[indice];

  const mudarLivro = useCallback(
    (i) => {
      if (i === indice) return;

      setFade(true);

      setTimeout(() => {
        setIndice(i);
        setFade(false);
      }, 180);
    },
    [indice],
  );

  const sortear = useCallback(() => {
    let n;

    do {
      n = Math.floor(Math.random() * livros.length);
    } while (n === indice && livros.length > 1);

    mudarLivro(n);
  }, [indice, mudarLivro]);

  const abrirLogin = () => setModalAberto("login");
  const abrirCadastro = () => setModalAberto("cadastro");
  const fecharModal = () => setModalAberto(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const dados = new FormData(form);

    try {
      setCarregando(true);
      setToast("");

      await signIn(dados.get("email"), dados.get("senha"));

      form.reset();
      fecharModal();
      setToast("Login realizado com sucesso!");
    } catch (error) {
      setToast(error.message);
    } finally {
      setCarregando(false);
    }
  };

  const handleCadastro = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const dados = new FormData(form);

    try {
      setCarregando(true);
      setToast("");

      const nome = dados.get("nome");
      const email = dados.get("email");
      const matricula = dados.get("matricula");
      const senha = dados.get("senha");

      await signUp(nome, email, matricula, senha);
      await signIn(email, senha);

      form.reset();
      fecharModal();
      setToast("Conta criada e login realizado com sucesso!");
    } catch (error) {
      setToast(error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="app">
      <main className="main">
        <Hero />

        <section className="shelf-section">
          <BookShelf livros={livros} ativo={indice} onSelect={mudarLivro} />

          <QuoteCard livro={livroAtual} fade={fade} onVirar={sortear} />
        </section>

        <div className="cta-wrap">
          <button className="btn-cta" onClick={abrirLogin}>
            <span className="btn-cta-dot" />
            Entrar no acervo
            <i className="fa-solid fa-chevron-right" />
          </button>
        </div>

        <ActionCards onClick={abrirLogin} />
      </main>

      <LoginModal
        aberto={modalAberto === "login"}
        onFechar={fecharModal}
        onSubmit={handleLogin}
        onAbrirCadastro={abrirCadastro}
      />

      <RegisterModal
        aberto={modalAberto === "cadastro"}
        onFechar={fecharModal}
        onSubmit={handleCadastro}
        onAbrirLogin={abrirLogin}
      />

      {toast && (
        <div className="toast">
          <i className="fa-solid fa-check" />
          Acesso concedido
        </div>
      )}
    </div>
  );
}
