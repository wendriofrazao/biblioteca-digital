import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth.context.jsx";
import { HeaderDashboard } from "../components/HeaderDashboard.jsx";
import { LeftSidebar } from "../components/Sidebar.jsx";
import { LoanService } from "../service/loan.service.jsx";
import "../styles/layouts/PrivateLayout.css";

function tabFromPath(pathname) {
  if (pathname.startsWith("/tree")) return "arvore";
  if (pathname.startsWith("/loan")) return "emprestimos";
  if (pathname.startsWith("/staff")) return "administracao";
  return "painel";
}

function normalizeUser(raw) {
  const source = raw ?? {};

  const nome =
    source.nome ??
    source.name ??
    source.nomeCompleto ??
    source.nome_completo ??
    source.username ??
    source.email ??
    "Usuário";

  const tipo =
    source.tipo ??
    source.role ??
    source.tipoUsuario ??
    source.tipo_usuario ??
    source.perfil ??
    "USER";

  const matricula =
    source.matricula ??
    source.code ??
    source.codigo ??
    source.registration ??
    "";

  return {
    ...source,
    nome,
    name: source.name ?? nome,
    tipo,
    role: source.role ?? tipo,
    matricula,
    code: source.code ?? matricula,
  };
}

export function PrivateRoute() {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();
  const mainRef = useRef(null);

  const [mobileMenuPath, setMobileMenuPath] = useState(null);
  const [loanCount, setLoanCount] = useState(0);

  const isOpenMobile = mobileMenuPath === location.pathname;
  const activeTab = tabFromPath(location.pathname);
  const usuario = useMemo(() => normalizeUser(user), [user]);

  useEffect(() => {
    document.documentElement.classList.add("lock-page-scroll");
    document.body.classList.add("lock-page-scroll");

    return () => {
      document.documentElement.classList.remove("lock-page-scroll");
      document.body.classList.remove("lock-page-scroll");
    };
  }, []);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  useEffect(() => {
    if (loading || !user) return;

    let active = true;

    LoanService.getAllLoans()
      .then((loans) => {
        if (!active || !Array.isArray(loans)) return;

        const ativos = loans.filter((loan) => {
          const status = String(loan?.status ?? "").toUpperCase();
          return (
            status !== "DEVOLVIDO" &&
            status !== "RETURNED" &&
            !loan?.dataDevolucao
          );
        }).length;

        setLoanCount(ativos);
      })
      .catch(() => {
        /* mantém contagem atual em caso de falha */
      });

    return () => {
      active = false;
    };
  }, [loading, user]);

  if (loading) {
    return (
      <div className="private-layout-loading">
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="private-layout-shell">
      <HeaderDashboard
        isMobileMenuOpen={isOpenMobile}
        onToggleMobileMenu={() =>
          setMobileMenuPath((prev) =>
            prev === location.pathname ? null : location.pathname,
          )
        }
      />

      <div className="biblioteca-layout">
        <LeftSidebar
          activeTab={activeTab}
          user={usuario}
          loanCount={loanCount}
          isOpenMobile={isOpenMobile}
          onCloseMobile={() => setMobileMenuPath(null)}
          onSwitchUser={signOut}
        />

        <main ref={mainRef} className="biblioteca-main">
          <Outlet context={{ usuario, loanCount, setLoanCount }} />
        </main>
      </div>
    </div>
  );
}
