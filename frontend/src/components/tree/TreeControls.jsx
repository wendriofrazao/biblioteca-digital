import { useState } from "react";
import "../../styles/components/tree/TreeControls.css";

const ICONS = {
  plus: (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" />
      <path d="m16 16 4 4" />
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6" />
    </svg>
  ),
  sparkles: (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" />
      <path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z" />
    </svg>
  ),
  shuffle: (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="m18 14 4 4-4 4M18 2l4 4-4 4" />
      <path d="M2 18h2.5a6 6 0 0 0 4.2-1.7l6.6-8.6A6 6 0 0 1 19.5 6H22M2 6h2.5a6 6 0 0 1 4.2 1.7l1.1 1.4m3.3 4.2 1.1 1.4a6 6 0 0 0 4.3 1.7H22" />
    </svg>
  ),
  eraser: (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="m7 21-5-5a2 2 0 0 1 0-2.8L12.2 3a2 2 0 0 1 2.8 0l7 7a2 2 0 0 1 0 2.8L13 21H7Z" />
      <path d="m5 11 8 8" />
    </svg>
  ),
  undo: (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M3 7v6h6" />
      <path d="M3 13a9 9 0 1 1 2.6 6.4" />
    </svg>
  ),
};

function OpField({
  label,
  placeholder,
  button,
  icon,
  onRun,
  variant = "default",
}) {
  const [value, setValue] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (value.trim() === "") return;

    const result = onRun(value);

    if (result !== false) {
      setValue("");
    }
  }

  return (
    <form className="tree-op-field" onSubmit={handleSubmit}>
      <label className="tree-op-label">{label}</label>

      <div className="tree-op-row">
        <input
          type="number"
          inputMode="numeric"
          step="1"
          className="tree-op-input"
          placeholder={placeholder}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />

        <button
          type="submit"
          className={`tree-op-button tree-op-button-${variant}`}
          disabled={!value.trim()}
        >
          {ICONS[icon]}
          <span>{button}</span>
        </button>
      </div>
    </form>
  );
}

export function TreeControls({ ctl }) {
  if (!ctl) return null;

  return (
    <section className="tree-controls-panel">
      <div className="tree-controls-operations">
        <OpField
          label="Inserir valor"
          placeholder="Ex: 42"
          button="Inserir"
          icon="plus"
          onRun={ctl.insert}
        />

        <OpField
          label="Pesquisar valor"
          placeholder="Ex: 42"
          button="Buscar"
          icon="search"
          onRun={ctl.search}
          variant="secondary"
        />

        <OpField
          label="Remover valor"
          placeholder="Ex: 42"
          button="Remover"
          icon="trash"
          onRun={ctl.remove}
          variant="destructive"
        />
      </div>

      <div className="tree-utility-actions">
        <button
          type="button"
          className="tree-utility-button"
          onClick={ctl.loadExample}
        >
          {ICONS.sparkles}
          <span>Inserir exemplo</span>
        </button>

        <button
          type="button"
          className="tree-utility-button"
          onClick={() => ctl.randomTree()}
        >
          {ICONS.shuffle}
          <span>Árvore aleatória</span>
        </button>

        <button
          type="button"
          className="tree-utility-button tree-utility-danger"
          onClick={ctl.clear}
        >
          {ICONS.eraser}
          <span>Limpar árvore</span>
        </button>

        <button
          type="button"
          className="tree-utility-button"
          onClick={ctl.undo}
          disabled={!ctl.canUndo}
        >
          {ICONS.undo}
          <span>Desfazer</span>
        </button>
      </div>

      {ctl.feedback && (
        <p
          role="status"
          className={`tree-feedback tree-feedback-${ctl.feedback.kind}`}
        >
          {ctl.feedback.text}
        </p>
      )}
    </section>
  );
}

