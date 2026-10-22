import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  BookOpen,
  Check,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Tags,
  Trash2,
  Users,
} from "lucide-react";
import { z } from "zod";
import "../styles/components/Staff.css";
import { useIsAdmin } from "../context/auth.context";
import { useLivros } from "../hook/useLivros.jsx";
import { useAutores } from "../hook/useAutores.jsx";
import { useCategorias } from "../hook/useCategorias.jsx";
import { usePerfis } from "../hook/usePerfis.jsx";

const tabs = [
  { key: "livros", label: "Livros", icon: BookOpen },
  { key: "autores", label: "Autores", icon: Pencil },
  { key: "categorias", label: "Categorias", icon: Tags },
  { key: "usuarios", label: "Usuários", icon: Users },
];

const copy = {
  livros: {
    title: "Catalogação de nova obra",
    subtitle: "Títulos, exemplares e informações bibliográficas.",
    action: "Novo livro",
    empty: "Uma nova história para o acervo.",
    note: "Organização do acervo",
    text: "Cada obra reúne seus autores, categoria e localização na biblioteca.",
  },
  autores: {
    title: "Cadastro de autores",
    subtitle: "As pessoas por trás de cada história.",
    action: "Novo autor",
    empty: "Dê lugar a uma nova voz.",
    note: "Autoria compartilhada",
    text: "Uma obra pode ter vários autores. Os vínculos são escolhidos no cadastro do livro.",
  },
  categorias: {
    title: "Organização por categorias",
    subtitle: "Áreas de conhecimento para um acervo bem cuidado.",
    action: "Nova categoria",
    empty: "Um novo caminho para descobrir livros.",
    note: "Mapa do acervo",
    text: "As categorias conectam títulos por assunto e tornam a consulta mais simples.",
  },
  usuarios: {
    title: "Gestão de leitores",
    subtitle: "Acesso à biblioteca e limites de empréstimo.",
    action: "",
    empty: "Selecione um leitor na lista.",
    note: "Acesso e circulação",
    text: "Contas são criadas pela página de entrada. Aqui você acompanha o cadastro e ajusta o acesso.",
  },
};

const simpleSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome.").max(200),
  detail: z.string().trim().max(10000),
});

function Field({ label, children, wide = false }) {
  return (
    <label className={`admin-field ${wide ? "admin-field-wide" : ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function Metric({ label, value, detail, accent = false }) {
  return (
    <article className="admin-metric">
      <p className="admin-eyebrow">{label}</p>
      <p className={`admin-metric-value ${accent ? "accent" : ""}`}>{value}</p>
      <p className="admin-muted">{detail}</p>
    </article>
  );
}

const emptyBook = {
  isbn: "",
  titulo: "",
  categoriaId: "",
  autorId: "",
  anoPublicacao: "",
  quantidade: 0,
  paginas: "",
  editora: "",
  edicao: "",
  idioma: "",
  localizacao: "",
  sinopse: "",
  capaUrl: "",
};

export function AdminPage() {
  const { data: isAdmin, isLoading: checking } = useIsAdmin();
  const booksQuery = useLivros();
  const authorsQuery = useAutores();
  const categoriesQuery = useCategorias();
  const profilesQuery = usePerfis();

  const livros = booksQuery.data ?? [];
  const autores = authorsQuery.data ?? [];
  const categorias = categoriesQuery.data ?? [];
  const perfis = profilesQuery.data ?? [];
  const qc = useQueryClient();

  const [tab, setTab] = useState("livros");
  const [editing, setEditing] = useState(null);
  const [book, setBook] = useState(emptyBook);
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [limit, setLimit] = useState("5");
  const [blocked, setBlocked] = useState(false);
  const [coverFailed, setCoverFailed] = useState(false);

  const user = perfis.find((p) => p.id === userId);
  const content = copy[tab];
  const currentQuery =
    tab === "livros"
      ? booksQuery
      : tab === "autores"
        ? authorsQuery
        : tab === "categorias"
          ? categoriesQuery
          : profilesQuery;

  const query = filter.trim().toLocaleLowerCase("pt-BR");
  const rows =
    tab === "livros"
      ? livros.map((l) => ({
          id: l.id,
          title: l.titulo,
          subtitle: `${l.autores?.nome ?? "Sem autor"} · ISBN ${l.isbn}`,
          detail: `${l.quantidade_disponivel}/${l.quantidade} disponíveis`,
          search: `${l.titulo} ${l.isbn} ${l.autores?.nome ?? ""} ${l.tags.join(" ")}`,
        }))
      : tab === "autores"
        ? autores.map((a) => ({
            id: a.id,
            title: a.nome,
            subtitle: a.biografia ?? "Biografia não informada",
            detail: `${livros.filter((l) => l.livros_autores.some((link) => link.autor_id === a.id) || l.autor_id === a.id).length} obras`,
            search: a.nome,
          }))
        : tab === "categorias"
          ? categorias.map((c) => ({
              id: c.id,
              title: c.nome,
              subtitle: c.descricao ?? "Descrição não informada",
              detail: `${livros.filter((l) => l.categoria_id === c.id).length} obras`,
              search: c.nome,
            }))
          : perfis.map((p) => ({
              id: p.id,
              title: p.nome,
              subtitle: p.email ?? "E-mail não informado",
              detail: p.status === "ATIVO" ? "Ativo" : "Bloqueado",
              search: `${p.nome} ${p.email ?? ""} ${p.matricula ?? ""}`,
            }));

  const filtered = rows.filter((row) =>
    row.search.toLocaleLowerCase("pt-BR").includes(query),
  );

  function fail(error) {
    const message =
      error && typeof error === "object" && "message" in error
        ? String(error.message)
        : "Não foi possível salvar a alteração.";
    toast.error(message);
  }

  function refresh() {
    for (const key of ["livros", "livro", "autores", "categorias", "perfis"]) {
      void qc.invalidateQueries({ queryKey: [key] });
    }
  }

  function switchTab(next) {
    setTab(next);
    setFilter("");
    setEditing(null);
    setOpen(false);
    setUserId(null);
  }

  function newRecord() {
    setEditing(null);
    setBook(emptyBook);
    setName("");
    setDetail("");
    setCoverFailed(false);
    setOpen(true);
  }

  function edit(id) {
    setEditing(id);
    setCoverFailed(false);
    if (tab === "livros") {
      const row = livros.find((l) => l.id === id);
      if (!row) return;
      setBook({
        isbn: row.isbn,
        titulo: row.titulo,
        categoriaId: row.categoria_id ?? "",
        editora: row.editora ?? "",
        anoPublicacao: String(row.ano_publicacao ?? ""),
        quantidade: String(row.quantidade),
        autores: row.livros_autores.length
          ? row.livros_autores.map((a) => a.autor_id)
          : row.autor_id
            ? [row.autor_id]
            : [],
        paginas: String(row.paginas ?? ""),
        edicao: row.edicao ?? "",
        idioma: row.idioma ?? "",
        localizacao: row.localizacao ?? "",
        sinopse: row.descricao ?? "",
        capaUrl: row.capa ?? "",
        tags: row.tags.join(", "),
      });
    } else if (tab === "autores") {
      const row = autores.find((a) => a.id === id);
      if (!row) return;
      setName(row.nome);
      setDetail(row.biografia ?? "");
    } else if (tab === "categorias") {
      const row = categorias.find((c) => c.id === id);
      if (!row) return;
      setName(row.nome);
      setDetail(row.descricao ?? "");
    } else {
      const row = perfis.find((p) => p.id === id);
      if (!row) return;
      setUserId(id);
      setLimit(String(row.limite_emprestimos));
      setBlocked(row.status === "BLOQUEADO");
      return;
    }
    setOpen(true);
  }

  function change(key, value) {
    setBook((old) => ({ ...old, [key]: value }));
    if (key === "capaUrl") setCoverFailed(false);
  }

  async function save(event) {
    event.preventDefault();
    if (!isAdmin || busy) return;
    const parsed =
      tab === "livros"
        ? parseBook(book)
        : simpleSchema.safeParse({ nome: name, detail });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Confira os campos.");
      return;
    }

    setBusy(true);
    try {
      if (tab === "livros") {
        const result = parseBook(book);
        if (!result.success) return;
        const { error } = await supabase.rpc(
          "salvar_livro",
          editing
            ? { _dados: result.data, _id: editing }
            : { _dados: result.data },
        );
        if (error) throw error;
      } else {
        const result = simpleSchema.parse({ nome: name, detail });
        if (tab === "autores") {
          const payload = {
            nome: result.nome,
            biografia: result.detail || null,
          };
          const { error } = editing
            ? await supabase.from("autores").update(payload).eq("id", editing)
            : await supabase.from("autores").insert(payload);
          if (error) throw error;
        } else {
          const payload = {
            nome: result.nome,
            descricao: result.detail || null,
          };
          const { error } = editing
            ? await supabase
                .from("categorias")
                .update(payload)
                .eq("id", editing)
            : await supabase.from("categorias").insert(payload);
          if (error) throw error;
        }
      }
      toast.success(editing ? "Registro atualizado." : "Registro cadastrado.");
      setOpen(false);
      refresh();
    } catch (error) {
      fail(error);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id) {
    if (!isAdmin || busy || tab === "usuarios") return;
    if (tab === "livros") {
      const row = livros.find((l) => l.id === id);
      if (!row) return;
      if (row.quantidade !== row.quantidade_disponivel) {
        toast.error(
          "Não é possível remover um livro com exemplares emprestados.",
        );
        return;
      }
      const { count, error } = await supabase
        .from("emprestimos")
        .select("id", { count: "exact", head: true })
        .eq("livro_id", id);
      if (error) {
        fail(error);
        return;
      }
      if (count) {
        toast.error(
          "Este livro possui histórico de empréstimos e não pode ser excluído. O histórico será preservado.",
        );
        return;
      }
    }
    if (
      !window.confirm("Excluir este registro? Esta ação não pode ser desfeita.")
    )
      return;
    setBusy(true);
    try {
      const table =
        tab === "livros"
          ? "livros"
          : tab === "autores"
            ? "autores"
            : "categorias";
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) {
        if (error.code === "23503") {
          throw new Error(
            "Este registro está vinculado a livros ou empréstimos e não pode ser excluído.",
          );
        }
        throw error;
      }
      toast.success("Registro excluído.");
      refresh();
    } catch (error) {
      fail(error);
    } finally {
      setBusy(false);
    }
  }

  async function saveUser(event) {
    event.preventDefault();
    if (!isAdmin || !user || busy) return;
    const result = z.coerce.number().int().min(0).max(99).safeParse(limit);
    if (!result.success) {
      toast.error("Informe um limite entre 0 e 99.");
      return;
    }
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        limite_emprestimos: result.data,
        status: blocked ? "BLOQUEADO" : "ATIVO",
      })
      .eq("id", user.id);
    setBusy(false);
    if (error) fail(error);
    else {
      toast.success("Usuário atualizado.");
      refresh();
    }
  }

  const safeCover = /^https?:\/\//i.test(book.capaUrl.trim())
    ? book.capaUrl.trim()
    : "";

  if (checking)
    return (
      <main className="admin-page">
        <p>Verificando acesso...</p>
      </main>
    );
  if (!isAdmin)
    return (
      <main className="admin-page">
        <p className="admin-error">Acesso restrito a administradores.</p>
      </main>
    );

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <p className="admin-eyebrow">BIBLIOTECA RB / PAINEL</p>
          <h1>Administração da Biblioteca</h1>
          <p className="admin-muted">
            Curadoria do acervo, organização de exemplares e cuidado com os
            leitores.
          </p>
        </div>
      </header>

      <div className="admin-metrics">
        <Metric
          label="Títulos no catálogo"
          value={livros.length}
          detail="Obras com ficha cadastrada"
        />
        <Metric
          label="Exemplares físicos"
          value={livros.reduce((sum, l) => sum + l.quantidade, 0)}
          detail={`${livros.reduce((sum, l) => sum + l.quantidade_disponivel, 0)} disponíveis`}
        />
        <Metric
          label="Autores & categorias"
          value={`${autores.length} / ${categorias.length}`}
          detail="Vozes e áreas do acervo"
          accent
        />
        <Metric
          label="Leitores ativos"
          value={perfis.filter((p) => p.status === "ATIVO").length}
          detail={`${perfis.length} leitores cadastrados`}
        />
      </div>

      <nav
        className="admin-tabs"
        aria-label="Seções administrativas"
        role="tablist"
      >
        {tabs.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={tab === item.key}
              className={`admin-tab ${tab === item.key ? "active" : ""}`}
              onClick={() => switchTab(item.key)}
            >
              <Icon size={17} /> {item.label}
            </button>
          );
        })}
      </nav>

      <div className="admin-columns">
        <section className="admin-section">
          <div className="admin-section-heading">
            <h2>{tabs.find((t) => t.key === tab)?.label} do acervo</h2>
            <span className="admin-count">{rows.length} registros</span>
          </div>

          <div className="admin-search">
            <Search size={17} />
            <input
              aria-label={`Filtrar ${tab}`}
              placeholder={
                tab === "livros"
                  ? "Título, ISBN, autor ou tag..."
                  : "Buscar na lista..."
              }
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          {currentQuery.isLoading ? (
            <p className="admin-state">Carregando registros...</p>
          ) : currentQuery.isError ? (
            <div className="admin-state admin-error">
              Não foi possível carregar os registros.
              <button
                className="admin-link"
                onClick={() => void currentQuery.refetch()}
              >
                Tentar novamente
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <p className="admin-state">
              {query
                ? "Nenhum registro corresponde à busca."
                : "Nenhum registro cadastrado."}
            </p>
          ) : (
            <div className="admin-record-list">
              {filtered.map((row) => (
                <article key={row.id} className="admin-record">
                  <div className="admin-record-info">
                    <h3>{row.title}</h3>
                    <p className="admin-record-subtitle">{row.subtitle}</p>
                    <p className="admin-record-detail">{row.detail}</p>
                  </div>
                  <div className="admin-record-actions">
                    <button
                      className="admin-icon-button"
                      aria-label={`Editar ${row.title}`}
                      title="Editar"
                      onClick={() => edit(row.id)}
                    >
                      <Pencil size={17} />
                    </button>
                    {tab !== "usuarios" && (
                      <button
                        className="admin-icon-button danger"
                        aria-label={`Excluir ${row.title}`}
                        title="Excluir"
                        disabled={busy}
                        onClick={() => void remove(row.id)}
                      >
                        <Trash2 size={17} />
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="admin-section">
          <div className="admin-section-heading admin-detail-heading">
            <div>
              <h2>{content.title}</h2>
              <p className="admin-muted">{content.subtitle}</p>
            </div>
            {tab !== "usuarios" && (
              <button className="admin-button primary" onClick={newRecord}>
                <Plus size={17} /> {content.action}
              </button>
            )}
          </div>

          {tab === "usuarios" && user ? (
            <form onSubmit={saveUser} className="admin-user-form">
              <div>
                <h3>{user.nome}</h3>
                <p className="admin-muted break-all">{user.email}</p>
                <p className="admin-record-detail">
                  Matrícula {user.matricula ?? "—"}
                </p>
              </div>
              <Field label="Limite de empréstimos">
                <input
                  type="number"
                  min="0"
                  max="99"
                  required
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                />
              </Field>
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={blocked}
                  onChange={(e) => setBlocked(e.target.checked)}
                />{" "}
                Usuário bloqueado
              </label>
              <button
                className="admin-button primary"
                type="submit"
                disabled={busy}
              >
                <Check size={17} /> Salvar usuário
              </button>
            </form>
          ) : (
            <div className="admin-empty">
              <BookOpen size={32} />
              <p>{content.empty}</p>
              {tab !== "usuarios" && (
                <button className="admin-button primary" onClick={newRecord}>
                  <Plus size={17} /> {content.action}
                </button>
              )}
            </div>
          )}

          <div className="admin-note">
            <p>
              <ShieldCheck size={17} /> {content.note}
            </p>
            <span>{content.text}</span>
          </div>
        </section>
      </div>

      {open && (
        <div
          className="admin-modal-backdrop"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !busy) setOpen(false);
          }}
        >
          <section
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-modal-title"
          >
            <header className="admin-modal-header">
              <div>
                <h2 id="admin-modal-title">
                  {editing ? "Editar" : "Cadastrar"}{" "}
                  {tab === "livros"
                    ? "livro"
                    : tab === "autores"
                      ? "autor"
                      : "categoria"}
                </h2>
                <p>
                  {tab === "livros"
                    ? "Ficha bibliográfica e organização dos exemplares."
                    : content.subtitle}
                </p>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                aria-label="Fechar"
                onClick={() => !busy && setOpen(false)}
              >
                ×
              </button>
            </header>

            <form onSubmit={save} className="admin-form">
              {tab === "livros" ? (
                <>
                  <div className="admin-form-grid">
                    <Field label="Título *" wide>
                      <input
                        required
                        maxLength={300}
                        value={book.titulo}
                        onChange={(e) => change("titulo", e.target.value)}
                      />
                    </Field>
                    <Field label="ISBN *">
                      <input
                        required
                        maxLength={32}
                        value={book.isbn}
                        onChange={(e) => change("isbn", e.target.value)}
                      />
                    </Field>
                    <Field label="Categoria">
                      <select
                        value={book.categoriaId || "none"}
                        onChange={(e) =>
                          change(
                            "categoriaId",
                            e.target.value === "none" ? "" : e.target.value,
                          )
                        }
                      >
                        <option value="none">Sem categoria</option>
                        {categorias.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nome}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <fieldset className="admin-author-picker">
                    <legend>Autores</legend>
                    <div className="admin-author-list">
                      {autores.map((a) => (
                        <label key={a.id} className="admin-checkbox">
                          <input
                            type="checkbox"
                            checked={book.autores.includes(a.id)}
                            onChange={(e) =>
                              setBook((old) => ({
                                ...old,
                                autores: e.target.checked
                                  ? [...old.autores, a.id]
                                  : old.autores.filter((id) => id !== a.id),
                              }))
                            }
                          />
                          {a.nome}
                        </label>
                      ))}
                      {!autores.length && (
                        <p className="admin-muted">Nenhum autor cadastrado.</p>
                      )}
                    </div>
                  </fieldset>

                  <div className="admin-form-grid admin-form-divider">
                    <Field label="Editora">
                      <input
                        maxLength={200}
                        value={book.editora}
                        onChange={(e) => change("editora", e.target.value)}
                      />
                    </Field>
                    <Field label="Ano de publicação">
                      <input
                        type="number"
                        min="1000"
                        max="2100"
                        value={book.anoPublicacao}
                        onChange={(e) =>
                          change("anoPublicacao", e.target.value)
                        }
                      />
                    </Field>
                    <Field label="Quantidade *">
                      <input
                        required
                        type="number"
                        min="0"
                        max="100000"
                        value={book.quantidade}
                        onChange={(e) => change("quantidade", e.target.value)}
                      />
                    </Field>
                    <Field label="Páginas">
                      <input
                        type="number"
                        min="1"
                        max="1000000"
                        value={book.paginas}
                        onChange={(e) => change("paginas", e.target.value)}
                      />
                    </Field>
                    <Field label="Edição">
                      <input
                        maxLength={100}
                        value={book.edicao}
                        onChange={(e) => change("edicao", e.target.value)}
                      />
                    </Field>
                    <Field label="Idioma">
                      <input
                        maxLength={100}
                        value={book.idioma}
                        onChange={(e) => change("idioma", e.target.value)}
                      />
                    </Field>
                    <Field label="Localização" wide>
                      <input
                        maxLength={200}
                        placeholder="Estante, corredor ou seção"
                        value={book.localizacao}
                        onChange={(e) => change("localizacao", e.target.value)}
                      />
                    </Field>
                    <Field label="Sinopse" wide>
                      <textarea
                        rows={4}
                        maxLength={10000}
                        value={book.sinopse}
                        onChange={(e) => change("sinopse", e.target.value)}
                      />
                    </Field>
                    <Field label="URL da capa" wide>
                      <input
                        type="url"
                        maxLength={2048}
                        placeholder="https://..."
                        value={book.capaUrl}
                        onChange={(e) => change("capaUrl", e.target.value)}
                      />
                    </Field>
                    {safeCover && !coverFailed && (
                      <div className="admin-cover-preview">
                        <img
                          src={safeCover}
                          alt="Prévia da capa"
                          onError={() => setCoverFailed(true)}
                        />
                      </div>
                    )}
                    {coverFailed && (
                      <p className="admin-muted admin-field-wide">
                        Não foi possível carregar a prévia desta capa.
                      </p>
                    )}
                    <Field label="Tags (separadas por vírgula)" wide>
                      <input
                        maxLength={1529}
                        placeholder="literatura, ficção, clássico"
                        value={book.tags}
                        onChange={(e) => change("tags", e.target.value)}
                      />
                    </Field>
                  </div>
                </>
              ) : (
                <>
                  <Field label="Nome *">
                    <input
                      required
                      maxLength={200}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Field>
                  <Field label={tab === "autores" ? "Biografia" : "Descrição"}>
                    <textarea
                      rows={5}
                      maxLength={10000}
                      value={detail}
                      onChange={(e) => setDetail(e.target.value)}
                    />
                  </Field>
                </>
              )}
              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-button secondary"
                  disabled={busy}
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="admin-button primary"
                  disabled={busy}
                >
                  <Check size={17} />{" "}
                  {busy
                    ? "Salvando..."
                    : editing
                      ? "Salvar alterações"
                      : "Cadastrar"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
