import {
  LayoutGrid,
  BookOpen,
  ArrowLeftRight,
  GitFork,
  ShieldCheck,
  LogOut,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/components/LeftSidebar.css";

export function LeftSidebar({
  activeTab,
  onSelectTab,
  user,
  loanCount = 0,
  isOpenMobile = false,
  onCloseMobile = () => {},
  onSwitchUser = () => {},
}) {
const navigate = useNavigate();

  const handleNavClick = (tab, link) => {
    onSelectTab(tab);
    navigate(link);
    onCloseMobile();
  };

  const navItems = [
    { id: "painel", label: "Painel", Icon: LayoutGrid, link: "/dashboard" },
    { id: "emprestimos", label: "Empréstimos", Icon: ArrowLeftRight, link: "/loan" },
    { id: "arvore", label: "Árvore RB", Icon: GitFork, link: "/arvore" },
  ];

  const renderNavItem = ({ id, label, Icon, link }) => {
    const ativo = activeTab === id;

    return (
      <button
        key={id}
        type="button"
        onClick={() => handleNavClick(id, link)}
        className={`sidebar-nav-item ${ativo ? "active" : ""}`}
        aria-current={ativo ? "page" : undefined}
      >
        <span className="sidebar-nav-label">
          <Icon
            size={16}
            strokeWidth={1.75}
            className="sidebar-nav-icon"
          />
          <span>{label}</span>
        </span>

        <span className="sidebar-nav-indicators">
          {id === "emprestimos" && loanCount > 0 && (
            <span className="sidebar-loan-count">{loanCount}</span>
          )}

          {ativo && <span className="sidebar-active-dot" />}
        </span>
      </button>
    );
  };

  const sidebarContent = (
    <div className="sidebar-content">
      <div className="sidebar-main">
        <div className="sidebar-heading">
          <span>Sua Biblioteca</span>

          <button
            type="button"
            onClick={onCloseMobile}
            className="sidebar-close-button"
            aria-label="Fechar menu"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Menu principal">
          {navItems.map(renderNavItem)}
        </nav>

        <div className="sidebar-divider" />

        <div className="sidebar-admin">
          {renderNavItem({
            id: "administracao",
            label: "Administração",
            Icon: ShieldCheck,
          })}
        </div>
      </div>

      <div className="sidebar-user" data-purpose="user-profile">
        <div className="sidebar-user-info">
          <p className="sidebar-user-name">
            {user?.name ?? user?.nome ?? "Usuário"}
          </p>

          <p className="sidebar-user-details">
            {user?.role ?? user?.tipo ?? "Leitor"}
            {" · "}
            {user?.code ?? user?.matricula ?? ""}
          </p>
        </div>

        <button
          type="button"
          onClick={onSwitchUser}
          className="sidebar-logout-button"
        >
          <LogOut size={16} strokeWidth={1.75} />
          <span>Sair da biblioteca</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="sidebar-desktop" data-purpose="sidebar">
        {sidebarContent}
      </aside>

      {isOpenMobile && (
        <div className="sidebar-mobile-overlay">
          <button
            type="button"
            className="sidebar-backdrop"
            onClick={onCloseMobile}
            aria-label="Fechar menu lateral"
          />

          <aside className="sidebar-mobile-drawer">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}