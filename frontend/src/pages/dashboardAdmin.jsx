import { useState } from "react";
import { AdminPage } from "../components/Staff.jsx";
import { LeftSidebar } from "../components/Sidebar.jsx";

export function Staff({
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
        <AdminPage />
      </main>
    </div>
  );
}
