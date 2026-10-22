import { useCallback, useEffect, useState } from "react";
import { BookService } from "../service/book.service.jsx";

export function useLivros() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await BookService.getAllBooks();

      // Aceita respostas que retornem os livros em formatos comuns.
      const livros = Array.isArray(response)
        ? response
        : response?.data ?? response?.livros ?? response?.books ?? [];

      setData(Array.isArray(livros) ? livros : []);
    } catch (err) {
      setError(err);
      setData([]);
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