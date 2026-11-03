import "../styles/components/LibraryPage.css";

import {
  RedBlackTreeVisualizer,
  TreeLegend,
} from "../components/tree/RedBlackTreeVisualizer.jsx";

import { TreeControls } from "../components/tree/TreeControls.jsx";
import { TreeAnimationControls } from "../components/tree/TreeAnimationControls.jsx";
import { TreeStats } from "../components/tree/TreeStats.jsx";

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 7v14" />
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
    </svg>
  );
}

function BranchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M15 6a9 9 0 0 0-9 9V3" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
      <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
      <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function SummaryItem({ icon, value, label }) {
  return (
    <div className="library-summary-item">
      <div className="library-summary-icon">{icon}</div>
      <p className="library-summary-value">{value}</p>
      <span className="library-summary-label">{label}</span>
    </div>
  );
}

export function LibraryPage({
  ctl,
  snapshot,
  highlight,
  bookFor,
  onNodeClick,
}) {
  if (!ctl || !ctl.stats) return null;

  const { stats } = ctl;

  return (
    <main className="library-main">
      <header className="library-heading">
        <p className="library-welcome">Painel do catálogo</p>

        <h1>
          Árvore Rubro-Negra<span>.</span>
        </h1>

        <p className="library-subtitle">
          Seu acervo e o índice da árvore, em um só lugar
        </p>
      </header>

      <section className="library-summary">
        <SummaryItem
          icon={<BookIcon />}
          value={stats.nodeCount}
          label="Nós no acervo"
        />

        <SummaryItem
          icon={<BranchIcon />}
          value={stats.height}
          label="Altura da árvore"
        />

        <SummaryItem
          icon={<LayersIcon />}
          value={stats.blackHeight}
          label="Altura negra"
        />

        <SummaryItem
          icon={<ShieldIcon />}
          value={stats.validation.valid ? "Válida" : "Inválida"}
          label="Estado da árvore"
        />
      </section>

      <section className="library-workspace">
        <div className="library-workspace-main">
          <div className="library-tree">
            <div className="library-tree-canvas">
              <RedBlackTreeVisualizer
                snapshot={snapshot}
                highlight={highlight}
                onNodeClick={onNodeClick}
                bookFor={bookFor}
              />
            </div>
          </div>

          <div className="library-workspace-note">
            <p>Índice do catálogo</p>
            <TreeLegend />
          </div>
        </div>

        <aside className="library-workspace-side">
          <section className="library-workspace-section">
            <h2>Operações</h2>
            <TreeControls ctl={ctl} />
          </section>

          <section className="library-workspace-section">
            <h2>Animação</h2>
            <TreeAnimationControls ctl={ctl} />
          </section>

          <section className="library-workspace-section">
            <h2>Estatísticas</h2>
            <TreeStats ctl={ctl} />
          </section>
        </aside>
      </section>
    </main>
  );
}
