import { useState } from "react";
import "../../styles/components/tree/TreeStats.css";

function Stat({ label, value, hint }) {
  return (
    <div className="tree-stat" title={hint}>
      <div className="tree-stat-label">{label}</div>
      <div className="tree-stat-value">{value ?? "—"}</div>
    </div>
  );
}

function StatusIcon({ valid }) {
  if (valid) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="tree-status-icon">
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className="tree-status-icon">
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6m0-6-6 6" />
    </svg>
  );
}

export function TreeStats({ ctl, mode = "demo" }) {
  const [order, setOrder] = useState("in");

  if (!ctl) return null;

  const stats = ctl.stats ?? {};
  const result = ctl.result ?? {};
  const step = ctl.step ?? null;

  const validation = stats.validation ?? null;

  const sequences = {
    in: Array.isArray(stats.inOrder) ? stats.inOrder : [],
    pre: Array.isArray(stats.preOrder) ? stats.preOrder : [],
    post: Array.isArray(stats.postOrder) ? stats.postOrder : [],
  };

  const seq = sequences[order];

  const rotations = step
    ? `${step.rotations ?? 0}/${result.rotations ?? 0}`
    : (result.rotations ?? 0);

  const comparisons = step
    ? (step.comparisons ?? 0)
    : (result.comparisons ?? 0);

  const isCatalog = mode === "catalog";

  return (
    <div className="tree-stats-container">
      <div className="tree-stats-grid">
        <Stat label="Nós" value={stats.nodeCount} />

        <Stat
          label="Altura"
          value={stats.height}
          hint="Número de nós no caminho mais longo da raiz até uma folha."
        />

        {!isCatalog && (
          <Stat
            label="Altura negra"
            value={stats.blackHeight}
            hint="Nós pretos da raiz até uma folha NIL."
          />
        )}

        {!isCatalog && <Stat label="Rotações" value={rotations} />}

        {!isCatalog && <Stat label="Comparações" value={comparisons} />}

        {!isCatalog && (
          <Stat label="Recolorações" value={result.recolorings} />
        )}
      </div>

      <div className="tree-last-operation">
        Última operação: <strong>{ctl.lastOp ?? "Nenhuma"}</strong>
      </div>

      {!isCatalog && (
        <>
          <div
            className={
              validation?.valid
                ? "tree-validity tree-validity-ok"
                : validation
                  ? "tree-validity tree-validity-bad"
                  : "tree-validity"
            }
          >
            <StatusIcon valid={Boolean(validation?.valid)} />

            <div className="tree-validity-content">
              <div className="tree-validity-title">
                {!validation
                  ? "Validação não disponível"
                  : validation.valid
                    ? "Todas as 5 propriedades Rubro-Negras são satisfeitas"
                    : "Propriedades violadas"}
              </div>

              {(validation?.errors ?? []).map((error, index) => (
                <div className="tree-validity-error" key={`${error}-${index}`}>
                  {error}
                </div>
              ))}
            </div>
          </div>

          <p className="tree-stats-description">
            Altura negra: contam-se os nós pretos da raiz (incluída) até qualquer
            folha NIL (excluída).
          </p>

          <div className="tree-traversal">
            <div className="tree-traversal-buttons">
              <button
                type="button"
                className={order === "in" ? "active" : ""}
                onClick={() => setOrder("in")}
              >
                Em ordem
              </button>

              <button
                type="button"
                className={order === "pre" ? "active" : ""}
                onClick={() => setOrder("pre")}
              >
                Pré-ordem
              </button>

              <button
                type="button"
                className={order === "post" ? "active" : ""}
                onClick={() => setOrder("post")}
              >
                Pós-ordem
              </button>
            </div>

            <div className="tree-traversal-sequence">
              {seq.length > 0 ? (
                seq.map((value, index) => (
                  <span
                    className="tree-sequence-value"
                    key={`${value}-${index}`}
                  >
                    {value}
                  </span>
                ))
              ) : (
                <span className="tree-sequence-empty">vazio</span>
              )}
            </div>
          </div>
        </>
      )}

      <div className="tree-complexity">
        <div className="tree-complexity-heading">Complexidade</div>

        <div className="tree-complexity-grid">
          {["Pesquisa", "Inserção", "Remoção"].map((label) => (
            <div className="tree-complexity-item" key={label}>
              <div>{label}</div>
              <strong>O(log n)</strong>
            </div>
          ))}
        </div>

        <p className="tree-stats-description">
          Em uma árvore Rubro-Negra válida, a altura é limitada por 2·log₂(n+1),
          garantindo operações de pesquisa, inserção e remoção em O(log n).
        </p>
      </div>
    </div>
  );
}