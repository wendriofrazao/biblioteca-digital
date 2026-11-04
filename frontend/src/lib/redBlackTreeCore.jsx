/**
 * Core Red-Black Tree implementation with step recording for visualization.
 * Nodes: { id, value, color: 'RED'|'BLACK', left, right, parent }
 * NIL is represented as null.
 */

const RED = "RED";
const BLACK = "BLACK";

let nextId = 1;

function createNode(value, color = RED) {
  return {
    id: nextId++,
    value,
    color,
    left: null,
    right: null,
    parent: null,
  };
}

function isRed(node) {
  return node != null && node.color === RED;
}

function isBlack(node) {
  return node == null || node.color === BLACK;
}

/**
 * Creates a fresh empty tree state + helpers that record steps.
 */
export function createRedBlackTree() {
  let root = null;
  let steps = [];
  let comparisons = 0;
  let rotations = 0;
  let recolorings = 0;

  function resetCounters() {
    comparisons = 0;
    rotations = 0;
    recolorings = 0;
    steps = [];
  }

  function pushStep(kind, message, extra = {}) {
    const snapshot = serialize();
    steps.push({
      kind,
      message,
      snapshot,
      comparisons,
      rotations,
      recolorings,
      ...extra,
    });
  }

  function serializeNode(node, nodes = {}, books = {}) {
    if (!node) return null;
    nodes[node.id] = {
      id: node.id,
      value: node.value,
      color: node.color,
      left: node.left?.id ?? null,
      right: node.right?.id ?? null,
    };
    books[node.id] = {
      id: node.value,
      titulo: `Valor ${node.value}`,
      value: node.value,
    };
    serializeNode(node.left, nodes, books);
    serializeNode(node.right, nodes, books);
    return node.id;
  }

  function serialize() {
    const nodes = {};
    const books = {};
    const rootId = serializeNode(root, nodes, books);
    return { rootId, nodes, books };
  }

  function rotateLeft(x) {
    const y = x.right;
    x.right = y.left;
    if (y.left) y.left.parent = x;
    y.parent = x.parent;
    if (!x.parent) root = y;
    else if (x === x.parent.left) x.parent.left = y;
    else x.parent.right = y;
    y.left = x;
    x.parent = y;
    rotations += 1;
    pushStep("rotate-left", `Rotação à esquerda em torno de ${x.value}`, {
      rotated: [x.id, y.id],
      current: y.id,
    });
  }

  function rotateRight(x) {
    const y = x.left;
    x.left = y.right;
    if (y.right) y.right.parent = x;
    y.parent = x.parent;
    if (!x.parent) root = y;
    else if (x === x.parent.right) x.parent.right = y;
    else x.parent.left = y;
    y.right = x;
    x.parent = y;
    rotations += 1;
    pushStep("rotate-right", `Rotação à direita em torno de ${x.value}`, {
      rotated: [x.id, y.id],
      current: y.id,
    });
  }

  function insertFixup(z) {
    while (isRed(z.parent)) {
      const parent = z.parent;
      const grand = parent.parent;
      if (!grand) break;

      if (parent === grand.left) {
        const uncle = grand.right;
        if (isRed(uncle)) {
          parent.color = BLACK;
          uncle.color = BLACK;
          grand.color = RED;
          recolorings += 3;
          pushStep(
            "recolor",
            `Recoloração: pai ${parent.value}, tio ${uncle?.value}, avô ${grand.value}`,
            {
              recolored: [parent.id, uncle?.id, grand.id].filter(Boolean),
              current: grand.id,
            },
          );
          z = grand;
        } else {
          if (z === parent.right) {
            z = parent;
            rotateLeft(z);
          }
          z.parent.color = BLACK;
          grand.color = RED;
          recolorings += 2;
          pushStep(
            "recolor",
            `Recoloração antes da rotação: pai ${z.parent.value}, avô ${grand.value}`,
            {
              recolored: [z.parent.id, grand.id],
            },
          );
          rotateRight(grand);
        }
      } else {
        const uncle = grand.left;
        if (isRed(uncle)) {
          parent.color = BLACK;
          uncle.color = BLACK;
          grand.color = RED;
          recolorings += 3;
          pushStep(
            "recolor",
            `Recoloração: pai ${parent.value}, tio ${uncle?.value}, avô ${grand.value}`,
            {
              recolored: [parent.id, uncle?.id, grand.id].filter(Boolean),
              current: grand.id,
            },
          );
          z = grand;
        } else {
          if (z === parent.left) {
            z = parent;
            rotateRight(z);
          }
          z.parent.color = BLACK;
          grand.color = RED;
          recolorings += 2;
          pushStep(
            "recolor",
            `Recoloração antes da rotação: pai ${z.parent.value}, avô ${grand.value}`,
            {
              recolored: [z.parent.id, grand.id],
            },
          );
          rotateLeft(grand);
        }
      }
    }
    if (root && root.color === RED) {
      root.color = BLACK;
      recolorings += 1;
      pushStep("recolor", `Raiz ${root.value} pintada de preto`, {
        recolored: [root.id],
        current: root.id,
      });
    }
  }

  function insert(value) {
    resetCounters();
    pushStep("start", `Inserindo valor ${value}`);

    let y = null;
    let x = root;
    const path = [];

    while (x) {
      comparisons += 1;
      path.push(x.id);
      pushStep("compare", `Comparando ${value} com ${x.value}`, {
        path: [...path],
        current: x.id,
      });
      y = x;
      if (value < x.value) x = x.left;
      else if (value > x.value) x = x.right;
      else {
        pushStep("duplicate", `Valor ${value} já existe na árvore`, {
          path: [...path],
          found: x.id,
        });
        pushStep("done", `Inserção abortada (duplicado)`, { path: [...path] });
        return {
          success: false,
          reason: "duplicate",
          steps,
          comparisons,
          rotations,
          recolorings,
        };
      }
    }

    const z = createNode(value, RED);
    z.parent = y;
    if (!y) {
      root = z;
      pushStep("insert-node", `Novo nó ${value} inserido como raiz`, {
        newNode: z.id,
        current: z.id,
      });
    } else if (value < y.value) {
      y.left = z;
      pushStep(
        "insert-node",
        `Novo nó ${value} inserido à esquerda de ${y.value}`,
        {
          newNode: z.id,
          current: z.id,
          related: [y.id],
        },
      );
    } else {
      y.right = z;
      pushStep(
        "insert-node",
        `Novo nó ${value} inserido à direita de ${y.value}`,
        {
          newNode: z.id,
          current: z.id,
          related: [y.id],
        },
      );
    }

    pushStep(
      "violation",
      `Verificando propriedades Rubro-Negras após inserção`,
      {
        current: z.id,
        path: path.concat(z.id),
      },
    );

    insertFixup(z);

    pushStep("done", `Inserção de ${value} concluída`, {
      current: z.id,
    });

    return {
      success: true,
      steps,
      comparisons,
      rotations,
      recolorings,
      nodeId: z.id,
    };
  }

  function search(value) {
    resetCounters();
    pushStep("start", `Pesquisando valor ${value}`);

    let x = root;
    const path = [];

    while (x) {
      comparisons += 1;
      path.push(x.id);
      pushStep("compare", `Comparando ${value} com ${x.value}`, {
        path: [...path],
        current: x.id,
      });
      if (value === x.value) {
        pushStep("found", `Valor ${value} encontrado`, {
          path: [...path],
          found: x.id,
          current: x.id,
        });
        pushStep("done", `Pesquisa concluída`, {
          found: x.id,
          path: [...path],
        });
        return { success: true, node: x, steps, comparisons };
      }
      if (value < x.value) x = x.left;
      else x = x.right;
    }

    pushStep("not-found", `Valor ${value} não encontrado`, { path: [...path] });
    pushStep("done", `Pesquisa concluída`, { path: [...path] });
    return { success: false, steps, comparisons };
  }

  function transplant(u, v) {
    if (!u.parent) root = v;
    else if (u === u.parent.left) u.parent.left = v;
    else u.parent.right = v;
    if (v) v.parent = u.parent;
  }

  function minimum(node) {
    while (node.left) node = node.left;
    return node;
  }

  function deleteFixup(x, xParent) {
    while (x !== root && isBlack(x)) {
      if (
        x === (xParent?.left ?? null) ||
        (x == null && xParent && xParent.left == null)
      ) {
        let w = xParent?.right;
        if (isRed(w)) {
          w.color = BLACK;
          xParent.color = RED;
          recolorings += 2;
          pushStep(
            "recolor",
            `Tio vermelho: recoloração de ${w.value} e ${xParent.value}`,
            {
              recolored: [w.id, xParent.id],
            },
          );
          rotateLeft(xParent);
          w = xParent.right;
        }
        if (isBlack(w?.left) && isBlack(w?.right)) {
          if (w) {
            w.color = RED;
            recolorings += 1;
            pushStep(
              "recolor",
              `Ambos filhos pretos: tio ${w.value} fica vermelho`,
              {
                recolored: [w.id],
              },
            );
          }
          x = xParent;
          xParent = x?.parent;
        } else {
          if (isBlack(w?.right)) {
            if (w?.left) {
              w.left.color = BLACK;
              recolorings += 1;
            }
            if (w) {
              w.color = RED;
              recolorings += 1;
              pushStep("recolor", `Filho direito preto: recoloração no tio`, {
                recolored: [w.id, w.left?.id].filter(Boolean),
              });
              rotateRight(w);
              w = xParent.right;
            }
          }
          if (w) {
            w.color = xParent.color;
            recolorings += 1;
          }
          xParent.color = BLACK;
          if (w?.right) {
            w.right.color = BLACK;
            recolorings += 1;
          }
          recolorings += 1;
          pushStep("recolor", `Correção final no lado esquerdo`, {
            recolored: [w?.id, xParent.id, w?.right?.id].filter(Boolean),
          });
          rotateLeft(xParent);
          x = root;
          xParent = null;
        }
      } else {
        let w = xParent?.left;
        if (isRed(w)) {
          w.color = BLACK;
          xParent.color = RED;
          recolorings += 2;
          pushStep(
            "recolor",
            `Tio vermelho: recoloração de ${w.value} e ${xParent.value}`,
            {
              recolored: [w.id, xParent.id],
            },
          );
          rotateRight(xParent);
          w = xParent.left;
        }
        if (isBlack(w?.right) && isBlack(w?.left)) {
          if (w) {
            w.color = RED;
            recolorings += 1;
            pushStep(
              "recolor",
              `Ambos filhos pretos: tio ${w.value} fica vermelho`,
              {
                recolored: [w.id],
              },
            );
          }
          x = xParent;
          xParent = x?.parent;
        } else {
          if (isBlack(w?.left)) {
            if (w?.right) {
              w.right.color = BLACK;
              recolorings += 1;
            }
            if (w) {
              w.color = RED;
              recolorings += 1;
              pushStep("recolor", `Filho esquerdo preto: recoloração no tio`, {
                recolored: [w.id, w.right?.id].filter(Boolean),
              });
              rotateLeft(w);
              w = xParent.left;
            }
          }
          if (w) {
            w.color = xParent.color;
            recolorings += 1;
          }
          xParent.color = BLACK;
          if (w?.left) {
            w.left.color = BLACK;
            recolorings += 1;
          }
          recolorings += 1;
          pushStep("recolor", `Correção final no lado direito`, {
            recolored: [w?.id, xParent.id, w?.left?.id].filter(Boolean),
          });
          rotateRight(xParent);
          x = root;
          xParent = null;
        }
      }
    }
    if (x) {
      x.color = BLACK;
      recolorings += 1;
      pushStep("recolor", `Nó ${x.value} pintado de preto`, {
        recolored: [x.id],
      });
    }
  }

  function remove(value) {
    resetCounters();
    pushStep("start", `Removendo valor ${value}`);

    let z = root;
    const path = [];
    while (z) {
      comparisons += 1;
      path.push(z.id);
      pushStep("compare", `Comparando ${value} com ${z.value}`, {
        path: [...path],
        current: z.id,
      });
      if (value === z.value) break;
      if (value < z.value) z = z.left;
      else z = z.right;
    }

    if (!z) {
      pushStep("not-found", `Valor ${value} não encontrado para remoção`, {
        path,
      });
      pushStep("done", `Remoção abortada`, { path });
      return { success: false, reason: "not-found", steps, comparisons };
    }

    pushStep("found", `Nó ${value} encontrado para remoção`, {
      path: [...path],
      found: z.id,
      removed: z.id,
    });

    let y = z;
    let yOriginalColor = y.color;
    let x = null;
    let xParent = null;

    if (!z.left) {
      x = z.right;
      xParent = z.parent;
      transplant(z, z.right);
      pushStep("remove-node", `Nó ${value} removido (sem filho esquerdo)`, {
        removed: z.id,
        current: x?.id,
      });
    } else if (!z.right) {
      x = z.left;
      xParent = z.parent;
      transplant(z, z.left);
      pushStep("remove-node", `Nó ${value} removido (sem filho direito)`, {
        removed: z.id,
        current: x?.id,
      });
    } else {
      y = minimum(z.right);
      yOriginalColor = y.color;
      x = y.right;
      if (y.parent === z) {
        xParent = y;
        if (x) x.parent = y;
      } else {
        xParent = y.parent;
        transplant(y, y.right);
        y.right = z.right;
        if (y.right) y.right.parent = y;
      }
      transplant(z, y);
      y.left = z.left;
      if (y.left) y.left.parent = y;
      y.color = z.color;
      pushStep("successor", `Sucessor ${y.value} substitui o nó ${value}`, {
        removed: z.id,
        current: y.id,
        related: [y.id],
      });
      pushStep("remove-node", `Nó ${value} removido via sucessor`, {
        removed: z.id,
        current: y.id,
      });
    }

    if (yOriginalColor === BLACK) {
      pushStep(
        "fix-delete",
        `Corrigindo propriedades após remoção de nó preto`,
        {
          current: x?.id ?? xParent?.id,
        },
      );
      deleteFixup(x, xParent);
    }

    pushStep("done", `Remoção de ${value} concluída`);
    return { success: true, steps, comparisons, rotations, recolorings };
  }

  function clear() {
    root = null;
    resetCounters();
    pushStep("done", "Árvore limpa");
    return { success: true, steps };
  }

  function getHeight(node = root) {
    if (!node) return 0;
    return 1 + Math.max(getHeight(node.left), getHeight(node.right));
  }

  function getBlackHeight(node = root) {
    let h = 0;
    let n = node;
    while (n) {
      if (n.color === BLACK) h += 1;
      n = n.left; // any path
    }
    return h;
  }

  function inOrder(node = root, acc = []) {
    if (!node) return acc;
    inOrder(node.left, acc);
    acc.push(node.value);
    inOrder(node.right, acc);
    return acc;
  }

  function preOrder(node = root, acc = []) {
    if (!node) return acc;
    acc.push(node.value);
    preOrder(node.left, acc);
    preOrder(node.right, acc);
    return acc;
  }

  function postOrder(node = root, acc = []) {
    if (!node) return acc;
    postOrder(node.left, acc);
    postOrder(node.right, acc);
    acc.push(node.value);
    return acc;
  }

  function countNodes(node = root) {
    if (!node) return 0;
    return 1 + countNodes(node.left) + countNodes(node.right);
  }

  function validate() {
    const errors = [];
    if (!root) {
      return { valid: true, errors: [] };
    }
    if (root.color !== BLACK) {
      errors.push("A raiz deve ser preta.");
    }

    function check(node, blackCount, pathBlack) {
      if (!node) {
        if (pathBlack === null) return blackCount;
        if (blackCount !== pathBlack) {
          errors.push("Altura negra inconsistente em caminhos diferentes.");
        }
        return pathBlack ?? blackCount;
      }
      if (node.color === RED) {
        if (isRed(node.left) || isRed(node.right)) {
          errors.push(`Nó vermelho ${node.value} possui filho vermelho.`);
        }
      }
      const nextBlack = blackCount + (node.color === BLACK ? 1 : 0);
      const left = check(node.left, nextBlack, pathBlack);
      return check(node.right, nextBlack, left);
    }

    check(root, 0, null);
    return {
      valid: errors.length === 0,
      errors: [...new Set(errors)],
    };
  }

  function getStats() {
    const validation = validate();
    return {
      nodeCount: countNodes(),
      height: getHeight(),
      blackHeight: getBlackHeight(),
      inOrder: inOrder(),
      preOrder: preOrder(),
      postOrder: postOrder(),
      validation,
    };
  }

  function loadValues(values) {
    clear();
    const allSteps = [];
    let totalComp = 0;
    let totalRot = 0;
    let totalRec = 0;
    for (const v of values) {
      const res = insert(v);
      allSteps.push(...(res.steps || []));
      totalComp += res.comparisons || 0;
      totalRot += res.rotations || 0;
      totalRec += res.recolorings || 0;
    }
    // After bulk, keep only a final done step for cleaner UX, or keep all
    steps = allSteps;
    comparisons = totalComp;
    rotations = totalRot;
    recolorings = totalRec;
    return { success: true, steps, comparisons, rotations, recolorings };
  }

  return {
    insert,
    search,
    remove,
    clear,
    loadValues,
    serialize,
    getStats,
    getRoot: () => root,
    getSteps: () => steps,
    getCounters: () => ({ comparisons, rotations, recolorings }),
  };
}

export { RED, BLACK };
