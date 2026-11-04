import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getRedBlackTree,
  getRedBlackTreeStats,
  searchBookInTree,
} from "../service/redBlackTree.service.jsx";

// Extrai a raiz independentemente de a resposta vir diretamente
function getTreeRoot(response) {
  let data = response;

  // Resposta Axios: response.data
  if (data?.data && !("key" in data)) {
    data = data.data;
  }

  // Resposta da API: { success, message, data }
  if (data && "success" in data) {
    data = data.data;
  }

  return data ?? null;
}

// Converte a árvore da API para o formato usado pelo visualizador.
function convertApiTree(response) {
  const root = getTreeRoot(response);

  const nodes = {};
  const books = {};

  function traverse(node) {
    if (!node) return;

    const id = node.key;

    nodes[id] = {
      id,
      value: id,
      color: node.color,
      left: node.left?.key ?? null,
      right: node.right?.key ?? null,
    };

    // Mantém os dados completos do livro associados ao nó.
    books[id] = node.value;

    traverse(node.left);
    traverse(node.right);
  }

  traverse(root);

  return {
    snapshot: {
      rootId: root?.key ?? null,
      nodes,
    },
    books,
  };
}

export function useRedBlackTree() {
  const [tree, setTree] = useState(null);
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  const [selectedBook, setSelectedBook] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const [lastOp, setLastOp] = useState("Carregamento inicial");

  // Carrega a árvore e as estatísticas do backend.
  const loadTree = useCallback(async () => {
    try {
      setLoading(true);

      const [treeData, statsData] = await Promise.all([
        getRedBlackTree(),
        getRedBlackTreeStats(),
      ]);

      setTree(treeData);
      setStats(statsData);
      setFeedback(null);

      return treeData;
    } catch (error) {
      setFeedback({
        kind: "error",
        text: error.message || "Não foi possível carregar a árvore.",
      });

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Pesquisa um livro pelo ID.
  const search = useCallback(async (id) => {
    try {
      setSearching(true);

      const response = await searchBookInTree(id);

      // Algumas APIs retornam { success, data }.
      const book = response?.data?.data ?? response?.data ?? response;

      setSelectedBook(book);
      setLastOp(`Pesquisar livro ${id}`);

      setFeedback({
        kind: "success",
        text: `Livro ${id} encontrado na árvore.`,
      });

      return book;
    } catch (error) {
      setSelectedBook(null);

      setFeedback({
        kind: "error",
        text: error.message || "Livro não encontrado na árvore.",
      });

      return false;
    } finally {
      setSearching(false);
    }
  }, []);

  // Atualiza os dados da árvore.
  const refresh = useCallback(async () => {
    return loadTree();
  }, [loadTree]);

  // Converte a resposta da API para o visualizador.
  const convertedTree = useMemo(() => {
    return convertApiTree(tree);
  }, [tree]);

  // Retorna o livro associado a determinado nó.
  const bookFor = useCallback(
    (nodeId) => {
      return convertedTree.books[nodeId] ?? null;
    },
    [convertedTree],
  );

  // Snapshot utilizado pelo RedBlackTreeVisualizer.
  const snapshot = convertedTree.snapshot;

  useEffect(() => {
    loadTree().catch(() => {});
  }, [loadTree]);

  // Stats adaptados para o TreeStats (parcial)
  const adaptedStats = useMemo(() => {
    if (!stats) return {};
    return {
      nodeCount: stats.nodeCount ?? 0,
      height: stats.height ?? 0,
      blackHeight: null,
      validation: null,
      inOrder: [],
      preOrder: [],
      postOrder: [],
    };
  }, [stats]);

  return {
    // Dados originais da API.
    tree,
    stats: adaptedStats,

    // Dados preparados para o visualizador.
    snapshot,
    bookFor,

    // Estados.
    loading,
    searching,
    selectedBook,
    feedback,
    lastOp,

    // Operações (somente leitura / pesquisa).
    search,
    refresh,
    loadTree,

    // Stubs para controles que não se aplicam ao catálogo real
    insert: undefined,
    remove: undefined,
    clear: undefined,
    loadExample: undefined,
    randomTree: undefined,
    undo: undefined,
    canUndo: false,
    steps: [],
    stepIndex: 0,
    step: null,
    result: {},
    highlight: null,
    playback: {},
  };
}
