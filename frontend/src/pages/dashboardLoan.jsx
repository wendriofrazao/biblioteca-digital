import { useState } from "react";
import { LeftSidebar } from "../components/Sidebar.jsx";
import { LoansView } from "../components/LoansView.jsx";

export function DashboardLoan({
  usuarioProp,
  dados,
  loans = [],
  onSair = () => {},
  onRenewLoan = () => {},
  onReturnLoan = () => {},
  onExploreCatalog = () => {},
}) {
  const usuario = usuarioProp ?? {
    nome: "Usuário",
    tipo: "USER",
    matricula: "",
  };

  const usuarioLoans = {
    ...usuario,
    name: usuario.name ?? usuario.nome ?? "Usuário",
    code: usuario.code ?? usuario.matricula ?? "",
    maxLoans: usuario.maxLoans ?? 5,
  };

  const [activeTab, setActiveTab] = useState("painel");
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  return (
    <div className="biblioteca-layout">
      <LeftSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        user={usuario}
        loanCount={dados?.emprestimos ?? loans.length}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
        onSwitchUser={onSair}
      />

      <main className="biblioteca-main">
        <LoansView
          loans={loans}
          user={usuarioLoans}
          onRenewLoan={onRenewLoan}
          onReturnLoan={onReturnLoan}
          onExploreCatalog={onExploreCatalog}
        />
      </main>
    </div>
  );
}
