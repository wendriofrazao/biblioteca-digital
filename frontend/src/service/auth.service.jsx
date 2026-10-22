
const API_URL = import.meta.env.VITE_LOCAL_API_URL;

async function request(endpoint, options = {}) {
  if (!API_URL) {
    throw new Error(
      "Configure VITE_LOCAL_API_URL no arquivo .env.",
    );
  }

  const token = localStorage.getItem("token");

  const headers = {
    ...(options.body
      ? { "Content-Type": "application/json" }
      : {}),
    ...(token
      ? { Authorization: `Bearer ${token}` }
      : {}),
    ...options.headers,
  };

  let response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      "Não foi possível conectar ao backend. Verifique se o servidor está ativo.",
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(
      data.message ||
        data.error ||
        `Erro na requisição (${response.status}).`,
    );
  }

  return data;
}

export async function signIn(email, senha) {
  const data = await request("/user/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });

  const token = data.user?.token ?? data.token;

  if (!token) {
    throw new Error(
      "O backend não retornou o token de autenticação.",
    );
  }

  localStorage.setItem("token", token);

  return data;
}

export async function signUp(
  nome,
  email,
  matricula,
  senha,
) {
  return request("/user/register", {
    method: "POST",
    body: JSON.stringify({
      nome,
      email,
      matricula,
      senha,
    }),
  });
}

export function signOut() {
  localStorage.removeItem("token");
}

export async function profile() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "Token não encontrado. Faça login novamente.",
    );
  }

  return request("/user/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}