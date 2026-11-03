import { useMemo, useRef, useState } from "react";
import "../../styles/components/tree/RedBlackTreeVisualizer.css";

const GAP_X = 56;
const GAP_Y = 84;
const R = 21;
const PAD = 48;

/**
 * Calcula a posição dos nós usando percurso em ordem.
 * A profundidade define a posição vertical.
 */
export function layoutTree(snapshot) {
  const safeSnapshot = snapshot ?? {
    rootId: null,
    nodes: {},
  };

  const pos = {};
  let index = 0;
  let maxDepth = 0;

  const walk = (id, depth) => {
    if (id == null) return;

    const node = safeSnapshot.nodes?.[id];

    if (!node) return;

    walk(node.left, depth + 1);

    pos[id] = {
      x: index * GAP_X,
      y: depth * GAP_Y,
    };

    index += 1;
    maxDepth = Math.max(maxDepth, depth);

    walk(node.right, depth + 1);
  };

  walk(safeSnapshot.rootId, 0);

  return {
    pos,
    width: Math.max(index - 1, 0) * GAP_X,
    height: maxDepth * GAP_Y,
  };
}

// Obtém o primeiro campo válido de um livro.
function getBookField(book, fields, fallback = "") {
  for (const field of fields) {
    const value = book?.[field];

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return fallback;
}

// Formata o nome do autor, independentemente do formato retornado pela API.
function getAuthorName(book) {
  const author =
    book?.author ?? book?.autor ?? book?.autores ?? book?.bookAuthor ?? null;

  if (typeof author === "string") return author;

  if (Array.isArray(author)) {
    return author
      .map((item) =>
        typeof item === "string" ? item : (item?.nome ?? item?.name ?? ""),
      )
      .filter(Boolean)
      .join(", ");
  }

  return author?.nome ?? author?.name ?? "Autor não informado";
}

export function RedBlackTreeVisualizer({
  snapshot,
  highlight,
  onNodeClick,
  bookFor,
}) {
  // Evita erros quando as propriedades chegam como null.
  const safeSnapshot = snapshot ?? {
    rootId: null,
    nodes: {},
  };

  const safeHighlight = highlight ?? {};

  const { pos, width, height } = useMemo(
    () => layoutTree(safeSnapshot),
    [safeSnapshot],
  );

  const [view, setView] = useState({
    k: 1,
    x: 0,
    y: 0,
  });

  const [hovered, setHovered] = useState(null);

  const drag = useRef(null);
  const suppressClick = useRef(false);

  const vbW = Math.max(width + PAD * 2, 320);
  const vbH = Math.max(height + PAD * 2, 240);

  const offX = (vbW - width) / 2;

  // Destaques da árvore.
  const path = new Set(safeHighlight.path ?? []);
  const rotated = new Set(safeHighlight.rotated ?? []);
  const recolored = new Set(safeHighlight.recolored ?? []);
  const related = new Set(safeHighlight.related ?? []);

  const nodes = Object.values(safeSnapshot.nodes ?? {});
  const edges = [];

  nodes.forEach((node) => {
    if (node.left != null) {
      edges.push({
        from: node.id,
        to: node.left,
      });
    }

    if (node.right != null) {
      edges.push({
        from: node.id,
        to: node.right,
      });
    }
  });

  const empty = safeSnapshot.rootId == null;

  const hoveredNode = hovered != null ? safeSnapshot.nodes?.[hovered] : null;

  const hoveredBook =
    hoveredNode && bookFor ? bookFor(hoveredNode.value) : null;

  const hoveredPos = hoveredNode ? pos[hoveredNode.id] : null;

  // Dados do livro para o tooltip.
  const bookTitle = getBookField(
    hoveredBook,
    ["titulo", "title", "nome"],
    "Livro sem título",
  );

  const bookYear = getBookField(
    hoveredBook,
    ["ano", "year", "anoPublicacao", "ano_publicacao"],
    "Ano não informado",
  );

  const bookAuthor = getAuthorName(hoveredBook);

  function handleWheel(event) {
    event.preventDefault();

    setView((current) => ({
      ...current,
      k: Math.min(4, Math.max(0.3, current.k * (event.deltaY < 0 ? 1.1 : 0.9))),
    }));
  }

  function handlePointerDown(event) {
    if (event.button !== 0) return;

    drag.current = {
      x: event.clientX,
      y: event.clientY,
      moved: false,
    };

    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function handlePointerMove(event) {
    if (!drag.current) return;

    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;

    if (Math.abs(dx) + Math.abs(dy) > 3) {
      drag.current.moved = true;
    }

    drag.current.x = event.clientX;
    drag.current.y = event.clientY;

    if (drag.current.moved) {
      setView((current) => ({
        ...current,
        x: current.x + dx,
        y: current.y + dy,
      }));
    }
  }

  function handlePointerUp() {
    const moved = drag.current?.moved;

    drag.current = null;

    if (moved) {
      suppressClick.current = true;

      window.setTimeout(() => {
        suppressClick.current = false;
      }, 0);
    }
  }

  function handleNodeClick(value) {
    if (suppressClick.current) return;

    onNodeClick?.(value);
  }

  function zoomIn() {
    setView((current) => ({
      ...current,
      k: Math.min(4, current.k * 1.2),
    }));
  }

  function zoomOut() {
    setView((current) => ({
      ...current,
      k: Math.max(0.3, current.k / 1.2),
    }));
  }

  function resetView() {
    setView({
      k: 1,
      x: 0,
      y: 0,
    });
  }

  function getNodeRing(node) {
    if (safeHighlight.removed === node.id) {
      return "ring-removed";
    }

    if (safeHighlight.found === node.id) {
      return "ring-found";
    }

    if (
      safeHighlight.current === node.id ||
      safeHighlight.newNode === node.id
    ) {
      return "ring-current";
    }

    if (rotated.has(node.id)) {
      return "ring-rotated";
    }

    if (recolored.has(node.id)) {
      return "ring-recolor";
    }

    if (related.has(node.id)) {
      return "ring-related";
    }

    if (path.has(node.id)) {
      return "ring-path";
    }

    return "";
  }

  const tooltipWidth = 240;

  const tooltipX = hoveredPos
    ? Math.min(
        Math.max(hoveredPos.x - tooltipWidth / 2, -offX + 4),
        vbW - offX - tooltipWidth - 4,
      )
    : 0;

  return (
    <div className="tree-canvas">
      {empty ? (
        <div className="tree-empty">
          <div className="tree-empty-icon" />

          <p className="tree-empty-title">A árvore está vazia</p>

          <p className="tree-empty-description">
            Insira um valor ou carregue o exemplo.
          </p>
        </div>
      ) : (
        <div
          className={`tree-viewport ${drag.current ? "is-dragging" : ""}`}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onLostPointerCapture={handlePointerUp}
        >
          <div
            className="tree-transform"
            style={{
              transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`,
            }}
          >
            <svg
              viewBox={`0 0 ${vbW} ${vbH}`}
              className="tree-svg"
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="Árvore Rubro-Negra"
            >
              <g transform={`translate(${offX}, ${PAD})`}>
                {/* Conexões entre os nós */}
                {edges.map(({ from, to }) => {
                  const start = pos[from];
                  const end = pos[to];

                  if (!start || !end) return null;

                  const active =
                    path.has(from) &&
                    (path.has(to) ||
                      safeHighlight.current === to ||
                      safeHighlight.found === to);

                  return (
                    <line
                      key={`${from}-${to}`}
                      x1={start.x}
                      y1={start.y}
                      x2={end.x}
                      y2={end.y}
                      className={`tree-edge ${active ? "edge-active" : ""}`}
                    />
                  );
                })}

                {/* Nós da árvore */}
                {nodes.map((node) => {
                  const point = pos[node.id];

                  if (!point) return null;

                  const ring = getNodeRing(node);
                  const isRecolored = recolored.has(node.id);

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${point.x}, ${point.y})`}
                      className="tree-node"
                      onClick={() => handleNodeClick(node.value)}
                      onPointerEnter={() => setHovered(node.id)}
                      onPointerLeave={() =>
                        setHovered((current) =>
                          current === node.id ? null : current,
                        )
                      }
                    >
                      <title>
                        {`${node.value} (${
                          node.color === "RED" ? "vermelho" : "preto"
                        }) — clique para ver o livro`}
                      </title>

                      {ring && (
                        <circle r={R + 7} className={`node-ring ${ring}`} />
                      )}

                      <circle
                        r={R}
                        className={
                          node.color === "RED" ? "node-red" : "node-black"
                        }
                      />

                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="node-label"
                      >
                        {node.value}
                      </text>

                      {isRecolored && (
                        <animateTransform
                          attributeName="transform"
                          type="scale"
                          values="1;1.16;1"
                          dur="0.5s"
                          repeatCount="1"
                        />
                      )}
                    </g>
                  );
                })}

                {/* Tooltip com os dados reais do livro */}
                {hoveredBook && hoveredPos && (
                  <g
                    pointerEvents="none"
                    transform={`translate(${tooltipX}, ${
                      hoveredPos.y + R + 14
                    })`}
                    className="book-tooltip"
                  >
                    <rect
                      width={tooltipWidth}
                      height="78"
                      rx="10"
                      className="book-tooltip-bg"
                    />

                    <text x="14" y="24" className="book-tooltip-title">
                      {String(bookTitle).length > 30
                        ? `${String(bookTitle).slice(0, 29)}…`
                        : bookTitle}
                    </text>

                    <text x="14" y="44" className="book-tooltip-sub">
                      {`${bookAuthor} · ${bookYear}`}
                    </text>

                    <text x="14" y="62" className="book-tooltip-hint">
                      Clique para ver os detalhes
                    </text>
                  </g>
                )}
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* Controles de zoom */}
      <div className="tree-controls">
        <button
          type="button"
          className="tree-control-button"
          aria-label="Aproximar"
          title="Aproximar"
          onClick={zoomIn}
        >
          +
        </button>

        <button
          type="button"
          className="tree-control-button"
          aria-label="Afastar"
          title="Afastar"
          onClick={zoomOut}
        >
          −
        </button>

        <button
          type="button"
          className="tree-control-button tree-fit-button"
          aria-label="Ajustar ao ecrã"
          title="Ajustar ao ecrã"
          onClick={resetView}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function TreeLegend() {
  const items = [
    ["legend-red", "Nó vermelho (RED)"],
    ["legend-black", "Nó preto (BLACK)"],
    ["legend-current", "Nó atual / novo"],
    ["legend-path", "Percurso"],
    ["legend-rotated", "Rotação"],
    ["legend-recolor", "Recoloração"],
    ["legend-found", "Encontrado"],
    ["legend-removed", "A remover"],
  ];

  return (
    <ul className="tree-legend">
      {items.map(([className, label]) => (
        <li key={className}>
          <span className={`legend-dot ${className}`} />
          {label}
        </li>
      ))}
    </ul>
  );
}
