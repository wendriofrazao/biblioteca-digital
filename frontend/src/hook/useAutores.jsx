import { useCallback, useEffect, useState } from "react";
import { AuthorService } from "../service/author.service.jsx";

function extrairAutores(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.autores)) return response.autores;
  if (Array.isArray(response?.authors)) return response.authors;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.autores)) return response.data.autores;
  return [];
}

export function useAutores() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await AuthorService.getAllAuthors();
      setData(extrairAutores(response));
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  async function createAuthor(autor) {
    const result = await AuthorService.createAuthor(autor);
    await refetch();
    return result;
  }

  async function updateAuthor(id, autor) {
    const result = await AuthorService.updateAuthor(id, autor);
    await refetch();
    return result;
  }

  async function deleteAuthor(id) {
    const result = await AuthorService.deleteAuthor(id);
    await refetch();
    return result;
  }

  return {
    data,
    isLoading,
    error,
    refetch,
    createAuthor,
    updateAuthor,
    deleteAuthor,
  };
}
