import "../styles/components/LibraryPage.css";

import {
  RedBlackTreeVisualizer,
  TreeLegend,
} from "../components/tree/RedBlackTreeVisualizer.jsx";

import { TreeControls } from "../components/tree/TreeControls.jsx";
import { TreeAnimationControls } from "../components/tree/TreeAnimationControls.jsx";
import { TreeStats } from "../components/tree/TreeStats.jsx";

function DatabaseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      <path d="M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6" />
    </svg>
  );
}

function FlaskIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 3h6M10 3v6.5L4.5 18a2 2 0 0 0 1.7 3h12a2 2 0 0 0 1.7-3L14 9.5V3" />
      <path d="M8.5 14h7" />
    </svg>
  );
}

/**
 * Dual Red-Black Tree workspace:
 * - Catalog (DB): read-only mirror of the real tree stored in the backend
 * - Demo: fully interactive local simulation with step-by-step animation
 */
export function LibraryPage({
  catalogCtl,
  demoCtl,
  onCatalogNodeClick,
  onDemoNodeClick,
}) {
  if (!catalogCtl && !demoCtl) return null;

  return (
    <main className="library-main library-main-dual">
      <header className="library-heading">
        <p className="library-welcome">Painel do catálogo</p>

        <h1>
          Árvore Rubro-Negra<span>.</span>
        </h1>

        <p className="library-subtitle">
          Compare a estrutura real do banco com uma simulação interativa — lado
          a lado, de forma independente.
        </p>
      </header>

      <section className="library-dual-grid">
        {/* ─── Catálogo (banco de dados) ─── */}
        <article className="library-panel library-panel-catalog">
          <header className="library-panel-header">
            <div className="library-panel-badge library-panel-badge-catalog">
              <DatabaseIcon />
              <span>Banco de dados</span>
            </div>
            <h2>Árvore do catálogo</h2>
            <p className="library-panel-desc">
              Estrutura real construída a partir dos livros cadastrados.
              Atualiza conforme o acervo do sistema.
            </p>
          </header>

          <div className="library-panel-tree">
            <div className="library-tree-canvas">
              <RedBlackTreeVisualizer
                snapshot={catalogCtl?.snapshot}
                highlight={catalogCtl?.highlight}
                onNodeClick={onCatalogNodeClick}
                bookFor={catalogCtl?.bookFor}
                compact
              />
            </div>
          </div>

          <div className="library-panel-side">
            <section className="library-workspace-section">
              <h3>Estatísticas</h3>
              <TreeStats ctl={catalogCtl} mode="catalog" />
            </section>

            <section className="library-workspace-section library-legend-section">
              <h3>Legenda</h3>
              <TreeLegend />
            </section>
          </div>
        </article>

        {/* ─── Demonstração interativa ─── */}
        <article className="library-panel library-panel-demo">
          <header className="library-panel-header">
            <div className="library-panel-badge library-panel-badge-demo">
              <FlaskIcon />
              <span>Simulação</span>
            </div>
            <h2>Árvore demonstrativa</h2>
            <p className="library-panel-desc">
              Simulação local e independente. Insira, pesquise e remova valores
              para observar rotações, recolorações e o balanceamento em tempo
              real.
            </p>
          </header>

          <div className="library-panel-tree">
            <div className="library-tree-canvas">
              <RedBlackTreeVisualizer
                snapshot={demoCtl?.snapshot}
                highlight={demoCtl?.highlight}
                onNodeClick={onDemoNodeClick}
                bookFor={demoCtl?.bookFor}
                compact
              />
            </div>
          </div>

          <div className="library-panel-side">
            <section className="library-workspace-section">
              <h3>Operações</h3>
              <TreeControls ctl={demoCtl} mode="demo" />
            </section>

            <section className="library-workspace-section">
              <h3>Animação</h3>
              <TreeAnimationControls ctl={demoCtl} />
            </section>

            <section className="library-workspace-section">
              <h3>Estatísticas</h3>
              <TreeStats ctl={demoCtl} mode="demo" />
            </section>
          </div>
        </article>
      </section>
    </main>
  );
}
