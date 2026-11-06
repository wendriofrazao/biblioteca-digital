import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CatalogView } from "../components/CatalogView.jsx";
import { BookDetailModal } from "../components/BookDetailModal.jsx";
import { AdvancedFiltersModal } from "../components/AdvancedFiltersModal.jsx";
import { BookService } from "../service/book.service.jsx";
import { useAuth } from "../context/auth.context.jsx";
import { useLoans } from "../hook/useLoans.jsx";

const OPEN_BOOK_STORAGE_KEY = "biblioteca:openBook";

export function normalizeBook(raw) {
  if (!raw) return null;
  const book = raw.value ?? raw;
  const autores = Array.isArray(book.autores)
    ? book.autores
        .map((item) => item.autor?.nome ?? item.nome ?? item.name)
        .filter(Boolean)
        .join(", ")
    : (book.author ?? book.autor ?? "");
  const disponiveis = Number(
    book.disponiveis ?? book.availableCopies ?? book.quantidade ?? 0,
  );
  const id = book.id ?? book.key ?? raw.id;
  return {
    id,
    code: book.isbn ?? book.code ?? String(id ?? ""),
    isbn: book.isbn ?? "",
    title: book.titulo ?? book.title ?? "Título não informado",
    titulo: book.titulo ?? book.title,
    author: autores || "Autor não informado",
    autor: autores || "Autor não informado",
    category:
      book.categoria?.nome ??
      book.category ??
      book.categoria?.nomeCategoria ??
      "Sem categoria",
    publisher: book.editora ?? book.publisher ?? "Editora não informada",
    editora: book.editora ?? book.publisher,
    year: Number(book.anoPublicacao ?? book.year ?? 0),
    anoPublicacao: book.anoPublicacao ?? book.year,
    coverUrl: book.capaUrl ?? book.coverUrl ?? "",
    capaUrl: book.capaUrl ?? book.coverUrl ?? "",
    availableCopies: disponiveis,
    disponiveis,
    quantidade: Number(book.quantidade ?? disponiveis),
    status: disponiveis > 0 ? "DISPONÍVEL" : "INDISPONÍVEL",
    pages: book.paginas ?? book.pages,
    paginas: book.paginas ?? book.pages,
    edition: book.edicao ?? book.edition,
    edicao: book.edicao ?? book.edition,
    language: book.idioma ?? book.language,
    idioma: book.idioma ?? book.language,
    synopsis: book.sinopse ?? book.synopsis,
    sinopse: book.sinopse ?? book.synopsis,
    shelfLocation: book.localizacao
      ? { corredor: book.localizacao }
      : book.shelfLocation,
    localizacao: book.localizacao,
    autores: book.autores,
    tags: Array.isArray(book.tags) ? book.tags : [],
  };
}

function readStoredOpenBook() {
  try {
    const raw = sessionStorage.getItem(OPEN_BOOK_STORAGE_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(OPEN_BOOK_STORAGE_KEY);
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function Catalogo() {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const user = auth?.user ?? null;
  const { borrow, feedback, clearFeedback, busyId } = useLoans();

  const [livroSelecionado, setLivroSelecionado] = useState(null);

  // Filtros do catálogo (controlados pela página)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPublisher, setSelectedPublisher] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [mostPopular, setMostPopular] = useState(false);
  const [activeTags, setActiveTags] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const openBookFromNavigation = useCallback(async () => {
    const fromState = location.state?.openBook ?? null;
    const fromStorage = readStoredOpenBook();
    const params = new URLSearchParams(location.search);
    const bookIdParam = params.get("book");
    let candidate = fromState ?? fromStorage ?? null;
    if (!candidate && bookIdParam) {
      candidate = { id: Number(bookIdParam) || bookIdParam };
    }
    if (!candidate) return;

    let normalized = normalizeBook(candidate);
    const needsFetch =
      normalized &&
      (!normalized.title || normalized.title === "Título não informado") &&
      normalized.id != null;

    if (needsFetch) {
      try {
        const resultado = await BookService.getAllBooks();
        const lista = Array.isArray(resultado)
          ? resultado
          : (resultado?.livros ?? resultado?.data ?? []);
        const found = lista.find(
          (item) =>
            String(item.id) === String(normalized.id) ||
            String(item.isbn) === String(normalized.id),
        );
        if (found) normalized = normalizeBook(found);
      } catch {
        /* mantém */
      }
    }

    if (normalized) setLivroSelecionado(normalized);
    if (fromState || bookIdParam) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.search, location.pathname, navigate]);

  useEffect(() => {
    void openBookFromNavigation();
  }, [openBookFromNavigation]);

  async function handleBorrow(book) {
    const livroId = book?.id;
    const usuarioId =
      user?.id ?? user?.userId ?? user?.codigo ?? user?.code ?? null;
    if (!livroId) {
      window.alert("Livro inválido.");
      return;
    }
    if (!usuarioId) {
      window.alert("Usuário não identificado. Faça login novamente.");
      return;
    }
    const ok = window.confirm(
      `Confirmar empréstimo de "${book.title ?? book.titulo}" por 14 dias?`,
    );
    if (!ok) return;
    try {
      await borrow({ livroId, usuarioId });
      setLivroSelecionado(null);
    } catch {
      /* feedback no hook */
    }
  }

  function handleReserve(book) {
    window.alert(
      `Reserva registrada para: ${book?.title ?? book?.titulo ?? "obra"} (em breve).`,
    );
  }

  function handleToggleTag(tag) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function handleResetFilters() {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedPublisher("");
    setOnlyAvailable(false);
    setMostPopular(false);
    setActiveTags([]);
  }

  return (
    <div className="biblioteca-layout">
      <CatalogView
        onSelectBook={setLivroSelecionado}
        onBorrowBook={handleBorrow}
        onReserveBook={handleReserve}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedPublisher={selectedPublisher}
        setSelectedPublisher={setSelectedPublisher}
        onlyAvailable={onlyAvailable}
        setOnlyAvailable={setOnlyAvailable}
        mostPopular={mostPopular}
        setMostPopular={setMostPopular}
        activeTags={activeTags}
        onRemoveTag={(tag) =>
          setActiveTags((prev) => prev.filter((t) => t !== tag))
        }
        onOpenAdvancedFilters={() => setShowAdvancedFilters(true)}
      />

      <AdvancedFiltersModal
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedPublisher={selectedPublisher}
        setSelectedPublisher={setSelectedPublisher}
        onlyAvailable={onlyAvailable}
        setOnlyAvailable={setOnlyAvailable}
        mostPopular={mostPopular}
        setMostPopular={setMostPopular}
        activeTags={activeTags}
        onToggleTag={handleToggleTag}
        onResetFilters={handleResetFilters}
      />

      <BookDetailModal
        book={livroSelecionado}
        onClose={() => setLivroSelecionado(null)}
        onBorrow={handleBorrow}
        onReserve={handleReserve}
      />

      {feedback && (
        <div
          role="status"
          onClick={clearFeedback}
          style={{
            position: "fixed",
            bottom: "1.5rem",
            right: "1.5rem",
            zIndex: 9999,
            padding: "0.75rem 1rem",
            borderRadius: "10px",
            background: feedback.kind === "success" ? "#ecfdf5" : "#fef2f2",
            color: feedback.kind === "success" ? "#065f46" : "#991b1b",
            border: `1px solid ${
              feedback.kind === "success" ? "#a7f3d0" : "#fecaca"
            }`,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            maxWidth: "22rem",
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          {busyId === "borrow" ? "Processando empréstimo…" : feedback.text}
        </div>
      )}
    </div>
  );
}
