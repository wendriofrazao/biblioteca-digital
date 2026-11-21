import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { BibliotecaDashboard } from "../components/BibliotecaDashboard.jsx";
import { getDashboardData } from "../service/dashboard.service.jsx";
import { useAuth } from "../context/auth.context.jsx";

export function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { usuario: layoutUsuario, setLoanCount } = useOutletContext() ?? {};

  const [dados, setDados] = useState({});
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (authLoading) return;

    let ativo = true;

    async function carregarDashboard() {
      try {
        setErro("");

        const resultado = await getDashboardData();

        if (ativo) {
          setDados(resultado ?? {});

          if (resultado?.emprestimos != null) {
            setLoanCount?.(Number(resultado.emprestimos));
          }
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
  }, [authLoading, setLoanCount]);

  const usuario = layoutUsuario ?? user ?? {};

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

      <BibliotecaDashboard usuario={usuario} dados={dados} />
    </>
  );
}
