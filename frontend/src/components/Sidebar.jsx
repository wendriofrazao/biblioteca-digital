import { NavLink } from "react-router-dom";
import { Icon } from "./Icon";

const navigation = [
  {
    label: "Painel",
    to: "/dashboard",
    icon: "dashboard",
    end: true,
  },
  {
    label: "Catálogo",
    to: "/catalogo",
    icon: "library",
  },
  {
    label: "Empréstimos",
    to: "/emprestimos",
    icon: "repeat",
  },
  {
    label: "Árvore RB",
    to: "/arvore",
    icon: "tree",
  },
];

export function Sidebar({ usuario, onSair }) {
  return (
    <aside className="biblioteca-sidebar">
      <div>
        <p className="sidebar-label">Sua biblioteca</p>

        <nav className="sidebar-nav" aria-label="Navegação da biblioteca">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `sidebar-link${isActive ? " active" : ""}`
              }
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>

              {item.label === "Painel" && <span className="active-dot" />}
            </NavLink>
          ))}

          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `sidebar-link admin-link${isActive ? " active" : ""}`
            }
          >
            <Icon name="shield" />
            <span>Administração</span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-account">
        <p className="account-name">{usuario.nome}</p>

        <p className="account-detail">
          {usuario.tipo} · {usuario.matricula}
        </p>

        <button type="button" className="logout-button" onClick={onSair}>
          <Icon name="logout" size={16} />
          Sair da biblioteca
        </button>
      </div>
    </aside>
  );
}
