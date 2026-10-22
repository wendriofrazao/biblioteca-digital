import { useEffect, useState } from "react";
import { BibliotecaDashboard } from "../components/BibliotecaDashboard.jsx";
import { getDashboardData } from "../service/dashboard.service.jsx";
import { useAuth } from "../context/auth.context.jsx";

export function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();

  const [dados, setDados] = useState({});
  const [erro, setErro] = useState("");

  useEffect(() => {
    // Aguarda somente a verificação inicial da autenticação.
    if (authLoading) return;

    let ativo = true;

    async function carregarDashboard() {
      try {
        setErro("");

        const resultado = await getDashboardData();

        if (ativo) {
          setDados(resultado ?? {});
        }
      } catch (error) {
        if (ativo) {
          setErro(
            error.message ||
              "Não foi possível atualizar os dados da biblioteca.",
          );
        }
      }
    }

    carregarDashboard();

    return () => {
      ativo = false;
    };
  }, [authLoading]);

  const usuario = {
    ...user,
    nome:
      user?.nome ??
      user?.name ??
      user?.nomeCompleto ??
      user?.username ??
      user?.email ??
      "Usuário",
    name:
      user?.name ?? user?.nome ?? user?.username ?? user?.email ?? "Usuário",
    tipo: user?.tipo ?? user?.role ?? "USER",
    role: user?.role ?? user?.tipo ?? "USER",
    matricula: user?.matricula ?? user?.code ?? user?.codigo ?? "",
    code: user?.code ?? user?.matricula ?? user?.codigo ?? "",
  };

  // A dashboard aparece imediatamente, sem uma tela de carregamento
  // durante a busca dos dados.
  return (
    <>
      {erro && (
        <div className="dashboard-error" role="alert">
          <span>{erro}</span>
          <button type="button" onClick={() => window.location.reload()}>
            Tentar novamente
          </button>
        </div>
      )}

      <BibliotecaDashboard usuario={usuario} dados={dados} onSair={signOut} />
    </>
  );
}
