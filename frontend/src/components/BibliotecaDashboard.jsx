import { NavLink } from "react-router-dom";
import { Icon } from "./Icon";
import "../styles/components/BibliotecaDashboard.css";

const dadosPadrao = {
  titulos: 0,
  exemplares: 0,
  emprestimos: 0,
  atrasos: 0,
  devolucoes: [],
  arvore: {
    nos: 0,
    altura: 0,
    alturaNegra: 0,
    raiz: "—",
  },
};

function Stat({ icon, value, label, badge, badgeTone = "muted", alert = false }) {
  return (
    <article className={`dashboard-stat ${alert ? "is-alert" : ""}`}>
      <div className="stat-top">
        <span className="stat-icon">
          <Icon name={icon} size={18} />
        </span>

        {badge && (
          <span className={`stat-badge stat-badge-${badgeTone}`}>{badge}</span>
        )}
      </div>

      <p className="stat-value">{value ?? 0}</p>
      <p className="stat-label">{label}</p>
    </article>
  );
}

function DashboardContent({ usuario, dados }) {
  const devolucoes = Array.isArray(dados.devolucoes) ? dados.devolucoes : [];
  const arvore = dados.arvore ?? dadosPadrao.arvore;

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <p className="handwritten greeting">~ bom ter você por aqui ~</p>

        <h1>
          Olá, {usuario.nome}
          <span className="title-dot">.</span>
        </h1>

        <p className="dashboard-subtitle">
          Seu acervo e os empréstimos, em um só lugar
        </p>
      </header>

      <div className="dashboard-animated">
        <section className="stats-card" aria-label="Resumo do acervo">
          <div className="stats-grid">
            <Stat
              icon="library"
              value={dados.titulos}
              label="Títulos no acervo"
              badge="TOTAL"
              badgeTone="muted"
            />

            <Stat
              icon="book"
              value={dados.exemplares}
              label="Exemplares disponíveis"
              badge="Livre"
              badgeTone="success"
            />

            <Stat
              icon="repeat"
              value={dados.emprestimos}
              label="Empréstimos ativos"
              badge="EM CURSO"
              badgeTone="muted"
            />

            <Stat
              icon="alert"
              value={dados.atrasos}
              label="Em atraso"
              badge="Atenção"
              badgeTone="warning"
              alert
            />
          </div>
        </section>

        <section className="dashboard-panels">
          <article className="dashboard-card returns-panel">
            <div className="card-header">
              <h2>Devoluções próximas</h2>
              <span className="card-header-meta">Prazo regular</span>
            </div>

            {devolucoes.length > 0 ? (
              <div className="returns-list">
                {devolucoes.map((devolucao, index) => (
                  <div
                    className="return-row"
                    key={`${devolucao.isbn ?? "livro"}-${devolucao.data ?? index}`}
                  >
                    <div className="return-book">
                      <p>{devolucao.titulo ?? "Título não informado"}</p>
                      <span>ISBN {devolucao.isbn ?? "Não informado"}</span>
                    </div>

                    <div className="return-date">
                      <Icon name="calendar" size={14} />
                      <time>{devolucao.data ?? "Data não informada"}</time>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">Nenhuma devolução próxima.</p>
            )}
          </article>

          <article className="dashboard-card tree-panel">
            <div className="card-header">
              <div className="panel-title">
                <Icon name="tree" size={18} />
                <h2>Índice da árvore</h2>
              </div>

              <span className="tree-badge">Red-Black</span>
            </div>

            <dl className="tree-stats">
              <div>
                <dt>Nós indexados</dt>
                <dd className="tree-stat-pill">{arvore.nos ?? 0}</dd>
              </div>

              <div>
                <dt>Altura da árvore</dt>
                <dd className="tree-stat-pill">{arvore.altura ?? 0}</dd>
              </div>

              <div>
                <dt>Altura negra</dt>
                <dd className="tree-stat-pill">{arvore.alturaNegra ?? 0}</dd>
              </div>

              <div>
                <dt>Raiz (ISBN)</dt>
                <dd className="tree-stat-pill">{arvore.raiz ?? "—"}</dd>
              </div>

              <div>
                <dt>Custo de busca</dt>
                <dd className="tree-stat-pill tree-stat-pill-highlight">
                  O(log n)
                </dd>
              </div>
            </dl>

            <div className="tree-panel-footer">
              <NavLink className="tree-link" to="/tree">
                <span className="tree-link-text">
                  Visualizar árvore completa
                </span>
                <span className="tree-link-arrow" aria-hidden="true">
                  →
                </span>
              </NavLink>
            </div>
          </article>
        </section>
      </div>

      <footer className="dashboard-footer">
        <span className="footer-brand">
          <span className="footer-dot" />
          Biblioteca RB
        </span>

        <span className="handwritten footer-note">14 dias de empréstimo</span>
      </footer>
    </div>
  );
}

export function BibliotecaDashboard({ usuario: usuarioProp, dados }) {
  const usuarioOriginal = usuarioProp ?? {};

  const nome =
    usuarioOriginal.nome ??
    usuarioOriginal.name ??
    usuarioOriginal.username ??
    usuarioOriginal.email ??
    "Usuário";

  const usuario = {
    ...usuarioOriginal,
    nome,
    name: usuarioOriginal.name ?? nome,
    tipo: usuarioOriginal.tipo ?? usuarioOriginal.role ?? "USER",
    role: usuarioOriginal.role ?? usuarioOriginal.tipo ?? "USER",
    matricula: usuarioOriginal.matricula ?? usuarioOriginal.code ?? "",
    code: usuarioOriginal.code ?? usuarioOriginal.matricula ?? "",
  };

  // Combina os dados recebidos com os valores padrão.
  const dadosSeguros = {
    ...dadosPadrao,
    ...(dados ?? {}),
    arvore: {
      ...dadosPadrao.arvore,
      ...(dados?.arvore ?? {}),
    },
    devolucoes: Array.isArray(dados?.devolucoes) ? dados.devolucoes : [],
  };

  return <DashboardContent usuario={usuario} dados={dadosSeguros} />;
}
