import { useState } from "react";
import "../../styles/components/tree/TreeStats.css";

function Stat({ label, value, hint }) {
  return (
    <div className="tree-stat" title={hint}>
      <div className="tree-stat-label">{label}</div>
      <div className="tree-stat-value">{value}</div>
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

export function TreeStats({ ctl }) {
  const [order, setOrder] = useState("in");

  if (!ctl) return null;

  const { stats, result, step } = ctl;

  const sequences = {
    in: stats.inOrder,
    pre: stats.preOrder,
    post: stats.postOrder,
  };

  const seq = sequences[order] || [];

  const rotations = step
    ? `${step.rotations}/${result?.rotations ?? 0}`
    : (result?.rotations ?? 0);

  const comparisons = step ? step.comparisons : (result?.comparisons ?? 0);

  return (
    <div className="tree-stats-container">
      <div className="tree-stats-grid">
        <Stat label="Nós" value={stats.nodeCount} />

        <Stat
          label="Altura"
          value={stats.height}
          hint="Número de nós no caminho mais longo da raiz até uma folha."
        />

        <Stat
          label="Altura negra"
          value={stats.blackHeight}
          hint="Nós pretos da raiz (inclusive) até uma folha NIL (exclusive)."
        />

        <Stat
          label="Rotações"
          value={rotations}
          hint="Rotações até a etapa atual / total da operação."
        />

        <Stat label="Comparações" value={comparisons} />

        <Stat label="Recolorações" value={result?.recolorings ?? 0} />
      </div>

      <div className="tree-last-operation">
        Última operação: <strong>{ctl.lastOp}</strong>
      </div>

      <div
        className={
          stats.validation.valid
            ? "tree-validity tree-validity-ok"
            : "tree-validity tree-validity-bad"
        }
      >
        <StatusIcon valid={stats.validation.valid} />

        <div className="tree-validity-content">
          <div className="tree-validity-title">
            {stats.validation.valid
              ? "Todas as 5 propriedades Rubro-Negras são satisfeitas"
              : "Propriedades violadas"}
          </div>

          {stats.validation.errors.map((error) => (
            <div className="tree-validity-error" key={error}>
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
              <span className="tree-sequence-value" key={`${value}-${index}`}>
                {value}
              </span>
            ))
          ) : (
            <span className="tree-sequence-empty">vazio</span>
          )}
        </div>
      </div>

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
          Como nenhum caminho tem dois vermelhos seguidos e todos têm a mesma
          altura negra, o caminho mais longo é no máximo o dobro do mais curto:
          a altura fica ≤ 2·log₂(n+1), garantindo O(log n) no pior caso.
        </p>
      </div>
    </div>
  );
}

