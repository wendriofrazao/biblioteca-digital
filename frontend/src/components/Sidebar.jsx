import {
  LayoutGrid,
  BookOpen,
  ArrowLeftRight,
  GitFork,
  ShieldCheck,
  LogOut,
  X,
  UserCheck,
} from "lucide-react";

import "../styles/components/LeftSidebar.css";

export function LeftSidebar({
  activeTab,
  onSelectTab,
  user,
  loanCount,
  isOpenMobile,
  onCloseMobile,
  onSwitchUser,
}) {
  const handleNavClick = (tab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  const navItems = [
    { id: "painel", label: "Painel", Icon: LayoutGrid },
    { id: "catalogo", label: "Catálogo", Icon: BookOpen },
    { id: "emprestimos", label: "Empréstimos", Icon: ArrowLeftRight },
    { id: "arvore", label: "Árvore RB", Icon: GitFork },
    { id: "administracao", label: "Administração", Icon: ShieldCheck },
  ];

  const renderNavItem = ({ id, label, Icon }) => {
    const isActive = activeTab === id;

    return (
      <button
        key={id}
        type="button"
        onClick={() => handleNavClick(id)}
        className={`sidebar-nav-item ${isActive ? "active" : ""}`}
        aria-current={isActive ? "page" : undefined}
      >
        <span className="sidebar-nav-label">
          <Icon
            size={17}
            strokeWidth={1.75}
            className="sidebar-nav-icon"
          />
          <span>{label}</span>
        </span>

        <span className="sidebar-nav-indicators">
          {id === "emprestimos" && loanCount > 0 && (
            <span className="sidebar-loan-count">{loanCount}</span>
          )}

          {isActive && <span className="sidebar-active-dot" />}
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
            <X size={17} />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Menu principal">
          {navItems.slice(0, 4).map(renderNavItem)}
        </nav>

        <div className="sidebar-divider" />

        <div className="sidebar-admin">
          {renderNavItem(navItems[4])}
        </div>
      </div>

      <div className="sidebar-user" data-purpose="user-profile">
        <div className="sidebar-user-info">
          <p className="sidebar-user-name">{user?.name || "Usuário"}</p>

          <p className="sidebar-user-details">
            {user?.role || "Leitor"}
            {user?.code ? ` · ${user.code}` : ""}
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

          <aside
            className="sidebar-mobile-drawer"
            aria-label="Menu lateral móvel"
          >
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
