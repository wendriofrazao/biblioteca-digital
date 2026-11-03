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
  const { steps, stepIndex, playback: pb } = ctl;
  const hasSteps = steps.length > 0;

  const speedValue = Number(pb.speed);

  return (
    <div className="tree-animation-controls">
      <div className="tree-playback-actions">
        {pb.playing ? (
          <button
            type="button"
            className="tree-action-button tree-primary-button"
            onClick={pb.pause}
            disabled={!hasSteps}
          >
            {ICONS.pause}
            <span>Pausar</span>
          </button>
        ) : (
          <button
            type="button"
            className="tree-action-button tree-primary-button"
            onClick={pb.play}
            disabled={!hasSteps}
          >
            {ICONS.play}
            <span>Reproduzir</span>
          </button>
        )}

        <button
          type="button"
          className="tree-icon-button"
          onClick={pb.prev}
          disabled={!hasSteps || stepIndex === 0}
          aria-label="Passo anterior"
          title="Passo anterior"
        >
          {ICONS.previous}
        </button>

        <button
          type="button"
          className="tree-icon-button"
          onClick={pb.next}
          disabled={!hasSteps || stepIndex >= steps.length - 1}
          aria-label="Passo seguinte"
          title="Passo seguinte"
        >
          {ICONS.next}
        </button>

        <button
          type="button"
          className="tree-icon-button"
          onClick={pb.restart}
          disabled={!hasSteps}
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
          value={speedValue}
          onChange={(event) => pb.setSpeed(Number(event.target.value))}
          aria-label="Velocidade"
          style={{
            "--slider-progress": `${((speedValue - 0.25) / (4 - 0.25)) * 100}%`,
          }}
        />

        <span className="tree-speed-value">{speedValue}×</span>
      </div>

      {hasSteps ? (
        <ol className="tree-step-list">
          {steps.map((step, index) => {
            const active = index === stepIndex;
            const label = KIND_LABEL[step.kind] || step.kind;

            return (
              <li key={`${step.kind}-${index}`}>
                <button
                  type="button"
                  onClick={() => pb.goTo(index)}
                  className={`tree-step-item ${active ? "tree-step-item-active" : ""}`}
                  aria-current={active ? "step" : undefined}
                >
                  <span className={`tree-step-tag tree-step-${step.kind}`}>
                    {label}
                  </span>
                  <span className="tree-step-message">{step.message}</span>
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
