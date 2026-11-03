import "../../styles/components/tree/TreeAnimationControls.css";

export const KIND_LABEL = {
  start: "Início",
  compare: "Comparação",
  "insert-node": "Novo nó",
  violation: "Verificação",
  recolor: "Recoloração",
  "rotate-left": "Rotação esq.",
  "rotate-right": "Rotação dir.",
  found: "Encontrado",
  "not-found": "Não encontrado",
  duplicate: "Duplicado",
  "remove-node": "Remoção",
  successor: "Sucessor",
  "fix-delete": "Correção",
  done: "Concluído",
};

const ICONS = {
  previous: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  ),
  next: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
  restart: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 2.64-6.36L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m8 5 12 7-12 7V5Z" />
    </svg>
  ),
  pause: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5v14M16 5v14" />
    </svg>
  ),
};

export function TreeAnimationControls({ ctl }) {
  if (!ctl) return null;

  const steps = Array.isArray(ctl.steps) ? ctl.steps : [];
  const stepIndex = Number.isInteger(ctl.stepIndex) ? ctl.stepIndex : 0;

  const pb = ctl.playback ?? {};

  const hasSteps = steps.length > 0;
  const speedValue = Number(pb.speed ?? 1);

  const safeSpeed = Number.isFinite(speedValue)
    ? Math.min(4, Math.max(0.25, speedValue))
    : 1;

  return (
    <div className="tree-animation-controls">
      <div className="tree-playback-actions">
        {pb.playing ? (
          <button
            type="button"
            className="tree-action-button tree-primary-button"
            onClick={pb.pause}
            disabled={!hasSteps || !pb.pause}
          >
            {ICONS.pause}
            <span>Pausar</span>
          </button>
        ) : (
          <button
            type="button"
            className="tree-action-button tree-primary-button"
            onClick={pb.play}
            disabled={!hasSteps || !pb.play}
          >
            {ICONS.play}
            <span>Reproduzir</span>
          </button>
        )}

        <button
          type="button"
          className="tree-icon-button"
          onClick={pb.prev}
          disabled={!hasSteps || stepIndex === 0 || !pb.prev}
          aria-label="Passo anterior"
          title="Passo anterior"
        >
          {ICONS.previous}
        </button>

        <button
          type="button"
          className="tree-icon-button"
          onClick={pb.next}
          disabled={!hasSteps || stepIndex >= steps.length - 1 || !pb.next}
          aria-label="Passo seguinte"
          title="Passo seguinte"
        >
          {ICONS.next}
        </button>

        <button
          type="button"
          className="tree-icon-button"
          onClick={pb.restart}
          disabled={!hasSteps || !pb.restart}
          aria-label="Reiniciar animação"
          title="Reiniciar animação"
        >
          {ICONS.restart}
        </button>

        <span className="tree-step-counter">
          {hasSteps ? `${stepIndex + 1}/${steps.length}` : "—"}
        </span>
      </div>

      <div className="tree-speed-control">
        <label htmlFor="tree-speed" className="tree-speed-label">
          Velocidade
        </label>

        <input
          id="tree-speed"
          className="tree-speed-slider"
          type="range"
          min="0.25"
          max="4"
          step="0.25"
          value={safeSpeed}
          onChange={(event) => pb.setSpeed?.(Number(event.target.value))}
          disabled={!pb.setSpeed}
          aria-label="Velocidade"
          style={{
            "--slider-progress": `${((safeSpeed - 0.25) / (4 - 0.25)) * 100}%`,
          }}
        />

        <span className="tree-speed-value">{safeSpeed}×</span>
      </div>

      {hasSteps ? (
        <ol className="tree-step-list">
          {steps.map((step, index) => {
            const active = index === stepIndex;
            const kind = step?.kind ?? "unknown";
            const label = KIND_LABEL[kind] || kind;

            return (
              <li key={`${kind}-${index}`}>
                <button
                  type="button"
                  onClick={() => pb.goTo?.(index)}
                  disabled={!pb.goTo}
                  className={`tree-step-item ${
                    active ? "tree-step-item-active" : ""
                  }`}
                  aria-current={active ? "step" : undefined}
                >
                  <span className={`tree-step-tag tree-step-${kind}`}>
                    {label}
                  </span>

                  <span className="tree-step-message">
                    {step?.message ?? "Etapa da operação"}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="tree-no-steps">
          Execute uma operação para ver as etapas do algoritmo.
        </p>
      )}
    </div>
  );
}
