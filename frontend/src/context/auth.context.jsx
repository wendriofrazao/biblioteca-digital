import { createContext, useContext, useEffect, useState } from "react";
import { profile } from "../service/auth.service.jsx";

const AuthContext = createContext(null);

function normalizarUsuario(response) {
  const usuario =
    response?.user ??
    response?.usuario ??
    response?.data?.user ??
    response?.data?.usuario ??
    response?.data ??
    response;

  if (!usuario || typeof usuario !== "object") {
    return null;
  }

  return {
    ...usuario,
    nome:
      usuario.nome ??
      usuario.name ??
      usuario.nomeCompleto ??
      usuario.username ??
      "",
    matricula: usuario.matricula ?? "",
    role: usuario.role ?? usuario.tipo ?? usuario.tipoUsuario ?? "",
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    if (!localStorage.getItem("token")) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const response = await profile();
      const usuario = normalizarUsuario(response);

      setUser(usuario);
      return usuario;
    } catch (error) {
      setUser(null);
      localStorage.removeItem("token");
      return null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  function signOut() {
    localStorage.removeItem("token");
    setUser(null);
    setLoading(false);
  }

  const tipoUsuario = String(
    user?.role ?? user?.tipo ?? user?.tipoUsuario ?? "",
  ).toLowerCase();

  const value = {
    user,
    loading,
    loadUser,
    signOut,
    logout: signOut,
    isAuthenticated: Boolean(user),
    isAdmin: ["admin", "administrador"].includes(tipoUsuario),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro do AuthProvider.");
  }

  return context;
}
