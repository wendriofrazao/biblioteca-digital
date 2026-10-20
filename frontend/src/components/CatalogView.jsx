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
import {BookService} from "../service/book.service.jsx";

function mapearLivro(livro) {
  const autores = (livro.autores ?? [])
    .map((item) => {
      const autor = item.autor ?? item;
      return autor.nome ?? autor.name ?? "";
    })
    .filter(Boolean);

  const disponiveis = Number(livro.disponiveis ?? 0);

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
    shelfLocation: { corredor: livro.localizacao ?? "Corredor não informado" },
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
  currentPage = 1,
  setCurrentPage = () => {},
  activeTags = [],
  onRemoveTag = () => {},
}) {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPublisherDropdown, setShowPublisherDropdown] = useState(false);
  const [jumpPage, setJumpPage] = useState(String(currentPage));
  const [apiBooks, setApiBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [bookError, setBookError] = useState("");

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
        if (ativo) setApiBooks(lista.map(mapearLivro));
      } catch (error) {
        if (ativo) {
          setBookError(error.message || "Não foi possível carregar os livros.");
        }
      } finally {
        if (ativo) setLoadingBooks(false);
      }
    }

    carregarLivros();
    return () => {
      ativo = false;
    };
  }, []);

  const catalogBooks = books.length > 0 ? books : apiBooks;

  const categories = [
    "Todas as Áreas",
    "Literatura Brasileira",
    "Ciências Sociais & Meio Ambiente",
    "Exatas & Design",
    "Comunicação & Jornalismo",
    "Saúde",
    "Direito",
    "Administração & Negócios",
  ];
  const publishers = [
    "Todas as Editoras",
    "Editora Antofágica",
    "Saraiva Universitária",
    "Saraiva",
    "Saraiva Jur",
    "Editora Érica",
    "Átria / Saraiva",
    "Companhia das Letras",
    "Todavia",
    "Rocco",
    "Expressa",
    "Atlas",
  ];

  const filteredBooks = useMemo(
    () =>
      catalogBooks.filter((book) => {
        const query = searchTerm.trim().toLowerCase();
        if (
          query &&
          ![book.title, book.author, book.isbn, book.category, book.code].some(
            (v) =>
              String(v || "")
                .toLowerCase()
                .includes(query),
          )
        )
          return false;
        if (
          selectedCategory &&
          selectedCategory !== "Todas as Áreas" &&
          book.category !== selectedCategory
        )
          return false;
        if (
          selectedPublisher &&
          selectedPublisher !== "Todas as Editoras" &&
          !String(book.publisher || "")
            .toLowerCase()
            .includes(selectedPublisher.toLowerCase())
        )
          return false;
        if (onlyAvailable && book.status !== "DISPONÍVEL") return false;
        if (
          activeTags.length &&
          !activeTags.some(
            (tag) =>
              (book.tags || []).some(
                (t) => String(t).toLowerCase() === tag.toLowerCase(),
              ) ||
              String(book.category || "").toLowerCase() === tag.toLowerCase(),
          )
        )
          return false;
        return true;
      }),
    [
      catalogBooks,
      searchTerm,
      selectedCategory,
      selectedPublisher,
      onlyAvailable,
      activeTags,
    ],
  );

  const sortedBooks = useMemo(() => {
    const list = [...filteredBooks];
    if (mostPopular || sortBy === "Mais emprestados")
      return list.sort(
        (a, b) => (b.timesBorrowed || 0) - (a.timesBorrowed || 0),
      );
    if (sortBy === "Mais recentes")
      return list.sort((a, b) => (b.year || 0) - (a.year || 0));
    if (sortBy === "Ordem alfabética (A-Z)")
      return list.sort((a, b) =>
        String(a.title || "").localeCompare(String(b.title || ""), "pt-BR"),
      );
    if (sortBy === "Ano de publicação")
      return list.sort((a, b) => (a.year || 0) - (b.year || 0));
    return list;
  }, [filteredBooks, sortBy, mostPopular]);

  const perPage = 12;
  const totalPages = Math.max(1, Math.ceil(sortedBooks.length / perPage));
  const pageLimit = Math.max(60, totalPages);
  const page = Math.min(Math.max(1, currentPage), pageLimit);
  const currentBooks = sortedBooks.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    setJumpPage(String(page));
  }, [page]);
  const changePage = (value) => {
    const next = Math.max(1, Math.min(Number(value) || 1, pageLimit));
    setCurrentPage(next);
    setJumpPage(String(next));
    window.scrollTo({ top: 150, behavior: "smooth" });
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

  const bookAction = (book) =>
    book.status === "DISPONÍVEL" ? onBorrowBook?.(book) : onReserveBook?.(book);
  const coverFallback = (event) => {
    event.currentTarget.style.display = "none";
    event.currentTarget.nextElementSibling?.classList.add("visible");
  };

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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Busque por título, autor, assunto ou ISBN..."
              aria-label="Buscar no catálogo"
            />
            {searchTerm && (
              <button
                className="icon-button"
                type="button"
                onClick={() => setSearchTerm("")}
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
              <SlidersHorizontal size={15} /> Filtros avançados
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
                  setShowCategoryDropdown((v) => !v);
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
                  setShowPublisherDropdown((v) => !v);
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
              className={`filter-pill ${onlyAvailable ? "available-active" : ""}`}
              onClick={() => {
                setOnlyAvailable(!onlyAvailable);
                setCurrentPage(1);
              }}
            >
              Apenas disponíveis
            </button>
            <button
              type="button"
              className={`filter-pill popular-pill ${mostPopular ? "popular-active" : ""}`}
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
              {sortedBooks.length ? (page - 1) * perPage + 1 : 0} –{" "}
              {Math.min(page * perPage, sortedBooks.length)}
            </strong>{" "}
            de <strong>{catalogBooks.length.toLocaleString("pt-BR")}</strong>{" "}
            títulos catalogados
          </p>
          <div className="active-tags">
            {activeTags.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
                <button
                  type="button"
                  onClick={() => onRemoveTag(tag)}
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
                  onClick={() => setSelectedCategory("")}
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
                  onClick={() => setSelectedPublisher("")}
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
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
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

      {!loadingBooks && !bookError && !currentBooks.length ? (
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectBook?.(book);
                  }
                }}
              >
                <div className="cover-frame">
                  <img
                    src={book.coverUrl}
                    alt={`Capa do livro ${book.title}`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={coverFallback}
                  />
                  <div className="cover-fallback">
                    <span>{book.code}</span>
                    <strong>{book.title}</strong>
                    <em>{book.author}</em>
                  </div>
                  <span
                    className={`status-badge ${available ? "available" : "unavailable"}`}
                  >
                    {book.status}
                  </span>
                  <div className="cover-overlay">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
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
                      <span className="due-date">
                        Devolução {book.dueDate || "22/Out"}
                      </span>
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectBook?.(book);
                  }
                }}
              >
                <img
                  className="list-cover"
                  src={book.coverUrl}
                  alt={`Capa do livro ${book.title}`}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="list-details">
                  <div className="list-labels">
                    <span className="book-code">{book.code}</span>
                    <span
                      className={`inline-status ${available ? "available" : "unavailable"}`}
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
                      : `Devolução ${book.dueDate || "22/Out"}`}
                  </span>
                  <button
                    type="button"
                    className={available ? "borrow-button" : "reserve-button"}
                    onClick={(e) => {
                      e.stopPropagation();
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
          Página <strong>{page}</strong> de <strong>{pageLimit}</strong>
        </p>
        <div className="pagination-buttons">
          <button
            type="button"
            className="page-direction"
            disabled={page <= 1}
            onClick={() => changePage(page - 1)}
          >
            <ArrowLeft size={14} /> Anterior
          </button>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              type="button"
              className={`page-number ${page === n ? "active" : ""}`}
              onClick={() => changePage(n)}
            >
              {n}
            </button>
          ))}
          <span className="ellipsis">…</span>
          <button
            type="button"
            className={`page-number ${page === pageLimit ? "active" : ""}`}
            onClick={() => changePage(pageLimit)}
          >
            {pageLimit}
          </button>
          <button
            type="button"
            className="page-direction"
            disabled={page >= pageLimit}
            onClick={() => changePage(page + 1)}
          >
            Próximo <ArrowRight size={14} />
          </button>
        </div>
        <form
          className="jump-form"
          onSubmit={(e) => {
            e.preventDefault();
            changePage(jumpPage);
          }}
        >
          <label htmlFor="jump-page">Ir para página:</label>
          <input
            id="jump-page"
            type="number"
            min="1"
            max={pageLimit}
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
          />
        </form>
      </nav>
    </main>
  );
}
