import { useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { Hero } from "../components/Hero.jsx";
import { BookShelf } from "../components/BookShelf.jsx";
import { QuoteCard } from "../components/QuoteCard.jsx";
import { ActionCards } from "../components/ActionCards.jsx";
import { livros } from "../components/livros.jsx";

export function Home() {
  const [indice, setIndice] = useState(0);
  const [fade, setFade] = useState(false);

  const { abrirLogin } = useOutletContext();

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

  return (
    <div className="app">
      <main className="main">
        <Hero />

        <section className="shelf-section">
          <BookShelf livros={livros} ativo={indice} onSelect={mudarLivro} />
          <QuoteCard livro={livroAtual} fade={fade} onVirar={sortear} />
        </section>

        <div className="cta-wrap">
          <button type="button" className="btn-cta" onClick={abrirLogin}>
            <span className="btn-cta-dot" />
            Entrar no acervo
            <i className="fa-solid fa-chevron-right" />
          </button>
        </div>

        <ActionCards onClick={abrirLogin} />
      </main>
    </div>
  );
}
