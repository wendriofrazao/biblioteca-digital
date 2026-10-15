import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/Header.jsx";
import { Footer } from "../components/Footer.jsx";
import { LoginModal } from "../components/LoginModal.jsx";
import { RegisterModal } from "../components/RegisterModal.jsx";

export function PublicLayout() {
  const [modalAberto, setModalAberto] = useState(null);

  const abrirLogin = () => setModalAberto("login");
  const abrirCadastro = () => setModalAberto("cadastro");
  const fecharModal = () => setModalAberto(null);


  const handleLogin = (e) => {
    e.preventDefault();

    fecharModal();
    setToast(true);

    setTimeout(() => setToast(false), 2500);
  };

  const handleCadastro = (e) => {
    e.preventDefault();

    fecharModal();
    setToast(true);

    setTimeout(() => setToast(false), 2500);
  };

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
      />

      <RegisterModal
        aberto={modalAberto === "cadastro"}
        onFechar={fecharModal}
        onSubmit={handleCadastro}
        onAbrirLogin={abrirLogin}
      />
    </>
  );
}
