import { useEffect, useState } from "react";
import {
  X,
  BookOpen,
  MapPin,
  Bookmark,
  CheckCircle,
  Copy,
  Clock,
  ShieldAlert,
} from "lucide-react";
import "../styles/components/BookDetailModal.css";

export function BookDetailModal({
  book,
  onClose,
  onBorrow,
  onReserve,
}) {
  const [copiedAbnt, setCopiedAbnt] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (!book) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [book, onClose]);

  useEffect(() => {
    setCopiedAbnt(false);
    setIsFavorited(false);
  }, [book?.id]);

  if (!book) return null;

  const title = book.title ?? book.titulo ?? "Título não informado";
  const isbn = book.isbn ?? "Não informado";
  const publisher = book.publisher ?? book.editora ?? "Não informado";
  const edition = book.edition ?? book.edicao ?? "Não informada";
  const year = book.year ?? book.anoPublicacao ?? "Não informado";
  const pages = book.pages ?? book.paginas;
  const language = book.language ?? book.idioma ?? "Não informado";
  const synopsis =
    book.synopsis ?? book.sinopse ?? "Sinopse não disponível.";
  const coverUrl = book.coverUrl ?? book.capaUrl;

  const authors = Array.isArray(book.autores)
    ? book.autores
        .map((item) => item.autor?.nome ?? item.nome)
        .filter(Boolean)
        .join(", ")
    : "";

  const author = book.autor ?? authors ?? "Autor não informado";
  const category =
    book.category ?? book.categoria?.nome ?? "Sem categoria";

  const totalCopies = book.totalCopies ?? book.quantidade ?? 0;
  const availableCopies = book.availableCopies ?? book.disponiveis ?? 0;

  const isAvailable =
    typeof book.disponiveis === "number" ||
    typeof book.availableCopies === "number"
      ? availableCopies > 0
      : book.status === "DISPONÍVEL";

  const status = isAvailable ? "DISPONÍVEL" : "INDISPONÍVEL";

  const shelfLocation = book.shelfLocation;
  const physicalLocation =
    typeof shelfLocation === "string"
      ? shelfLocation
      : book.localizacao ?? "";

  const corridor =
    typeof shelfLocation === "object" && shelfLocation !== null
      ? shelfLocation.corredor
      : "Não informado";

  const shelf =
    typeof shelfLocation === "object" && shelfLocation !== null
      ? shelfLocation.estante
      : physicalLocation || "Não informada";

  const shelfNumber =
    typeof shelfLocation === "object" && shelfLocation !== null
      ? shelfLocation.prateleira
      : "Não informada";

  const code = book.code ?? book.id ?? isbn;

  const handleCopyAbnt = async () => {
    const reference =
      `${author.toUpperCase()}. ${title}. ${edition}. ` +
      `${publisher}, ${year}. ${pages ?? "s/p"} p. ISBN ${isbn}.`;

    try {
      await navigator.clipboard.writeText(reference);
      setCopiedAbnt(true);
      window.setTimeout(() => setCopiedAbnt(false), 2500);
    } catch {
      window.prompt("Copie a referência bibliográfica:", reference);
    }
  };

  const handleBorrow = () => {
    onBorrow?.(book);
    onClose();
  };

  const handleReserve = () => {
    onReserve?.(book);
    onClose();
  };

  return (
    <div
      className="book-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="book-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-modal-title"
      >
        <header className="book-modal-header">
          <div className="book-modal-heading">
            <span className="book-modal-dot" />
            <span>
              Ficha catalográfica do acervo · {code}
            </span>
          </div>

          <button
            type="button"
            className="book-modal-close"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            <X size={20} />
          </button>
        </header>

        <div className="book-modal-content">
          <div className="book-modal-grid">
            <aside className="book-modal-aside">
              <div className="book-cover">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={`Capa do livro ${title}`}
                    referrerPolicy="no-referrer"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="book-cover-placeholder">
                    <BookOpen size={42} />
                    <span>Sem capa disponível</span>
                  </div>
                )}

                <span
                  className={`book-status ${
                    isAvailable ? "available" : "unavailable"
                  }`}
                >
                  {status}
                </span>
              </div>

              <div className="book-location-card">
                <h3>
                  <MapPin size={16} />
                  Localização física
                </h3>

                <div className="book-location-details">
                  <div>
                    <span>Ala / Corredor:</span>
                    <strong>{corridor}</strong>
                  </div>

                  <div>
                    <span>Estante:</span>
                    <strong>{shelf}</strong>
                  </div>

                  <div>
                    <span>Prateleira:</span>
                    <strong>{shelfNumber}</strong>
                  </div>
                </div>

                <p>
                  Consulte os bibliotecários caso precise de auxílio
                  para localizar a obra.
                </p>
              </div>
            </aside>

            <div className="book-modal-details">
              <div className="book-main-info">
                <span className="book-category">
                  {category} · {year}
                </span>

                <h2 id="book-modal-title">{title}</h2>

                <p className="book-author">
                  Por <strong>{author}</strong>
                </p>
              </div>

              <div className="book-copy-stats">
                <div>
                  <span>Exemplares</span>
                  <strong>{totalCopies} unidades</strong>
                </div>

                <div>
                  <span>Disponíveis hoje</span>
                  <strong className={isAvailable ? "text-available" : "text-unavailable"}>
                    {availableCopies} para empréstimo
                  </strong>
                </div>

                <div>
                  <span>Prazo padrão</span>
                  <strong>14 dias</strong>
                </div>
              </div>

              <div className="book-specifications">
                <div className="book-spec">
                  <span>Editora</span>
                  <strong>{publisher}</strong>
                </div>

                <div className="book-spec">
                  <span>Edição</span>
                  <strong>{edition}</strong>
                </div>

                <div className="book-spec">
                  <span>ISBN</span>
                  <strong>{isbn}</strong>
                </div>

                <div className="book-spec">
                  <span>Páginas / Idioma</span>
                  <strong>
                    {pages ?? "Não informadas"} páginas · {language}
                  </strong>
                </div>
              </div>

              <div className="book-synopsis">
                <h3>Sinopse e apresentação</h3>
                <p>{synopsis}</p>
              </div>

              <footer className="book-modal-actions">
                {isAvailable ? (
                  <button
                    type="button"
                    className="book-action-primary"
                    onClick={handleBorrow}
                  >
                    <BookOpen size={17} />
                    Realizar empréstimo (14 dias)
                  </button>
                ) : (
                  <button
                    type="button"
                    className="book-action-reserve"
                    onClick={handleReserve}
                  >
                    <Clock size={17} />
                    Entrar na fila de reserva
                  </button>
                )}

                <div className="book-secondary-actions">
                  <button
                    type="button"
                    className={`book-icon-button ${
                      isFavorited ? "favorited" : ""
                    }`}
                    onClick={() => setIsFavorited((previous) => !previous)}
                    title={
                      isFavorited
                        ? "Remover dos favoritos"
                        : "Salvar na estante de leitura"
                    }
                    aria-label="Alternar favorito"
                    aria-pressed={isFavorited}
                  >
                    <Bookmark
                      size={17}
                      fill={isFavorited ? "currentColor" : "none"}
                    />
                  </button>

                  <button
                    type="button"
                    className="book-action-copy"
                    onClick={handleCopyAbnt}
                  >
                    {copiedAbnt ? (
                      <>
                        <CheckCircle size={16} />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Referência ABNT
                      </>
                    )}
                  </button>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
