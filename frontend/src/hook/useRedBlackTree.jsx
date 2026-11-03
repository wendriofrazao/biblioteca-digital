import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RedBlackTree } from "../lib/RedBlackTree.jsx";
import { CATALOG } from "../lib/catalog.jsx";

export function useRedBlackTree() {
  const treeRef = useRef(null);

  if (!treeRef.current) {
    treeRef.current = RedBlackTree.from(CATALOG);
  }

  const [version, setVersion] = useState(0);
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState(null);
  const [lastOp, setLastOp] = useState("Árvore de exemplo carregada");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [feedback, setFeedback] = useState(null);

  const steps = result?.steps ?? [];

  const bump = () => setVersion((v) => v + 1);

  const pushUndo = (label) => {
    setHistory((h) => [
      ...h.slice(-49),
      {
        tree: treeRef.current.clone(),
        label,
      },
    ]);
  };

  const runResult = (r, label) => {
    setResult(r);
    setStepIndex(0);
    setPlaying(r.steps.length > 1);
    setLastOp(label);

    setFeedback({
      kind: r.success ? (r.type === "search" ? "info" : "success") : "error",
      text: r.message,
    });

    bump();
  };

  const parse = (raw) => {
    const value = String(raw).trim();

    if (!/^-?\d+$/.test(value)) {
      setFeedback({
        kind: "error",
        text: "Entrada inválida: introduza um número inteiro.",
      });

      return null;
    }

    const number = Number(value);

    if (Math.abs(number) > 99999) {
      setFeedback({
        kind: "error",
        text: "Use valores entre -99999 e 99999.",
      });

      return null;
    }

    return number;
  };

  const insert = useCallback((raw) => {
    const value = parse(raw);

    if (value === null) return false;

    const backup = treeRef.current.clone();
    const operation = treeRef.current.insert(value);

    if (operation.success) {
      setHistory((h) => [
        ...h.slice(-49),
        {
          tree: backup,
          label: `Inserir ${value}`,
        },
      ]);
    }

    runResult(operation, `Inserir ${value}`);

    return operation.success;
  }, []);

  const remove = useCallback((raw) => {
    const value = parse(raw);

    if (value === null) return false;

    const backup = treeRef.current.clone();
    const operation = treeRef.current.delete(value);

    if (operation.success) {
      setHistory((h) => [
        ...h.slice(-49),
        {
          tree: backup,
          label: `Remover ${value}`,
        },
      ]);
    }

    runResult(operation, `Remover ${value}`);

    return operation.success;
  }, []);

  const search = useCallback((raw) => {
    const value = typeof raw === "number" ? raw : parse(raw);

    if (value === null) return false;

    const operation = treeRef.current.search(value);

    runResult(operation, `Pesquisar ${value}`);

    return operation.success;
  }, []);

  const replaceTree = (tree, label, message) => {
    pushUndo(label);

    treeRef.current = tree;

    setResult(null);
    setPlaying(false);
    setLastOp(label);

    setFeedback({
      kind: "success",
      text: message,
    });

    bump();
  };

  const loadExample = useCallback(() => {
    replaceTree(
      RedBlackTree.from(EXAMPLE_VALUES),
      "Inserir exemplo",
      `Exemplo inserido: ${EXAMPLE_VALUES.join(", ")}.`,
    );
  }, []);

  const randomTree = useCallback((count = 12) => {
    const values = new Set();

    while (values.size < count) {
      values.add(1 + Math.floor(Math.random() * 99));
    }

    const numbers = [...values];

    replaceTree(
      RedBlackTree.from(numbers),
      "Árvore aleatória",
      `Árvore aleatória gerada com ${count} valores: ${numbers.join(", ")}.`,
    );
  }, []);

  const clear = useCallback(() => {
    replaceTree(new RedBlackTree(), "Limpar árvore", "A árvore foi limpa.");
  }, []);

  const undo = useCallback(() => {
    setHistory((h) => {
      const last = h[h.length - 1];

      if (!last) return h;

      treeRef.current = last.tree;

      setResult(null);
      setPlaying(false);
      setLastOp(`Desfazer (${last.label})`);

      setFeedback({
        kind: "info",
        text: `Operação desfeita: ${last.label}.`,
      });

      bump();

      return h.slice(0, -1);
    });
  }, []);

  // Reprodução das etapas da operação
  useEffect(() => {
    if (!playing) return;

    if (stepIndex >= steps.length - 1) {
      setPlaying(false);
      return;
    }

    const id = setTimeout(() => {
      setStepIndex((index) => Math.min(index + 1, steps.length - 1));
    }, 1300 / speed);

    return () => clearTimeout(id);
  }, [playing, stepIndex, steps.length, speed]);

  const step = steps[stepIndex] ?? null;

  // Estatísticas da árvore
  const stats = useMemo(() => {
    const tree = treeRef.current;
    const validation = tree.validate();

    return {
      nodeCount: tree.getNodeCount(),
      height: tree.getHeight(),
      blackHeight: validation.blackHeight,
      validation,
      inOrder: tree.inOrderTraversal(),
      preOrder: tree.preOrderTraversal(),
      postOrder: tree.postOrderTraversal(),
    };
  }, [version]);

  // Snapshot atual da árvore
  const liveSnapshot = useMemo(() => {
    return treeRef.current.snapshot();
  }, [version]);

  const snapshot = step?.snapshot ?? liveSnapshot;

  return {
    tree: treeRef.current,
    snapshot,
    step,
    steps,
    stepIndex,
    result,
    stats,
    lastOp,
    feedback,

    canUndo: history.length > 0,

    playback: {
      playing,
      speed,
      setSpeed,

      play: () => {
        if (stepIndex >= steps.length - 1) {
          setStepIndex(0);
        }

        setPlaying(true);
      },

      pause: () => {
        setPlaying(false);
      },

      next: () => {
        setPlaying(false);

        setStepIndex((index) =>
          Math.min(index + 1, Math.max(steps.length - 1, 0)),
        );
      },

      prev: () => {
        setPlaying(false);

        setStepIndex((index) => Math.max(index - 1, 0));
      },

      restart: () => {
        setStepIndex(0);
        setPlaying(true);
      },

      goTo: (index) => {
        setPlaying(false);
        setStepIndex(index);
      },
    },

    insert,
    remove,
    search,
    loadExample,
    randomTree,
    clear,
    undo,
  };
}
