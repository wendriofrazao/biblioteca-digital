import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRedBlackTree } from "../lib/redBlackTreeCore.jsx";

const EXAMPLE_VALUES = [10, 20, 30, 15, 25, 5, 1, 12, 18, 28];

function randomValues(count = 12) {
  const set = new Set();
  while (set.size < count) {
    set.add(Math.floor(Math.random() * 90) + 1);
  }
  return Array.from(set);
}

export function useDemoRedBlackTree() {
  const treeRef = useRef(null);
  if (!treeRef.current) {
    treeRef.current = createRedBlackTree();
  }
  const tree = treeRef.current;

  const [snapshot, setSnapshot] = useState(() => tree.serialize());
  const [stats, setStats] = useState(() => tree.getStats());
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [lastOp, setLastOp] = useState("Nenhuma");
  const [feedback, setFeedback] = useState(null);
  const [result, setResult] = useState({
    rotations: 0,
    comparisons: 0,
    recolorings: 0,
  });
  const [history, setHistory] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const playTimer = useRef(null);

  const applySnapshot = useCallback(
    (s) => {
      setSnapshot(s ?? tree.serialize());
      setStats(tree.getStats());
    },
    [tree],
  );

  const pushHistory = useCallback(() => {
    const current = tree.serialize();
    setHistory((h) => {
      const next = [...h, current];
      return next.slice(-30);
    });
  }, [tree]);

  const finishOperation = useCallback(
    (opResult, opName) => {
      const opSteps = opResult.steps ?? [];
      setSteps(opSteps);
      setStepIndex(Math.max(0, opSteps.length - 1));
      setResult({
        rotations: opResult.rotations ?? 0,
        comparisons: opResult.comparisons ?? 0,
        recolorings: opResult.recolorings ?? 0,
      });
      setLastOp(opName);
      applySnapshot(opSteps[opSteps.length - 1]?.snapshot);
      setFeedback({
        kind: opResult.success === false ? "error" : "success",
        text:
          opResult.success === false
            ? opResult.reason === "duplicate"
              ? "Valor já existe na árvore."
              : opResult.reason === "not-found"
                ? "Valor não encontrado."
                : "Operação falhou."
            : `${opName} concluída.`,
      });
    },
    [applySnapshot],
  );

  const insert = useCallback(
    (value) => {
      if (!Number.isFinite(value)) return false;
      pushHistory();
      const res = tree.insert(value);
      finishOperation(res, `Inserir ${value}`);
      return res.success !== false;
    },
    [tree, pushHistory, finishOperation],
  );

  const search = useCallback(
    (value) => {
      if (!Number.isFinite(value)) return false;
      const res = tree.search(value);
      finishOperation(res, `Pesquisar ${value}`);
      return res.success;
    },
    [tree, finishOperation],
  );

  const remove = useCallback(
    (value) => {
      if (!Number.isFinite(value)) return false;
      pushHistory();
      const res = tree.remove(value);
      finishOperation(res, `Remover ${value}`);
      return res.success !== false;
    },
    [tree, pushHistory, finishOperation],
  );

  const clear = useCallback(() => {
    pushHistory();
    const res = tree.clear();
    finishOperation(res, "Limpar árvore");
    setFeedback({ kind: "success", text: "Árvore limpa." });
  }, [tree, pushHistory, finishOperation]);

  const loadExample = useCallback(() => {
    pushHistory();
    tree.clear();
    const res = tree.loadValues(EXAMPLE_VALUES);
    finishOperation(res, "Inserir exemplo");
    setFeedback({ kind: "success", text: "Exemplo carregado." });
  }, [tree, pushHistory, finishOperation]);

  const randomTree = useCallback(() => {
    pushHistory();
    tree.clear();
    const values = randomValues(12);
    const res = tree.loadValues(values);
    finishOperation(res, "Árvore aleatória");
    setFeedback({ kind: "success", text: "Árvore aleatória gerada." });
  }, [tree, pushHistory, finishOperation]);

  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      // Rebuild tree from previous snapshot by re-inserting values
      tree.clear();
      const values = [];
      const walk = (id) => {
        if (id == null) return;
        const n = prev.nodes[id];
        if (!n) return;
        values.push(n.value);
        walk(n.left);
        walk(n.right);
      };
      walk(prev.rootId);
      // insert in order that roughly preserves structure (in-order is sorted, so rebuild via sequential insert)
      values.sort((a, b) => a - b);
      // Better: just load the values; structure may differ slightly but is valid
      tree.loadValues(values);
      applySnapshot(tree.serialize());
      setSteps([]);
      setStepIndex(0);
      setLastOp("Desfazer");
      setFeedback({ kind: "success", text: "Última operação desfeita." });
      setStats(tree.getStats());
      return h.slice(0, -1);
    });
  }, [tree, applySnapshot]);

  const canUndo = history.length > 0;

  // Playback
  const goTo = useCallback(
    (index) => {
      if (!steps.length) return;
      const i = Math.max(0, Math.min(index, steps.length - 1));
      setStepIndex(i);
      const step = steps[i];
      if (step?.snapshot) {
        setSnapshot(step.snapshot);
      }
    },
    [steps],
  );

  const next = useCallback(() => {
    goTo(stepIndex + 1);
  }, [goTo, stepIndex]);

  const prev = useCallback(() => {
    goTo(stepIndex - 1);
  }, [goTo, stepIndex]);

  const restart = useCallback(() => {
    goTo(0);
    setPlaying(false);
  }, [goTo]);

  const play = useCallback(() => {
    if (!steps.length) return;
    setPlaying(true);
  }, [steps]);

  const pause = useCallback(() => {
    setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing || !steps.length) return undefined;

    if (stepIndex >= steps.length - 1) {
      setPlaying(false);
      return undefined;
    }

    const delay = 900 / Math.max(0.25, speed);
    playTimer.current = window.setTimeout(() => {
      goTo(stepIndex + 1);
    }, delay);

    return () => {
      if (playTimer.current) clearTimeout(playTimer.current);
    };
  }, [playing, stepIndex, steps, speed, goTo]);

  const step = steps[stepIndex] ?? null;

  const highlight = useMemo(() => {
    if (!step) return {};
    return {
      path: step.path ?? [],
      rotated: step.rotated ?? [],
      recolored: step.recolored ?? [],
      related: step.related ?? [],
      current: step.current ?? null,
      newNode: step.newNode ?? null,
      found: step.found ?? null,
      removed: step.removed ?? null,
    };
  }, [step]);

  const bookFor = useCallback(
    (nodeId) => {
      return snapshot?.books?.[nodeId] ?? null;
    },
    [snapshot],
  );

  const playback = {
    playing,
    play,
    pause,
    next,
    prev,
    restart,
    goTo,
    speed,
    setSpeed,
  };

  return {
    snapshot: snapshot ?? { rootId: null, nodes: {} },
    bookFor,
    highlight,
    stats,
    steps,
    stepIndex,
    step,
    result,
    lastOp,
    feedback,
    loading: false,
    searching: false,
    selectedBook: null,

    insert,
    search,
    remove,
    clear,
    loadExample,
    randomTree,
    undo,
    canUndo,
    refresh: () => applySnapshot(tree.serialize()),
    loadTree: () => applySnapshot(tree.serialize()),

    playback,
  };
}
