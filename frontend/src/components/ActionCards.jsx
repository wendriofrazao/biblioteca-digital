const acoes = [
  { icon: 'fa-book-open', label: 'Catálogo' },
  { icon: 'fa-hand-holding-heart', label: 'Empréstimos' },
  { icon: 'fa-diagram-project', label: 'Árvore RB' },
]

export function ActionCards({ onClick }) {
  return (
    <div className="actions">
      {acoes.map((acao) => (
        <button key={acao.label} className="card action-card" onClick={onClick}>
          <i className={`fa-solid ${acao.icon}`} />
          <span>{acao.label}</span>
        </button>
      ))}
    </div>
  )
}