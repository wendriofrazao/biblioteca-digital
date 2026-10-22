const API_URL = import.meta.env.VITE_LOCAL_API_URL;

async function request(endpoint) {
  if (!API_URL) {
    throw new Error("Configure VITE_LOCAL_API_URL no arquivo .env");
  }

  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Erro ao carregar usuários.");
  }

  return data;
}

export const ProfileService = {
  async getAllProfiles() {
    const response = await request("/user");
    return response.user ?? [];
  },
};
