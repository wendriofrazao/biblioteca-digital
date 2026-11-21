import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

function getBookField(book, fields, fallback = "") {
  for (const field of fields) {
    const value = book?.[field];

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return fallback;
}

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
  compact = false,
}) {
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

  const hoveredNode =
    hovered?.id != null ? safeSnapshot.nodes?.[hovered.id] : null;

  const hoveredBook =
    hoveredNode && bookFor
      ? bookFor(hoveredNode.value ?? hoveredNode.id)
      : null;

  const bookTitle = getBookField(
    hoveredBook,
    ["titulo", "title", "nome"],
    hoveredNode ? `Valor ${hoveredNode.value}` : "Livro sem título",
  );

  const bookYear = getBookField(
    hoveredBook,
    ["ano", "year", "anoPublicacao", "ano_publicacao"],
    "Ano não informado",
  );

  const bookAuthor = getAuthorName(hoveredBook);

  function handleWheel(event) {
    event.preventDefault();
    setHovered(null);

    setView((current) => ({
      ...current,
      k: Math.min(4, Math.max(0.3, current.k * (event.deltaY < 0 ? 1.1 : 0.9))),
    }));
  }

  function handlePointerDown(event) {
    if (event.button !== 0) return;

    setHovered(null);
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

  /** Clique no nó: apenas notifica o pai (DashboardTree decide navegar). */
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

  function getTooltipPosition(rect) {
    if (!rect || typeof window === "undefined") {
      return { left: 0, top: 0, placement: "bottom" };
    }

    const tooltipWidth = 256;
    const tooltipHeight = 88;
    const gap = 12;
    const margin = 12;

    const rawLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
    const left = Math.min(
      Math.max(rawLeft, margin),
      Math.max(margin, window.innerWidth - tooltipWidth - margin),
    );

    const fitsBelow =
      rect.bottom + gap + tooltipHeight <= window.innerHeight - margin;
    const top = fitsBelow
      ? rect.bottom + gap
      : Math.max(margin, rect.top - tooltipHeight - gap);

    return { left, top, placement: fitsBelow ? "bottom" : "top" };
  }

  const tooltipStyle =
    hoveredBook && hovered?.rect ? getTooltipPosition(hovered.rect) : null;

  return (
    <div className={`tree-canvas ${compact ? "tree-canvas-compact" : ""}`}>
      {empty ? (
        <div className="tree-empty">
          <div className="tree-empty-icon" />

          <p className="tree-empty-title">A árvore está vazia</p>

          <p className="tree-empty-description">
            {compact
              ? "Carregue o catálogo ou insira valores na demonstração."
              : "Insira um valor ou carregue o exemplo."}
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
                {edges.map(({ from, to }) => {
                  const start = pos[from];
                  const end = pos[to];

                  if (!start || !end) return null;

                  const active =
                    path.has(from) &&
                    (path.has(to) ||
                      safeHighlight.current === to ||
                      safeHighlight.found === to);

                  const rotating = rotated.has(from) || rotated.has(to);

                  return (
                    <line
                      key={`${from}-${to}-${safeHighlight.animKey ?? 0}`}
                      x1={start.x}
                      y1={start.y}
                      x2={end.x}
                      y2={end.y}
                      className={[
                        "tree-edge",
                        active ? "edge-active" : "",
                        rotating ? "edge-rotate" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    />
                  );
                })}

                {nodes.map((node) => {
                  const point = pos[node.id];

                  if (!point) return null;

                  const ring = getNodeRing(node);
                  const isRecolored = recolored.has(node.id);
                  const isCurrent =
                    safeHighlight.current === node.id ||
                    safeHighlight.newNode === node.id;
                  const isRotated = rotated.has(node.id);
                  const isFound = safeHighlight.found === node.id;
                  const isRemoved = safeHighlight.removed === node.id;
                  const isOnPath = path.has(node.id);

                  const nodeClass = [
                    "tree-node",
                    isCurrent ? "is-current" : "",
                    isRotated ? "is-rotated" : "",
                    isRecolored ? "is-recolored" : "",
                    isFound ? "is-found" : "",
                    isRemoved ? "is-removed" : "",
                    isOnPath ? "is-on-path" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <g
                      key={`${node.id}-${safeHighlight.animKey ?? 0}-${node.color}`}
                      transform={`translate(${point.x}, ${point.y})`}
                      className={nodeClass}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleNodeClick(node.value ?? node.id)}
                      onPointerEnter={(event) => {
                        const rect =
                          event.currentTarget.getBoundingClientRect();
                        setHovered({
                          id: node.id,
                          rect: {
                            left: rect.left,
                            top: rect.top,
                            bottom: rect.bottom,
                            width: rect.width,
                          },
                        });
                      }}
                      onPointerLeave={() =>
                        setHovered((current) =>
                          current?.id === node.id ? null : current,
                        )
                      }
                    >
                      <title>
                        {`${node.value} (${
                          node.color === "RED" ? "vermelho" : "preto"
                        }) — clique para ver o livro`}
                      </title>

                      {ring && (
                        <circle r={R + 10} className={`node-halo ${ring}`} />
                      )}

                      {ring && (
                        <circle r={R + 6} className={`node-ring ${ring}`} />
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
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        </div>
      )}

      {hoveredBook &&
        tooltipStyle &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="tooltip"
            className="book-tooltip-portal"
            style={{
              left: `${tooltipStyle.left}px`,
              top: `${tooltipStyle.top}px`,
            }}
          >
            <p className="book-tooltip-portal-title">{bookTitle}</p>
            <p className="book-tooltip-portal-sub">
              {`${bookAuthor} · ${bookYear}`}
            </p>
            <p className="book-tooltip-portal-hint">
              Clique para ver os detalhes
            </p>
          </div>,
          document.body,
        )}

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
