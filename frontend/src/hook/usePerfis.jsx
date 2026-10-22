import { useCallback, useEffect, useState } from "react";
import { ProfileService } from "../service/profile.service.jsx";

function extrairPerfis(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.perfis)) return response.perfis;
  if (Array.isArray(response?.users)) return response.users;
  if (Array.isArray(response?.usuarios)) return response.usuarios;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.perfis)) return response.data.perfis;
  if (Array.isArray(response?.data?.users)) return response.data.users;

  return [];
}

export function usePerfis() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ProfileService.getAllProfiles();
      setData(extrairPerfis(response));
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}
