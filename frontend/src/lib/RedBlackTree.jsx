export class RBNode {
  constructor(value, color, left, right, parent, id) {
    this.value = value;
    this.color = color;
    this.left = left;
    this.right = right;
    this.parent = parent;
    this.id = id;
  }
}

/**
 * Árvore Rubro-Negra baseada no algoritmo CLRS.
 * Valores duplicados são rejeitados.
 */
export class RedBlackTree {
  constructor(options = {}) {
    this.recordSteps = options.recordSteps ?? true;

    const nil = Object.create(RBNode.prototype);

    Object.assign(nil, {
      value: NaN,
      color: "BLACK",
      id: 0,
    });

    nil.left = nil;
    nil.right = nil;
    nil.parent = nil;

    this.NIL = nil;
    this.root = nil;

    this.nextId = 1;
    this.size = 0;

    this.steps = [];
    this.rotations = 0;
    this.recolorings = 0;
    this.comparisons = 0;
  }

  static from(values, options) {
    const tree = new RedBlackTree(options);

    for (const value of values) {
      tree.insert(value);
    }

    return tree;
  }

  begin() {
    this.steps = [];
    this.rotations = 0;
    this.recolorings = 0;
    this.comparisons = 0;
  }

  record(kind, message, highlight = {}) {
    if (!this.recordSteps) return;

    this.steps.push({
      kind,
      message,
      snapshot: this.snapshot(),
      highlight,
      rotations: this.rotations,
      comparisons: this.comparisons,
    });
  }

  finish(type, value, success, message) {
    return {
      type,
      value,
      success,
      message,
      steps: this.steps,
      rotations: this.rotations,
      recolorings: this.recolorings,
      comparisons: this.comparisons,
    };
  }

  setColor(node, color) {
    if (node !== this.NIL && node.color !== color) {
      this.recolorings++;
    }

    node.color = color;
  }

  snapshot() {
    const nodes = {};
    const stack = [];

    if (this.root !== this.NIL) {
      stack.push(this.root);
    }

    while (stack.length) {
      const node = stack.pop();

      nodes[node.id] = {
        id: node.id,
        value: node.value,
        color: node.color,
        left: node.left === this.NIL ? null : node.left.id,
        right: node.right === this.NIL ? null : node.right.id,
      };

      if (node.left !== this.NIL) stack.push(node.left);
      if (node.right !== this.NIL) stack.push(node.right);
    }

    return {
      rootId: this.root === this.NIL ? null : this.root.id,
      nodes,
    };
  }

  // Rotações

  rotateLeft(x) {
    const y = x.right;

    if (y === this.NIL) {
      throw new Error("rotateLeft requires a right child");
    }

    x.right = y.left;

    if (y.left !== this.NIL) {
      y.left.parent = x;
    }

    y.parent = x.parent;

    if (x.parent === this.NIL) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }

    y.left = x;
    x.parent = y;

    this.rotations++;

    this.record(
      "rotate-left",
      `Foi realizada uma rotação à esquerda em torno do nó ${x.value}: ${y.value} sobe e ${x.value} desce para a esquerda.`,
      { rotated: [x.id, y.id] },
    );
  }

  rotateRight(x) {
    const y = x.left;

    if (y === this.NIL) {
      throw new Error("rotateRight requires a left child");
    }

    x.left = y.right;

    if (y.right !== this.NIL) {
      y.right.parent = x;
    }

    y.parent = x.parent;

    if (x.parent === this.NIL) {
      this.root = y;
    } else if (x === x.parent.right) {
      x.parent.right = y;
    } else {
      x.parent.left = y;
    }

    y.right = x;
    x.parent = y;

    this.rotations++;

    this.record(
      "rotate-right",
      `Foi realizada uma rotação à direita em torno do nó ${x.value}: ${y.value} sobe e ${x.value} desce para a direita.`,
      { rotated: [x.id, y.id] },
    );
  }

  // Pesquisa

  findNode(value, path = []) {
    let node = this.root;

    while (node !== this.NIL) {
      this.comparisons++;
      path.push(node.id);

      if (value === node.value) {
        return node;
      }

      const goLeft = value < node.value;
      const next = goLeft ? node.left : node.right;

      this.record(
        "compare",
        `${value} ${goLeft ? "<" : ">"} ${node.value}: o valor é ${goLeft ? "menor" : "maior"} que o nó atual. A pesquisa continua à ${goLeft ? "esquerda" : "direita"}${next === this.NIL ? ", mas esse filho é NIL" : ""}.`,
        { current: node.id, path: [...path] },
      );

      node = next;
    }

    return this.NIL;
  }

  contains(value) {
    let node = this.root;

    while (node !== this.NIL) {
      if (value === node.value) return true;

      node = value < node.value ? node.left : node.right;
    }

    return false;
  }

  search(value) {
    this.begin();

    if (!Number.isFinite(value)) {
      return this.finish("search", value, false, "Valor inválido.");
    }

    if (this.root === this.NIL) {
      this.record(
        "not-found",
        "A árvore está vazia: não há nós para comparar.",
      );

      return this.finish(
        "search",
        value,
        false,
        `O valor ${value} não existe (árvore vazia).`,
      );
    }

    const path = [];

    this.record(
      "start",
      `Pesquisa de ${value}: começa na raiz (${this.root.value}).`,
      { current: this.root.id },
    );

    const node = this.findNode(value, path);

    if (node !== this.NIL) {
      this.record(
        "found",
        `${value} = ${node.value}: valor encontrado após ${this.comparisons} comparação(ões).`,
        { found: node.id, path },
      );

      return this.finish(
        "search",
        value,
        true,
        `Valor ${value} encontrado (${this.comparisons} comparações).`,
      );
    }

    this.record(
      "not-found",
      `Chegou-se a uma folha NIL: o valor ${value} não existe na árvore.`,
      { path },
    );

    return this.finish(
      "search",
      value,
      false,
      `O valor ${value} não foi encontrado.`,
    );
  }

  // Inserção

  insert(value) {
    this.begin();

    if (!Number.isFinite(value)) {
      return this.finish("insert", value, false, "Valor inválido.");
    }

    let y = this.NIL;
    let x = this.root;

    const path = [];

    if (x !== this.NIL) {
      this.record(
        "start",
        `Inserção de ${value}: começa na raiz (${x.value}).`,
        { current: x.id },
      );
    }

    while (x !== this.NIL) {
      y = x;
      this.comparisons++;
      path.push(x.id);

      if (value === x.value) {
        this.record(
          "duplicate",
          `${value} já existe na árvore. Chaves duplicadas são rejeitadas.`,
          { current: x.id, path: [...path] },
        );

        return this.finish(
          "insert",
          value,
          false,
          `O valor ${value} já existe (duplicados não são permitidos).`,
        );
      }

      const goLeft = value < x.value;

      this.record(
        "compare",
        `${value} ${goLeft ? "<" : ">"} ${x.value}: o valor é ${goLeft ? "menor" : "maior"} que o nó atual. Continua à ${goLeft ? "esquerda" : "direita"}.`,
        { current: x.id, path: [...path] },
      );

      x = goLeft ? x.left : x.right;
    }

    const z = new RBNode(value, "RED", this.NIL, this.NIL, y, this.nextId++);

    if (y === this.NIL) {
      this.root = z;
    } else if (value < y.value) {
      y.left = z;
    } else {
      y.right = z;
    }

    this.size++;

    this.record(
      "insert-node",
      y === this.NIL
        ? `Foi inserido um novo nó vermelho (${value}) como raiz.`
        : `Foi inserido um novo nó vermelho (${value}) como filho ${value < y.value ? "esquerdo" : "direito"} de ${y.value}.`,
      { newNode: z.id, path },
    );

    this.fixInsert(z);

    this.record(
      "done",
      "A árvore voltou a satisfazer todas as propriedades Rubro-Negras.",
      { found: z.id },
    );

    return this.finish(
      "insert",
      value,
      true,
      `Valor ${value} inserido (${this.rotations} rotações).`,
    );
  }

  fixInsert(z) {
    if (z.parent !== this.NIL && z.parent.color === "BLACK") {
      this.record(
        "violation",
        `O pai (${z.parent.value}) é preto: não há dois vermelhos consecutivos, nenhuma correção é necessária.`,
        { current: z.id, related: [z.parent.id] },
      );
    }

    while (z.parent.color === "RED") {
      const p = z.parent;
      const g = p.parent;

      const parentIsLeft = p === g.left;
      const uncle = parentIsLeft ? g.right : g.left;

      this.record(
        "violation",
        `${z.value} e o pai ${p.value} são ambos vermelhos: dois nós vermelhos consecutivos violam uma propriedade da árvore.`,
        { current: z.id, related: [p.id, g.id] },
      );

      if (uncle.color === "RED") {
        this.setColor(p, "BLACK");
        this.setColor(uncle, "BLACK");
        this.setColor(g, "RED");

        this.record(
          "recolor",
          `O tio (${uncle.value}) é vermelho. Recolorir: pai ${p.value} e tio ${uncle.value} ficam pretos, avô ${g.value} fica vermelho. O problema sobe para ${g.value}.`,
          { recolored: [p.id, uncle.id, g.id] },
        );

        z = g;
      } else {
        const uncleTxt =
          uncle === this.NIL ? "NIL (preto)" : `${uncle.value} (preto)`;

        if (parentIsLeft ? z === p.right : z === p.left) {
          this.record(
            "violation",
            `O tio é ${uncleTxt} e ${z.value} forma um "triângulo" com o pai e o avô: rotação ${parentIsLeft ? "à esquerda" : "à direita"} no pai.`,
            { current: z.id, related: [p.id] },
          );

          z = p;

          if (parentIsLeft) {
            this.rotateLeft(z);
          } else {
            this.rotateRight(z);
          }
        }

        const p2 = z.parent;
        const g2 = p2.parent;

        this.setColor(p2, "BLACK");
        this.setColor(g2, "RED");

        this.record(
          "recolor",
          `O tio é ${uncleTxt} (caso "linha"): ${p2.value} fica preto e o avô ${g2.value} fica vermelho; segue-se rotação ${parentIsLeft ? "à direita" : "à esquerda"} no avô.`,
          { recolored: [p2.id, g2.id] },
        );

        if (parentIsLeft) {
          this.rotateRight(g2);
        } else {
          this.rotateLeft(g2);
        }
      }
    }

    if (this.root.color === "RED") {
      this.setColor(this.root, "BLACK");

      this.record(
        "recolor",
        `A raiz (${this.root.value}) foi recolorida para preto.`,
        { recolored: [this.root.id] },
      );
    }
  }

  // Remoção

  transplant(u, v) {
    if (u.parent === this.NIL) {
      this.root = v;
    } else if (u === u.parent.left) {
      u.parent.left = v;
    } else {
      u.parent.right = v;
    }

    v.parent = u.parent;
  }

  minimum(node) {
    while (node.left !== this.NIL) {
      node = node.left;
    }

    return node;
  }

  delete(value) {
    this.begin();

    if (!Number.isFinite(value)) {
      return this.finish("delete", value, false, "Valor inválido.");
    }

    if (this.root === this.NIL) {
      this.record("not-found", "A árvore está vazia: nada para remover.");

      return this.finish(
        "delete",
        value,
        false,
        `Não é possível remover ${value}: a árvore está vazia.`,
      );
    }

    const path = [];

    this.record(
      "start",
      `Remoção de ${value}: procurar o nó a partir da raiz (${this.root.value}).`,
      { current: this.root.id },
    );

    const z = this.findNode(value, path);

    if (z === this.NIL) {
      this.record(
        "not-found",
        `O valor ${value} não existe na árvore. Nada foi removido.`,
        { path },
      );

      return this.finish(
        "delete",
        value,
        false,
        `O valor ${value} não foi encontrado.`,
      );
    }

    let y = z;
    let yOriginalColor = y.color;
    let x;

    if (z.left === this.NIL || z.right === this.NIL) {
      const kind =
        z.left === this.NIL && z.right === this.NIL
          ? "é uma folha"
          : "tem apenas um filho";

      this.record(
        "remove-node",
        `O nó ${z.value} (${z.color === "RED" ? "vermelho" : "preto"}) ${kind}: é substituído ${kind === "é uma folha" ? "pela folha NIL" : "pelo seu filho"}.`,
        { removed: z.id, path },
      );

      x = z.left === this.NIL ? z.right : z.left;

      this.transplant(z, x);
    } else {
      y = this.minimum(z.right);

      this.record(
        "successor",
        `O nó ${z.value} tem dois filhos: o sucessor em ordem é ${y.value} (mínimo da subárvore direita), que ocupa o seu lugar e herda a cor de ${z.value}.`,
        { removed: z.id, related: [y.id] },
      );

      yOriginalColor = y.color;
      x = y.right;

      if (y.parent === z) {
        x.parent = y;
      } else {
        this.transplant(y, y.right);
        y.right = z.right;
        y.right.parent = y;
      }

      this.transplant(z, y);

      y.left = z.left;
      y.left.parent = y;
      y.color = z.color;
    }

    this.size--;

    this.record(
      "remove-node",
      `O nó ${value} foi removido da árvore.`,
      y !== z ? { related: [y.id] } : {},
    );

    if (yOriginalColor === "BLACK") {
      this.record(
        "fix-delete",
        `Foi removido (ou deslocado) um nó preto: um caminho perdeu um nó preto. É necessário corrigir a partir de ${x === this.NIL ? "NIL" : x.value}.`,
        x !== this.NIL ? { current: x.id } : {},
      );

      this.fixDelete(x);
    } else {
      this.record(
        "fix-delete",
        "O nó removido/deslocado era vermelho: a altura negra não muda, não é necessária correção.",
      );
    }

    this.NIL.parent = this.NIL;

    this.record(
      "done",
      "A árvore voltou a satisfazer todas as propriedades Rubro-Negras.",
    );

    return this.finish(
      "delete",
      value,
      true,
      `Valor ${value} removido (${this.rotations} rotações).`,
    );
  }

  fixDelete(x) {
    const nm = (node) => (node === this.NIL ? "NIL" : String(node.value));

    while (x !== this.root && x.color === "BLACK") {
      const p = x.parent;
      const isLeft = x === p.left;

      let w = isLeft ? p.right : p.left;

      const side = isLeft ? "esquerda" : "direita";
      const opp = isLeft ? "direita" : "esquerda";

      if (w.color === "RED") {
        this.setColor(w, "BLACK");
        this.setColor(p, "RED");

        this.record(
          "recolor",
          `Caso 1: o irmão ${nm(w)} é vermelho. Fica preto, o pai ${p.value} fica vermelho; rotação à ${side} no pai.`,
          { recolored: [w.id, p.id] },
        );

        if (isLeft) {
          this.rotateLeft(p);
        } else {
          this.rotateRight(p);
        }

        w = isLeft ? p.right : p.left;
      }

      const near = isLeft ? w.left : w.right;
      const far = isLeft ? w.right : w.left;

      if (near.color === "BLACK" && far.color === "BLACK") {
        this.setColor(w, "RED");

        this.record(
          "recolor",
          `Caso 2: o irmão ${nm(w)} e os seus filhos são pretos. O irmão fica vermelho e o défice de preto sobe para o pai ${p.value}.`,
          { recolored: [w.id], current: p.id },
        );

        x = p;
      } else {
        if (far.color === "BLACK") {
          this.setColor(near, "BLACK");
          this.setColor(w, "RED");

          this.record(
            "recolor",
            `Caso 3: o filho mais próximo do irmão (${nm(near)}) é vermelho e o mais distante é preto. Recolorir e rodar à ${opp} no irmão ${nm(w)}.`,
            { recolored: [near.id, w.id] },
          );

          if (isLeft) {
            this.rotateRight(w);
          } else {
            this.rotateLeft(w);
          }

          w = isLeft ? p.right : p.left;
        }

        this.setColor(w, p.color);
        this.setColor(p, "BLACK");
        this.setColor(isLeft ? w.right : w.left, "BLACK");

        this.record(
          "recolor",
          `Caso 4: o filho distante do irmão é vermelho. O irmão ${nm(w)} herda a cor do pai, o pai ${p.value} e o sobrinho distante ficam pretos; rotação à ${side} no pai.`,
          { recolored: [w.id, p.id] },
        );

        if (isLeft) {
          this.rotateLeft(p);
        } else {
          this.rotateRight(p);
        }

        x = this.root;
      }
    }

    if (x !== this.NIL && x.color === "RED") {
      this.setColor(x, "BLACK");

      this.record(
        "recolor",
        `O nó ${x.value} ${x === this.root ? "(raiz) " : ""}é vermelho: recolorido para preto, compensando o nó preto em falta.`,
        { recolored: [x.id] },
      );
    } else if (x !== this.NIL) {
      x.color = "BLACK";
    }
  }

  // Percursos

  inOrderTraversal() {
    const out = [];
    const stack = [];

    let current = this.root;

    while (current !== this.NIL || stack.length) {
      while (current !== this.NIL) {
        stack.push(current);
        current = current.left;
      }

      current = stack.pop();

      out.push(current.value);
      current = current.right;
    }

    return out;
  }

  preOrderTraversal() {
    const out = [];

    const walk = (node) => {
      if (node === this.NIL) return;

      out.push(node.value);
      walk(node.left);
      walk(node.right);
    };

    walk(this.root);

    return out;
  }

  postOrderTraversal() {
    const out = [];

    const walk = (node) => {
      if (node === this.NIL) return;

      walk(node.left);
      walk(node.right);
      out.push(node.value);
    };

    walk(this.root);

    return out;
  }

  // Estatísticas

  getHeight() {
    const height = (node) => {
      if (node === this.NIL) return 0;

      return 1 + Math.max(height(node.left), height(node.right));
    };

    return height(this.root);
  }

  getNodeCount() {
    return this.size;
  }

  isEmpty() {
    return this.size === 0;
  }

  validate() {
    const errors = [];

    if (this.NIL.color !== "BLACK") {
      errors.push("Propriedade 3: a folha NIL não é preta.");
    }

    if (this.root !== this.NIL && this.root.color !== "BLACK") {
      errors.push("Propriedade 2: a raiz não é preta.");
    }

    if (this.root !== this.NIL && this.root.parent !== this.NIL) {
      errors.push("A raiz tem pai.");
    }

    let count = 0;

    const check = (node, lo, hi) => {
      if (node === this.NIL) return 0;

      count++;

      if (node.color !== "RED" && node.color !== "BLACK") {
        errors.push(`Propriedade 1: o nó ${node.value} tem cor inválida.`);
      }

      if (!(node.value > lo && node.value < hi)) {
        errors.push(`Ordem BST violada no nó ${node.value}.`);
      }

      if (node.left !== this.NIL && node.left.parent !== node) {
        errors.push(`Ponteiro pai inconsistente em ${node.left.value}.`);
      }

      if (node.right !== this.NIL && node.right.parent !== node) {
        errors.push(`Ponteiro pai inconsistente em ${node.right.value}.`);
      }

      if (
        node.color === "RED" &&
        (node.left.color === "RED" || node.right.color === "RED")
      ) {
        errors.push(
          `Propriedade 4: o nó vermelho ${node.value} tem um filho vermelho.`,
        );
      }

      const leftHeight = check(node.left, lo, node.value);

      const rightHeight = check(node.right, node.value, hi);

      if (leftHeight !== rightHeight) {
        errors.push(
          `Propriedade 5: alturas negras diferentes em ${node.value} (${leftHeight} vs ${rightHeight}).`,
        );
      }

      return (
        Math.max(leftHeight, rightHeight) + (node.color === "BLACK" ? 1 : 0)
      );
    };

    const blackHeight = check(this.root, -Infinity, Infinity);

    if (count !== this.size) {
      errors.push(`Contagem inconsistente (${count} vs ${this.size}).`);
    }

    return {
      valid: errors.length === 0,
      errors,
      blackHeight,
    };
  }

  getStatistics() {
    const validation = this.validate();

    return {
      nodeCount: this.size,
      height: this.getHeight(),
      blackHeight: validation.blackHeight,
      valid: validation.valid,
    };
  }

  // Clonagem

  clone() {
    const tree = new RedBlackTree({
      recordSteps: this.recordSteps,
    });

    const copy = (node, parent) => {
      if (node === this.NIL) {
        return tree.NIL;
      }

      const clone = new RBNode(
        node.value,
        node.color,
        tree.NIL,
        tree.NIL,
        parent,
        node.id,
      );

      clone.left = copy(node.left, clone);
      clone.right = copy(node.right, clone);

      return clone;
    };

    tree.root = copy(this.root, tree.NIL);
    tree.size = this.size;
    tree.nextId = this.nextId;

    return tree;
  }

  // Limpeza

  clear() {
    this.root = this.NIL;
    this.size = 0;
    this.NIL.parent = this.NIL;
  }
}
