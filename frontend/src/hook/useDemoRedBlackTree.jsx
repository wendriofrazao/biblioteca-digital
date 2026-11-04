import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRedBlackTree } from "../lib/redBlackTreeCore.jsx";

const EXAMPLE_VALUES = [10, 20, 30, 15, 25, 5, 1, 12, 18, 28];

/** Duração base (ms) por tipo de passo — operações importantes ficam mais tempo na tela. */
const STEP_DURATION = {
  start: 550,
  compare: 480,
  "insert-node": 900,
  violation: 700,
  recolor: 950,
  "rotate-left": 1100,
  "rotate-right": 1100,
  found: 1000,
  "not-found": 800,
  duplicate: 800,
  "remove-node": 950,
  successor: 900,
  "fix-delete": 800,
  done: 650,
};

function stepDelay(kind, speed) {
  const base = STEP_DURATION[kind] ?? 700;
  return Math.max(180, base / Math.max(0.25, speed));
}

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
  /** Incrementa a cada mudança de passo para forçar reanimação CSS. */
  const [animKey, setAnimKey] = useState(0);

  const playTimer = useRef(null);
  const stepsRef = useRef([]);
  const speedRef = useRef(1);

  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

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
    (opResult, opName, { autoPlay = true } = {}) => {
      const opSteps = opResult.steps ?? [];
      setSteps(opSteps);
      stepsRef.current = opSteps;
      setResult({
        rotations: opResult.rotations ?? 0,
        comparisons: opResult.comparisons ?? 0,
        recolorings: opResult.recolorings ?? 0,
      });
      setLastOp(opName);
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

      if (opSteps.length > 0) {
        setStepIndex(0);
        setAnimKey((k) => k + 1);
        applySnapshot(opSteps[0].snapshot);
        if (autoPlay && opSteps.length > 1) {
          setPlaying(true);
        } else {
          setPlaying(false);
          if (opSteps.length === 1) {
            applySnapshot(opSteps[0].snapshot);
          }
        }
      } else {
        setStepIndex(0);
        setPlaying(false);
        applySnapshot(tree.serialize());
      }
    },
    [applySnapshot, tree],
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
    finishOperation(res, "Limpar árvore", { autoPlay: false });
    setFeedback({ kind: "success", text: "Árvore limpa." });
  }, [tree, pushHistory, finishOperation]);

  const loadExample = useCallback(() => {
    pushHistory();
    tree.clear();
    const res = tree.loadValues(EXAMPLE_VALUES);
    finishOperation(res, "Inserir exemplo", { autoPlay: false });
    applySnapshot(tree.serialize());
    setStats(tree.getStats());
    setFeedback({ kind: "success", text: "Exemplo carregado." });
  }, [tree, pushHistory, finishOperation, applySnapshot]);

  const randomTree = useCallback(() => {
    pushHistory();
    tree.clear();
    const values = randomValues(12);
    const res = tree.loadValues(values);
    finishOperation(res, "Árvore aleatória", { autoPlay: false });
    applySnapshot(tree.serialize());
    setStats(tree.getStats());
    setFeedback({ kind: "success", text: "Árvore aleatória gerada." });
  }, [tree, pushHistory, finishOperation, applySnapshot]);

  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
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
      values.sort((a, b) => a - b);
      tree.loadValues(values);
      applySnapshot(tree.serialize());
      setSteps([]);
      stepsRef.current = [];
      setStepIndex(0);
      setPlaying(false);
      setLastOp("Desfazer");
      setFeedback({ kind: "success", text: "Última operação desfeita." });
      setStats(tree.getStats());
      return h.slice(0, -1);
    });
  }, [tree, applySnapshot]);

  const canUndo = history.length > 0;

  const goTo = useCallback((index) => {
    const list = stepsRef.current;
    if (!list.length) return;
    const i = Math.max(0, Math.min(index, list.length - 1));
    setStepIndex(i);
    setAnimKey((k) => k + 1);
    const step = list[i];
    if (step?.snapshot) {
      setSnapshot(step.snapshot);
    }
  }, []);

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
    if (!stepsRef.current.length) return;
    setStepIndex((i) => {
      const list = stepsRef.current;
      if (i >= list.length - 1) {
        const first = list[0];
        if (first?.snapshot) setSnapshot(first.snapshot);
        setAnimKey((k) => k + 1);
        return 0;
      }
      return i;
    });
    setPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing || !steps.length) return undefined;

    if (stepIndex >= steps.length - 1) {
      setPlaying(false);
      return undefined;
    }

    const kind = steps[stepIndex]?.kind;
    const delay = stepDelay(kind, speed);

    playTimer.current = window.setTimeout(() => {
      goTo(stepIndex + 1);
    }, delay);

    return () => {
      if (playTimer.current) clearTimeout(playTimer.current);
    };
  }, [playing, stepIndex, steps, speed, goTo]);

  const step = steps[stepIndex] ?? null;

  const highlight = useMemo(() => {
    if (!step) return { animKey };
    return {
      path: step.path ?? [],
      rotated: step.rotated ?? [],
      recolored: step.recolored ?? [],
      related: step.related ?? [],
      current: step.current ?? null,
      newNode: step.newNode ?? null,
      found: step.found ?? null,
      removed: step.removed ?? null,
      kind: step.kind ?? null,
      animKey,
    };
  }, [step, animKey]);

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
