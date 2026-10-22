import { useCallback, useEffect, useState } from "react";
import { CategoryService } from "../service/category.service.jsx";

function extrairCategorias(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.categorias)) return response.categorias;
  if (Array.isArray(response?.categories)) return response.categories;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.categorias)) {
    return response.data.categorias;
  }
  return [];
}

export function useCategorias() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await CategoryService.getAllCategories();
      setData(extrairCategorias(response));
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  async function createCategory(categoria) {
    const result = await CategoryService.createCategory(categoria);
    await refetch();
    return result;
  }

  async function updateCategory(id, categoria) {
    const result = await CategoryService.updateCategory(id, categoria);
    await refetch();
    return result;
  }

  async function deleteCategory(id) {
    const result = await CategoryService.deleteCategory(id);
    await refetch();
    return result;
  }

  return {
    data,
    isLoading,
    error,
    refetch,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
