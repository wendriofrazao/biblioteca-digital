import { NavLink } from "react-router-dom";
import { useState } from "react";
import { LeftSidebar } from "./Sidebar";
import { Icon } from "./Icon";
import "../styles/components/BibliotecaDashboard.css";

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

export function BibliotecaDashboard({
  usuario: usuarioProp,
  dados = dadosExemplo,
  onSair = () => {},
}) {
  const usuario = usuarioProp ?? {
    nome: "Usuário",
    tipo: "USER",
    matricula: "",
  };
  const [activeTab, setActiveTab] = useState("painel");
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  return (
    <div className="biblioteca-layout">
      <LeftSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        user={usuario}
        loanCount={dados?.emprestimos ?? 0}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
        onSwitchUser={onSair}
      />

      <main className="biblioteca-main">
        <DashboardContent usuario={usuario} dados={dados} />
      </main>
    </div>
  );
}
