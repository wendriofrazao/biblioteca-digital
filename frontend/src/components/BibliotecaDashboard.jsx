import { NavLink } from "react-router-dom";
import "../styles/components/BibliotecaDashboard.css";

function Icon({ name, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const paths = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </>
    ),
    library: (
      <>
        <path d="m16 6 4 14" />
        <path d="M12 6v14" />
        <path d="M8 8v12" />
        <path d="M4 4v16" />
      </>
    ),
    book: (
      <>
        <path d="M12 7v14" />
        <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
      </>
    ),
    repeat: (
      <>
        <path d="m17 2 4 4-4 4" />
        <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
        <path d="m7 22-4-4 4-4" />
        <path d="M21 13v1a4 4 0 0 1-4 4H3" />
      </>
    ),
    tree: (
      <>
        <path d="M15 6a9 9 0 0 0-9 9V3" />
        <circle cx="18" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
      </>
    ),
    shield: (
      <>
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    logout: (
      <>
        <path d="m16 17 5-5-5-5" />
        <path d="M21 12H9" />
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      </>
    ),
    calendar: (
      <>
        <path d="M16 14v2.2l1.6 1" />
        <path d="M16 2v4" />
        <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" />
        <path d="M3 10h5" />
        <path d="M8 2v4" />
        <circle cx="16" cy="16" r="6" />
      </>
    ),
    alert: (
      <>
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </>
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
}

const navigation = [
  {
    label: "Painel",
    to: "/dashboard",
    icon: "dashboard",
    end: true,
  },
  {
    label: "Catálogo",
    to: "/catalogo",
    icon: "library",
  },
  {
    label: "Empréstimos",
    to: "/emprestimos",
    icon: "repeat",
  },
  {
    label: "Árvore RB",
    to: "/arvore",
    icon: "tree",
  },
];

function Sidebar({ usuario, onSair }) {
  return (
    <aside className="biblioteca-sidebar">
      <div>
        <p className="sidebar-label">Sua biblioteca</p>

        <nav className="sidebar-nav" aria-label="Navegação da biblioteca">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `sidebar-link${isActive ? " active" : ""}`
              }
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>

              {item.label === "Painel" && <span className="active-dot" />}
            </NavLink>
          ))}

          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `sidebar-link admin-link${isActive ? " active" : ""}`
            }
          >
            <Icon name="shield" />
            <span>Administração</span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-account">
        <p className="account-name">{usuario.nome}</p>

        <p className="account-detail">
          {usuario.tipo} · {usuario.matricula}
        </p>

        <button type="button" className="logout-button" onClick={onSair}>
          <Icon name="logout" size={16} />
          Sair da biblioteca
        </button>
      </div>
    </aside>
  );
}

function Stat({ icon, value, label }) {
  return (
    <article className="dashboard-stat">
      <Icon name={icon} size={21} />
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
    </article>
  );
}

function DashboardContent({ usuario, dados }) {
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
        <section className="stats-grid" aria-label="Resumo do acervo">
          <Stat
            icon="library"
            value={dados.titulos}
            label="Títulos no acervo"
          />

          <Stat
            icon="book"
            value={dados.exemplares}
            label="Exemplares disponíveis"
          />

          <Stat
            icon="repeat"
            value={dados.emprestimos}
            label="Empréstimos ativos"
          />

          <Stat icon="alert" value={dados.atrasos} label="Em atraso" />
        </section>

        <section className="dashboard-panels">
          <article className="editorial-section returns-panel">
            <h2>Devoluções próximas</h2>

            {dados.devolucoes.length > 0 ? (
              <div className="returns-list">
                {dados.devolucoes.map((devolucao) => (
                  <div
                    className="return-row"
                    key={`${devolucao.isbn}-${devolucao.data}`}
                  >
                    <div className="return-book">
                      <p>{devolucao.titulo}</p>
                      <span>ISBN {devolucao.isbn}</span>
                    </div>

                    <div className="return-date">
                      <Icon name="calendar" size={16} />
                      <time>{devolucao.data}</time>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">Nenhuma devolução próxima.</p>
            )}
          </article>

          <article className="tree-panel">
            <div className="panel-title">
              <Icon name="tree" size={21} />
              <h2>Índice da árvore</h2>
            </div>

            <dl className="tree-stats">
              <div>
                <dt>Nós indexados</dt>
                <dd>{dados.arvore.nos}</dd>
              </div>

              <div>
                <dt>Altura da árvore</dt>
                <dd>{dados.arvore.altura}</dd>
              </div>

              <div>
                <dt>Altura negra</dt>
                <dd>{dados.arvore.alturaNegra}</dd>
              </div>

              <div>
                <dt>Raiz (ISBN)</dt>
                <dd>{dados.arvore.raiz}</dd>
              </div>

              <div>
                <dt>Custo de busca</dt>
                <dd>O(log n)</dd>
              </div>
            </dl>

            <NavLink className="tree-link" to="/arvore">
              Visualizar árvore
              <span aria-hidden="true">→</span>
            </NavLink>
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

const dadosExemplo = {
  titulos: 12,
  exemplares: 62,
  emprestimos: 1,
  atrasos: 0,

  devolucoes: [
    {
      titulo: "1984",
      isbn: "9788535914849",
      data: "17/10/2026",
    },
  ],

  arvore: {
    nos: 12,
    altura: 5,
    alturaNegra: 4,
    raiz: "9788535911614",
  },
};

export function BibliotecaDashboard({
  usuario: usuarioProp,
  dados = dadosExemplo,
  onSair = () => {},
}) {
  const usuario = usuarioProp ?? {
    nome: "wendriomelo",
    tipo: "Administrador",
    matricula: "MAT-884096",
  };

  return (
    <div className="biblioteca-layout">
      <Sidebar usuario={usuario} onSair={onSair} />

      <main className="biblioteca-main">
        <DashboardContent usuario={usuario} dados={dados} />
      </main>
    </div>
  );
}
