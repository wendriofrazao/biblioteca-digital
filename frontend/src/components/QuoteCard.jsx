export function QuoteCard({ livro, fade, onVirar }) {
  return (
    <div className="card quote-card">
      <div className="quote-header">
        <span className="quote-label">
          <i className="fa-solid fa-bookmark" />
          Entre páginas
        </span>
        <button className="btn-virar" onClick={onVirar}>
          <i className="fa-solid fa-book-open" />
          Virar página
        </button>
      </div>

      <p className={`quote-text ${fade ? 'fade' : ''}`}>{livro.text}</p>

      <div className="quote-footer">
        <span className="quote-author">{livro.author}</span>
        <span className="quote-book">{livro.book}</span>
      </div>
    </div>
  )
}