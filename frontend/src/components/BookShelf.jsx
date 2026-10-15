import "../styles/components/BookShelf.css";

export function BookShelf({ livros, ativo, onSelect }) {
  return (
    <>
      <div className="spines">
        {livros.map((livro, i) => (
          <div
            key={i}
            className={[
              'spine',
              ativo === i ? 'active' : '',
              livro.hideOnMobile ? 'spine-hide-mobile' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => onSelect(i)}
            title={livro.book}
          >
            <div
              className={`spine-face spine-${livro.color} spine-${livro.height}`}
            >
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <span className="title">{livro.book}</span>
              <span
                className="dot"
                style={{
                  background:
                    livro.color === 'rubro'
                      ? '#faf8f5'
                      : livro.color === 'oliva'
                        ? '#c85a32'
                        : '#e8c547',
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="shelf-base" />
    </>
  )
}