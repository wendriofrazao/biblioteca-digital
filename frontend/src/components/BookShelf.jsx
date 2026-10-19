
import "../styles/components/BookShelf.css";

export function BookShelf({ livros, ativo, onSelect }) {
  return (
    <div className="shelf">
      <div className="books-container">
        {livros.map((livro, i) => (
          <button
            key={livro.book}
            type="button"
            className={`book ${ativo === i ? "selected" : ""}`}
            style={{
              "--c": livro.hexColor,
              "--h":
                livro.height === "alto"
                  ? i === 2
                    ? "212px"
                    : "222px"
                  : livro.height === "baixo"
                    ? "188px"
                    : "196px",
              "--w":
                livro.width === "largo"
                  ? i === 2
                    ? "56px"
                    : "58px"
                  : livro.width === "estreito"
                    ? "50px"
                    : "52px",
            }}
            onClick={() => onSelect(i)}
            aria-pressed={ativo === i}
            aria-label={`${livro.book}, ${livro.author}`}
            title={livro.book}
          >
            <span className="band t" />
            <span className="band t2" />
            <span className="band b2" />
            <span className="band b" />

            <span className="plate">
              <span>{livro.book}</span>
            </span>

            <span className="mark" />
          </button>
        ))}

        <div className="board" />
      </div>
    </div>
  );
}
