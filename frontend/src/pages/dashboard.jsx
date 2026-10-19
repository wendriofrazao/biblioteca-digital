import { useEffect, useState } from "react";
import { BibliotecaDashboard } from "../components/BibliotecaDashboard.jsx";
import { getDashboardData } from "../service/dashboard.service.jsx";
import { useAuth } from "../context/auth.context.jsx";
import { HeaderDashboard } from "../components/HeaderDashboard.jsx";

export function Dashboard() {
  const { user, loading: authLoading, loadUser, signOut } = useAuth();

  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarDashboard() {
      try {
        setLoading(true);
        setErro("");

        if (!user && !authLoading) {
          await loadUser();
        }

        const resultado = await getDashboardData();

        if (ativo) {
          setDados(resultado);
        }
      } catch (error) {
        if (ativo) {
          setErro(error.message || "Erro ao carregar a dashboard.");
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    carregarDashboard();

    return () => {
      ativo = false;
    };
  }, [user, authLoading, loadUser]);

  if (authLoading || loading) {
    return <p>Carregando dados da biblioteca...</p>;
  }

  if (erro) {
    return (
      <section>
        <p>Não foi possível carregar a dashboard: {erro}</p>
        <button type="button" onClick={() => window.location.reload()}>
          Tentar novamente
        </button>
      </section>
    );
  }

  const usuario = {
    nome: user?.nome || "Usuário",
    tipo: user?.tipo || "Usuário",
    matricula: user?.matricula || "",
  };

  return (
    <>
      <BibliotecaDashboard usuario={usuario} dados={dados} onSair={signOut} />
    </>
  );
}
