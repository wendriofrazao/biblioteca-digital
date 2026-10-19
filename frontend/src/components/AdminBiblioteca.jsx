import { useMemo, useState } from "react";
import "../styles/components/AdminBiblioteca.css";

const ABAS = ["Livros", "Autores", "Categorias", "Usuários"];

export function AdminBiblioteca({
  livros = [],
  autores = [],
  categorias = [],
  usuarios = [],
  onCadastrarLivro,
  onEditarLivro,
  onExcluirLivro,
}) {
  const [abaAtiva, setAbaAtiva] = useState("Livros");
  const [filtro, setFiltro] = useState("");
  const [formulario, setFormulario] = useState({
    isbn: "",
    titulo: "",
    quantidade: 1,
    autor_id: "",
    categoria_id: "",
    editora: "",
    ano_publicacao: "",
    descricao: "",
  });

  const livrosFiltrados = useMemo(() => {
    const busca = filtro.trim().toLowerCase();

    return livros.filter((livro) => {
      return (
        (livro.titulo ?? "").toLowerCase().includes(busca) ||
        String(livro.isbn ?? "").toLowerCase().includes(busca) ||
        (livro.autores?.nome ?? "").toLowerCase().includes(busca)
      );
    });
  }, [livros, filtro]);

  function atualizarCampo(event) {
    const { name, value } = event.target;

    setFormulario((atual) => ({
      ...atual,
      [name]: value,
    }));
  }

  async function cadastrarLivro(event) {
    event.preventDefault();

    if (!onCadastrarLivro) return;

    await onCadastrarLivro({
      ...formulario,
      quantidade: Number(formulario.quantidade),
      ano_publicacao: formulario.ano_publicacao
        ? Number(formulario.ano_publicacao)
        : null,
    });

    setFormulario({
      isbn: "",
      titulo: "",
      quantidade: 1,
      autor_id: "",
      categoria_id: "",
      editora: "",
      ano_publicacao: "",
      descricao: "",
    });
  }

  function renderLivros() {
    return (
      <>
        <form className="admin-formulario" onSubmit={cadastrarLivro}>
          <h2>Cadastrar livro</h2>

          <div className="admin-form-grid">
            <label className="admin-campo">
              ISBN
              <input
                name="isbn"
                value={formulario.isbn}
                onChange={atualizarCampo}
                required
              />
            </label>

            <label className="admin-campo admin-campo-titulo">
              Título
              <input
                name="titulo"
                value={formulario.titulo}
                onChange={atualizarCampo}
                required
              />
            </label>

            <label className="admin-campo">
              Exemplares
              <input
                name="quantidade"
                type="number"
                min="0"
                value={formulario.quantidade}
                onChange={atualizarCampo}
                required
              />
            </label>

            <label className="admin-campo">
              Autor
              <select
                name="autor_id"
                value={formulario.autor_id}
                onChange={atualizarCampo}
              >
                <option value="">Selecione</option>
                {autores.map((autor) => (
                  <option key={autor.id} value={autor.id}>
                    {autor.nome}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-campo">
              Categoria
              <select
                name="categoria_id"
                value={formulario.categoria_id}
                onChange={atualizarCampo}
              >
                <option value="">Selecione</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-campo">
              Editora
              <input
                name="editora"
                value={formulario.editora}
                onChange={atualizarCampo}
              />
            </label>

            <label className="admin-campo">
              Ano de publicação
              <input
                name="ano_publicacao"
                type="number"
                min="1000"
                max="2100"
                value={formulario.ano_publicacao}
                onChange={atualizarCampo}
              />
            </label>
          </div>

          <label className="admin-campo admin-descricao">
            Descrição
            <textarea
              name="descricao"
              value={formulario.descricao}
              onChange={atualizarCampo}
              rows="3"
            />
          </label>

          <div className="admin-form-acoes">
            <button className="admin-botao-primario" type="submit">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Cadastrar livro
            </button>
          </div>
        </form>

        <div className="admin-lista-cabecalho">
          <h2>Livros</h2>

          <input
            className="admin-filtro"
            aria-label="Filtrar livros"
            placeholder="Filtrar lista..."
            value={filtro}
            onChange={(event) => setFiltro(event.target.value)}
          />
        </div>

        <div className="admin-lista">
          {livrosFiltrados.map((livro) => (
            <div className="admin-item" key={livro.id}>
              <div className="admin-item-info">
                <p className="admin-item-titulo">{livro.titulo}</p>

                <p className="admin-item-detalhes">
                  {livro.autores?.nome ?? "Autor não informado"}
                  {" · ISBN "}
                  {livro.isbn}
                  {" · "}
                  {livro.quantidade_disponivel ?? 0}/
                  {livro.quantidade ?? 0} disponíveis
                </p>
              </div>

              <div className="admin-item-acoes">
                <button
                  type="button"
                  className="admin-icone-botao"
                  aria-label={`Editar ${livro.titulo}`}
                  title="Editar"
                  onClick={() => onEditarLivro?.(livro)}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                    <path d="m15 5 4 4" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="admin-icone-botao admin-icone-excluir"
                  aria-label={`Excluir ${livro.titulo}`}
                  title="Excluir"
                  onClick={() => onExcluirLivro?.(livro)}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 11v6M14 11v6M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {livrosFiltrados.length === 0 && (
            <p className="admin-lista-vazia">
              Nenhum livro encontrado.
            </p>
          )}
        </div>
      </>
    );
  }

  function renderConteudoAba() {
    if (abaAtiva === "Livros") return renderLivros();

    const dados = {
      Autores: autores,
      Categorias: categorias,
      Usuários: usuarios,
    }[abaAtiva] ?? [];

    return (
      <section className="admin-outra-aba">
        <h2>{abaAtiva}</h2>
        <p>
          {dados.length}{" "}
          {dados.length === 1 ? "registro encontrado" : "registros encontrados"}.
        </p>
        <p>
          Conecte aqui os formulários e as operações de gerenciamento de{" "}
          {abaAtiva.toLowerCase()}.
        </p>
      </section>
    );
  }

  return (
    <main className="admin-conteudo">
      <div className="admin-container">
        <header className="admin-pagina-cabecalho">
          <p className="admin-frase">~ cuidando da nossa biblioteca ~</p>

          <h1>
            Administração<span>.</span>
          </h1>

          <p className="admin-subtitulo">
            Gestão do acervo e usuários
          </p>
        </header>

        <div className="admin-animacao">
          <div
            className="admin-abas"
            role="tablist"
            aria-label="Seções administrativas"
          >
            {ABAS.map((aba) => (
              <button
                key={aba}
                type="button"
                role="tab"
                aria-selected={abaAtiva === aba}
                className={`admin-aba ${
                  abaAtiva === aba ? "admin-aba-ativa" : ""
                }`}
                onClick={() => setAbaAtiva(aba)}
              >
                {aba}
              </button>
            ))}
          </div>

          {renderConteudoAba()}
        </div>

        <footer className="admin-rodape">
          <span className="admin-rodape-logo">
            <span />
            Biblioteca RB
          </span>

          <span className="admin-rodape-frase">
            14 dias de empréstimo
          </span>
        </footer>
      </div>
    </main>
  );
}