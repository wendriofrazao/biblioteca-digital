import "../styles/components/ActionCards.css";

const acoes = [
  { icon: "fa-book-open", label: "Catálogo" },
  { icon: "fa-hand-holding-heart", label: "Empréstimos" },
  { icon: "fa-diagram-project", label: "Árvore RB" },
];

export function ActionCards({ onClick }) {
  return (
    <div className="actions">
      {acoes.map((acao) => (
        <button
          key={acao.label}
          type="button"
          className="card action-card"
          onClick={onClick}
        >
          <i className={`fa-solid ${acao.icon}`} aria-hidden="true" />
          <span>{acao.label}</span>
        </button>
      ))}
    </div>
  );
}
