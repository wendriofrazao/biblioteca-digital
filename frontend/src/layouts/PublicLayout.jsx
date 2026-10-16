import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/Header.jsx";
import { Footer } from "../components/Footer.jsx";
import { LoginModal } from "../components/LoginModal.jsx";
import { RegisterModal } from "../components/RegisterModal.jsx";
import { signIn, signUp } from "../service/auth.service.jsx";

export function PublicLayout() {
  const [modalAberto, setModalAberto] = useState(null);
  const [toast, setToast] = useState("");
  const [carregando, setCarregando] = useState(false);

  const abrirLogin = () => setModalAberto("login");
  const abrirCadastro = () => setModalAberto("cadastro");
  const fecharModal = () => setModalAberto(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const dados = new FormData(form);

    try {
      setCarregando(true);
      setToast("");

      await signIn(dados.get("email"), dados.get("senha"));

      form.reset();
      fecharModal();
      setToast("Login realizado com sucesso!");
    } catch (error) {
      setToast(error.message);
    } finally {
      setCarregando(false);
    }
  };

  const handleCadastro = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const dados = new FormData(form);

    try {
      setCarregando(true);
      setToast("");

      const nome = dados.get("nome");
      const email = dados.get("email");
      const matricula = dados.get("matricula");
      const senha = dados.get("senha");

      await signUp(nome, email, matricula, senha);
      await signIn(email, senha);

      form.reset();
      fecharModal();
      setToast("Conta criada e login realizado com sucesso!");
    } catch (error) {
      setToast(error.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <>
      <Header onEntrar={abrirLogin} onRegistrar={abrirCadastro} />

      <Outlet context={{ abrirLogin, abrirCadastro }} />

      <Footer />

      <LoginModal
        aberto={modalAberto === "login"}
        onFechar={fecharModal}
        onSubmit={handleLogin}
        onAbrirCadastro={abrirCadastro}
        carregando={carregando}
      />

      <RegisterModal
        aberto={modalAberto === "cadastro"}
        onFechar={fecharModal}
        onSubmit={handleCadastro}
        onAbrirLogin={abrirLogin}
        carregando={carregando}
      />

      {toast && (
        <div className="toast" role="status">
          <i
            className={`fa-solid ${
              toast.includes("sucesso") ? "fa-check" : "fa-circle-exclamation"
            }`}
            aria-hidden="true"
          />
          {toast}
        </div>
      )}
    </>
  );
}
