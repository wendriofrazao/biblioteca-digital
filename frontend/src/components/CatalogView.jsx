import React, { useMemo, useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  X,
  LayoutGrid,
  List,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

import "../styles/components/CatalogView.css";
import { TopHeader } from "../components/TopHeader.jsx";
import { BookService } from "../service/book.service.jsx";

function mapearLivro(livro) {
  const autores = (livro.autores ?? [])
    .map((item) => {
      const autor = item.autor ?? item;
      return autor.nome ?? autor.name ?? "";
    })
    .filter(Boolean);

  const disponiveis = Number(livro.disponiveis ?? livro.quantidade ?? 0);

  return {
    id: livro.id,
    code: livro.isbn ?? "",
    isbn: livro.isbn ?? "",
    title: livro.titulo ?? "Título não informado",
    author: autores.join(", ") || "Autor não informado",
    category:
      livro.categoria?.nome ??
      livro.categoria?.nomeCategoria ??
      livro.categoria?.nome_categoria ??
      "Sem categoria",
    publisher: livro.editora ?? "Editora não informada",
    year: Number(livro.anoPublicacao ?? 0),
    timesBorrowed: Number(livro.vezesEmprestado ?? 0),
    coverUrl: livro.capaUrl ?? "",
    availableCopies: disponiveis,
    status: disponiveis > 0 ? "DISPONÍVEL" : "INDISPONÍVEL",
    tags: Array.isArray(livro.tags) ? livro.tags : [],
    dueDate: null,
    shelfLocation: {
      corredor: livro.localizacao ?? "Corredor não informado",
    },
    paginas: livro.paginas,
    edicao: livro.edicao,
    idioma: livro.idioma,
    sinopse: livro.sinopse,
    quantidade: Number(livro.quantidade ?? 0),
    categoriaId: livro.categoriaId,
    autoresIds: (livro.autores ?? [])
      .map((item) => item.autorId ?? item.autor?.id ?? item.id)
      .filter(Boolean),
  };
}

export function CatalogView({
  books = [],
  onSelectBook,
  onBorrowBook,
  onReserveBook,
  onOpenAdvancedFilters,
  searchTerm = "",
  setSearchTerm = () => {},
  selectedCategory = "",
  setSelectedCategory = () => {},
  selectedPublisher = "",
  setSelectedPublisher = () => {},
  onlyAvailable = false,
  setOnlyAvailable = () => {},
  mostPopular = false,
  setMostPopular = () => {},
  sortBy = "Mais recentes",
  setSortBy = () => {},
  viewMode = "grid",
  setViewMode = () => {},
  currentPage: currentPageProp,
  setCurrentPage: setCurrentPageProp,
  activeTags = [],
  onRemoveTag = () => {},
}) {
  // A paginação funciona tanto controlada pelo componente pai quanto de forma independente.
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const isPaginationControlled =
    currentPageProp !== undefined && typeof setCurrentPageProp === "function";
  const currentPage = isPaginationControlled
    ? currentPageProp
    : internalCurrentPage;
  const setCurrentPage = isPaginationControlled
    ? setCurrentPageProp
    : setInternalCurrentPage;

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPublisherDropdown, setShowPublisherDropdown] = useState(false);
  const [jumpPage, setJumpPage] = useState(String(currentPage));
  const [apiBooks, setApiBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [bookError, setBookError] = useState("");

  // Carrega os livros da API.
  useEffect(() => {
    let ativo = true;

    async function carregarLivros() {
      setLoadingBooks(true);
      setBookError("");

      try {
        const resultado = await BookService.getAllBooks();

        const lista = Array.isArray(resultado)
          ? resultado
          : (resultado?.livros ?? resultado?.data ?? []);

        if (ativo) {
          setApiBooks(lista.map(mapearLivro));
        }
      } catch (error) {
        if (ativo) {
          setBookError(error.message || "Não foi possível carregar os livros.");
        }
      } finally {
        if (ativo) {
          setLoadingBooks(false);
        }
      }
    }

    carregarLivros();

    return () => {
      ativo = false;
    };
  }, []);

  const catalogBooks = books.length > 0 ? books : apiBooks;

  // Monta as opções a partir dos livros existentes.
  const categories = useMemo(() => {
    const valores = catalogBooks
      .map((book) => book.category)
      .filter((category) => category && category !== "Sem categoria");

    return ["Todas as Áreas", ...new Set(valores)];
  }, [catalogBooks]);

  const publishers = useMemo(() => {
    const valores = catalogBooks
      .map((book) => book.publisher)
      .filter(
        (publisher) => publisher && publisher !== "Editora não informada",
      );

    return ["Todas as Editoras", ...new Set(valores)];
  }, [catalogBooks]);

  // Aplica busca e filtros.
  const filteredBooks = useMemo(() => {
    return catalogBooks.filter((book) => {
      const query = searchTerm.trim().toLocaleLowerCase("pt-BR");

      const camposBusca = [
        book.title,
        book.author,
        book.isbn,
        book.category,
        book.code,
        book.publisher,
      ];

      if (
        query &&
        !camposBusca.some((valor) =>
          String(valor ?? "")
            .toLocaleLowerCase("pt-BR")
            .includes(query),
        )
      ) {
        return false;
      }

      if (
        selectedCategory &&
        selectedCategory !== "Todas as Áreas" &&
        book.category !== selectedCategory
      ) {
        return false;
      }

      if (
        selectedPublisher &&
        selectedPublisher !== "Todas as Editoras" &&
        !String(book.publisher ?? "")
          .toLocaleLowerCase("pt-BR")
          .includes(selectedPublisher.toLocaleLowerCase("pt-BR"))
      ) {
        return false;
      }

      if (onlyAvailable && book.status !== "DISPONÍVEL") {
        return false;
      }

      if (
        activeTags.length > 0 &&
        !activeTags.some((tag) => {
          const tagNormalizada = String(tag).toLocaleLowerCase("pt-BR");

          return (
            (book.tags ?? []).some(
              (item) =>
                String(item).toLocaleLowerCase("pt-BR") === tagNormalizada,
            ) ||
            String(book.category ?? "").toLocaleLowerCase("pt-BR") ===
              tagNormalizada
          );
        })
      ) {
        return false;
      }

      return true;
    });
  }, [
    catalogBooks,
    searchTerm,
    selectedCategory,
    selectedPublisher,
    onlyAvailable,
    activeTags,
  ]);

  // Ordena os resultados.
  const sortedBooks = useMemo(() => {
    const lista = [...filteredBooks];

    if (mostPopular || sortBy === "Mais emprestados") {
      return lista.sort(
        (a, b) => (b.timesBorrowed || 0) - (a.timesBorrowed || 0),
      );
    }

    if (sortBy === "Mais recentes") {
      return lista.sort((a, b) => (b.year || 0) - (a.year || 0));
    }

    if (sortBy === "Ordem alfabética (A-Z)") {
      return lista.sort((a, b) =>
        String(a.title || "").localeCompare(String(b.title || ""), "pt-BR", {
          sensitivity: "base",
        }),
      );
    }

    if (sortBy === "Ano de publicação") {
      return lista.sort((a, b) => (a.year || 0) - (b.year || 0));
    }

    return lista;
  }, [filteredBooks, sortBy, mostPopular]);

  // Paginação baseada na quantidade real de resultados.
  const perPage = 12;

  const totalPages = Math.max(1, Math.ceil(sortedBooks.length / perPage));

  const page = Math.min(Math.max(1, Number(currentPage) || 1), totalPages);

  const currentBooks = sortedBooks.slice((page - 1) * perPage, page * perPage);

  // Mantém a página válida quando os resultados mudam.
  useEffect(() => {
    if (Number(currentPage) !== page) {
      setCurrentPage(page);
    }

    setJumpPage(String(page));
  }, [currentPage, page, setCurrentPage]);

  const changePage = (value) => {
    const next = Math.min(Math.max(1, Number(value) || 1), totalPages);

    setCurrentPage(next);
    setJumpPage(String(next));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedPublisher("");
    setOnlyAvailable(false);
    setMostPopular(false);
    setCurrentPage(1);
  };

  const categoryLabel =
    selectedCategory && selectedCategory !== "Todas as Áreas"
      ? selectedCategory
      : "Área do Conhecimento";

  const publisherLabel =
    selectedPublisher && selectedPublisher !== "Todas as Editoras"
      ? selectedPublisher
      : "Editora";

  const renderDropdown = (items, selected, setter, allLabel) =>
    items.map((item) => {
      const active = selected === item || (!selected && item === allLabel);

      return (
        <button
          key={item}
          type="button"
          className={active ? "dropdown-option selected" : "dropdown-option"}
          onClick={() => {
            setter(item === allLabel ? "" : item);
            setShowCategoryDropdown(false);
            setShowPublisherDropdown(false);
            setCurrentPage(1);
          }}
        >
          <span>{item}</span>
          {active && <CheckCircle2 size={14} />}
        </button>
      );
    });

  const bookAction = (book) => {
    if (book.status === "DISPONÍVEL") {
      onBorrowBook?.(book);
    } else {
      onReserveBook?.(book);
    }
  };

  // Exibe uma capa alternativa quando a imagem falha.
  const coverFallback = (event) => {
    const img = event.currentTarget;

    img.onerror = null;
    img.style.display = "none";

    const fallback = img.parentElement?.querySelector(
      ".cover-fallback, .list-cover-fallback",
    );

    fallback?.classList.add("visible");
  };

  const visiblePages = useMemo(() => {
    const pages = [];

    for (let n = 1; n <= totalPages; n++) {
      if (n === 1 || n === totalPages || (n >= page - 1 && n <= page + 1)) {
        pages.push(n);
      }
    }

    return pages;
  }, [page, totalPages]);

  return (
    <main className="catalog-view">
      <TopHeader />

      <section className="catalog-hero">
        <div className="hero-pattern" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>

        <div className="hero-content">
          <div className="eyebrow">
            <span>Acervo Geral</span>
            <span>•</span>
            <strong>
              {catalogBooks.length.toLocaleString("pt-BR")} Obras Registradas
            </strong>
          </div>

          <h1>Catálogo do Acervo</h1>

          <p className="hero-description">
            Explore o acervo completo, consulte exemplares disponíveis e faça
            empréstimos com facilidade.
          </p>

          <div className="catalog-search">
            <Search size={22} className="search-icon" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Busque por título, autor, assunto ou ISBN..."
              aria-label="Buscar no catálogo"
            />

            {searchTerm && (
              <button
                className="icon-button"
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                aria-label="Limpar busca"
              >
                <X size={17} />
              </button>
            )}

            <button
              type="button"
              className="advanced-button"
              onClick={onOpenAdvancedFilters}
            >
              <SlidersHorizontal size={15} />
              Filtros avançados
            </button>

            <button
              type="button"
              className="search-submit"
              onClick={() => setCurrentPage(1)}
            >
              Consultar
            </button>
          </div>

          <div className="quick-filters">
            <span className="filter-intro">Filtrar por:</span>

            <div className="dropdown-wrap">
              <button
                type="button"
                className={`filter-pill ${selectedCategory ? "selected" : ""}`}
                onClick={() => {
                  setShowCategoryDropdown((value) => !value);
                  setShowPublisherDropdown(false);
                }}
                aria-expanded={showCategoryDropdown}
              >
                {categoryLabel}
                <ChevronDown size={14} />
              </button>

              {showCategoryDropdown && (
                <div className="dropdown-menu">
                  {renderDropdown(
                    categories,
                    selectedCategory,
                    setSelectedCategory,
                    "Todas as Áreas",
                  )}
                </div>
              )}
            </div>

            <div className="dropdown-wrap">
              <button
                type="button"
                className={`filter-pill ${selectedPublisher ? "selected" : ""}`}
                onClick={() => {
                  setShowPublisherDropdown((value) => !value);
                  setShowCategoryDropdown(false);
                }}
                aria-expanded={showPublisherDropdown}
              >
                {publisherLabel}
                <ChevronDown size={14} />
              </button>

              {showPublisherDropdown && (
                <div className="dropdown-menu">
                  {renderDropdown(
                    publishers,
                    selectedPublisher,
                    setSelectedPublisher,
                    "Todas as Editoras",
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              className={`filter-pill ${
                onlyAvailable ? "available-active" : ""
              }`}
              onClick={() => {
                setOnlyAvailable(!onlyAvailable);
                setCurrentPage(1);
              }}
            >
              Apenas disponíveis
            </button>

            <button
              type="button"
              className={`filter-pill popular-pill ${
                mostPopular ? "popular-active" : ""
              }`}
              onClick={() => {
                setMostPopular(!mostPopular);
                setCurrentPage(1);
              }}
            >
              Mais procurados
            </button>
          </div>
        </div>
      </section>

      <section className="catalog-toolbar">
        <div className="toolbar-left">
          <p>
            Mostrando{" "}
            <strong>
              {sortedBooks.length > 0 ? (page - 1) * perPage + 1 : 0}
              {" – "}
              {Math.min(page * perPage, sortedBooks.length)}
            </strong>{" "}
            de <strong>{sortedBooks.length.toLocaleString("pt-BR")}</strong>{" "}
            resultados
          </p>

          <div className="active-tags">
            {activeTags.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
                <button
                  type="button"
                  onClick={() => {
                    onRemoveTag(tag);
                    setCurrentPage(1);
                  }}
                  aria-label={`Remover filtro ${tag}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}

            {selectedCategory && (
              <span className="tag category-tag">
                {selectedCategory}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("");
                    setCurrentPage(1);
                  }}
                  aria-label="Remover categoria"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedPublisher && (
              <span className="tag publisher-tag">
                {selectedPublisher}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPublisher("");
                    setCurrentPage(1);
                  }}
                  aria-label="Remover editora"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        </div>

        <div className="toolbar-controls">
          <label className="sort-control">
            <span>Ordenar:</span>

            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value);
                setCurrentPage(1);
              }}
            >
              <option>Mais recentes</option>
              <option>Ordem alfabética (A-Z)</option>
              <option>Mais emprestados</option>
              <option>Ano de publicação</option>
            </select>
          </label>

          <div className="view-switch">
            <button
              type="button"
              className={viewMode === "grid" ? "active" : ""}
              onClick={() => setViewMode("grid")}
              title="Grade de capas"
              aria-label="Grade de capas"
            >
              <LayoutGrid size={16} />
            </button>

            <button
              type="button"
              className={viewMode === "list" ? "active" : ""}
              onClick={() => setViewMode("list")}
              title="Lista detalhada"
              aria-label="Lista detalhada"
            >
              <List size={17} />
            </button>
          </div>
        </div>
      </section>

      {loadingBooks && catalogBooks.length === 0 && (
        <p className="catalog-message" role="status">
          Carregando livros...
        </p>
      )}

      {bookError && catalogBooks.length === 0 && (
        <p className="catalog-error" role="alert">
          {bookError}
        </p>
      )}

      {!loadingBooks && !bookError && currentBooks.length === 0 ? (
        <section className="empty-state">
          <BookOpen size={45} />

          <h2>Nenhuma obra encontrada</h2>

          <p>
            Não encontramos resultados para os filtros selecionados. Tente
            limpar os termos de busca ou filtros ativos.
          </p>

          <button type="button" onClick={clearFilters}>
            Limpar todos os filtros
          </button>
        </section>
      ) : currentBooks.length > 0 ? (
        <section
          className={viewMode === "grid" ? "book-grid" : "book-list"}
          aria-label="Livros do catálogo"
        >
          {currentBooks.map((book) => {
            const available = book.status === "DISPONÍVEL";

            return viewMode === "grid" ? (
              <article
                key={book.id}
                className="book-card"
                role="button"
                tabIndex={0}
                onClick={() => onSelectBook?.(book)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectBook?.(book);
                  }
                }}
              >
                <div className="cover-frame">
                  {book.coverUrl && (
                    <img
                      src={book.coverUrl}
                      alt={`Capa do livro ${book.title}`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={coverFallback}
                    />
                  )}

                  <div
                    className={`cover-fallback ${
                      book.coverUrl ? "" : "visible"
                    }`}
                  >
                    <span>{book.code}</span>
                    <strong>{book.title}</strong>
                    <em>{book.author}</em>
                  </div>

                  <span
                    className={`status-badge ${
                      available ? "available" : "unavailable"
                    }`}
                  >
                    {book.status}
                  </span>

                  <div className="cover-overlay">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        bookAction(book);
                      }}
                    >
                      {available ? "Emprestar" : "Reservar fila"}
                    </button>
                  </div>
                </div>

                <div className="book-info">
                  <span className="book-code">{book.code}</span>

                  <h2>{book.title}</h2>

                  <p className="book-author">{book.author}</p>

                  <div className="book-footer">
                    <span className="publisher-name">{book.publisher}</span>

                    {available ? (
                      <span className="copy-count">
                        {book.availableCopies}{" "}
                        {book.availableCopies === 1
                          ? "ex. livre"
                          : "ex. livres"}
                      </span>
                    ) : (
                      <span className="due-date">Indisponível</span>
                    )}
                  </div>
                </div>
              </article>
            ) : (
              <article
                key={book.id}
                className="list-card"
                role="button"
                tabIndex={0}
                onClick={() => onSelectBook?.(book)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectBook?.(book);
                  }
                }}
              >
                <div className="list-cover-frame">
                  {book.coverUrl && (
                    <img
                      className="list-cover"
                      src={book.coverUrl}
                      alt={`Capa do livro ${book.title}`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={coverFallback}
                    />
                  )}

                  <div
                    className={`list-cover-fallback ${
                      book.coverUrl ? "" : "visible"
                    }`}
                  >
                    <BookOpen size={24} />
                    <span>{book.title}</span>
                  </div>
                </div>

                <div className="list-details">
                  <div className="list-labels">
                    <span className="book-code">{book.code}</span>

                    <span
                      className={`inline-status ${
                        available ? "available" : "unavailable"
                      }`}
                    >
                      {book.status}
                    </span>
                  </div>

                  <h2>{book.title}</h2>

                  <p>{book.author}</p>

                  <div className="list-meta">
                    <span>{book.publisher}</span>
                    <span>·</span>
                    <span>
                      {book.shelfLocation?.corredor || "Corredor não informado"}
                    </span>
                    <span>·</span>
                    <span>ISBN {book.isbn}</span>
                  </div>
                </div>

                <div className="list-actions">
                  <span className={available ? "copy-count" : "due-date"}>
                    {available
                      ? `${book.availableCopies} exemplares livres`
                      : "Indisponível"}
                  </span>

                  <button
                    type="button"
                    className={available ? "borrow-button" : "reserve-button"}
                    onClick={(event) => {
                      event.stopPropagation();
                      bookAction(book);
                    }}
                  >
                    {available ? "Emprestar" : "Reservar"}
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      ) : null}

      <div className="editorial-divider">
        <span>~ sabedoria que resiste ao tempo ~</span>
      </div>

      <nav className="pagination" aria-label="Paginação do catálogo">
        <p>
          Página <strong>{page}</strong> de <strong>{totalPages}</strong>
        </p>

        <div className="pagination-buttons">
          <button
            type="button"
            className="page-direction"
            disabled={page <= 1}
            onClick={() => changePage(page - 1)}
          >
            <ArrowLeft size={14} />
            Anterior
          </button>

          {visiblePages.map((number, index) => {
            const previous = visiblePages[index - 1];

            return (
              <React.Fragment key={number}>
                {previous && number - previous > 1 && (
                  <span className="ellipsis">…</span>
                )}

                <button
                  type="button"
                  className={`page-number ${page === number ? "active" : ""}`}
                  aria-current={page === number ? "page" : undefined}
                  onClick={() => changePage(number)}
                >
                  {number}
                </button>
              </React.Fragment>
            );
          })}

          <button
            type="button"
            className="page-direction"
            disabled={page >= totalPages}
            onClick={() => changePage(page + 1)}
          >
            Próximo
            <ArrowRight size={14} />
          </button>
        </div>

        <form
          className="jump-form"
          onSubmit={(event) => {
            event.preventDefault();
            changePage(jumpPage);
          }}
        >
          <label htmlFor="jump-page">Ir para página:</label>

          <input
            id="jump-page"
            type="number"
            min="1"
            max={totalPages}
            value={jumpPage}
            onChange={(event) => setJumpPage(event.target.value)}
          />

          <button type="submit">Ir</button>
        </form>
      </nav>
    </main>
  );
}
