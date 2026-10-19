import "../styles/components/QuoteCard.css";

export function QuoteCard({ livro, fade, onVirar }) {
  return (
    <article className={`quote-card ${fade ? "fade" : ""}`} aria-live="polite">
      <span className="quote-label">LIVRO EM DESTAQUE</span>

      <h2>{livro.book}</h2>

      <p className="quote-author">
        {livro.author} · {livro.year}
      </p>

      <div className="quote-divider">
        <span />
      </div>

      <p className="quote-description">“{livro.description}”</p>

      <button type="button" className="quote-button" onClick={onVirar}>
        Descobrir outro livro
        <i className="fa-solid fa-arrow-right" aria-hidden="true" />
      </button>
    </article>
  );
}
