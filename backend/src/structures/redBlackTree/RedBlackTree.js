import { RedBlackNode } from "./RedBlackNode.js";

export class RedBlackTree {
  constructor() {
    this.root = null;
  }

  rotateLeft(node) {
    const rightChild = node.right;

    node.right = rightChild.left;

    if (rightChild.left) {
      rightChild.left.parent = node;
    }

    rightChild.parent = node.parent;

    if (!node.parent) {
      this.root = rightChild;
    } else if (node === node.parent.left) {
      node.parent.left = rightChild;
    } else {
      node.parent.right = rightChild;
    }

    rightChild.left = node;
    node.parent = rightChild;
  }

  rotateRight(node) {
    const leftChild = node.left;

    node.left = leftChild.right;

    if (leftChild.right) {
      leftChild.right.parent = node;
    }

    leftChild.parent = node.parent;

    if (!node.parent) {
      this.root = leftChild;
    } else if (node === node.parent.right) {
      node.parent.right = leftChild;
    } else {
      node.parent.left = leftChild;
    }

    leftChild.right = node;
    node.parent = leftChild;
  }

  insert(key, value) {
    const newNode = new RedBlackNode(key, value);

    if (!this.root) {
      newNode.color = "BLACK";
      this.root = newNode;
      return newNode;
    }

    let current = this.root;
    let parent = null;

    while (current) {
      parent = current;

      if (key < current.key) {
        current = current.left;
      } else if (key > current.key) {
        current = current.right;
      } else {
        return current;
      }
    }

    newNode.parent = parent;

    if (key < parent.key) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }

    this.fixInsert(newNode);

    return newNode;
  }

  fixInsert(node) {
    while (node !== this.root && node.parent && node.parent.color === "RED") {
      const parent = node.parent;
      const grandparent = parent.parent;

      if (parent === grandparent.left) {
        const uncle = grandparent.right;

        if (uncle && uncle.color === "RED") {
          parent.color = "BLACK";
          uncle.color = "BLACK";
          grandparent.color = "RED";

          node = grandparent;
        } else {
          if (node === parent.right) {
            node = parent;
            this.rotateLeft(node);
          }

          node.parent.color = "BLACK";
          node.parent.parent.color = "RED";

          this.rotateRight(node.parent.parent);
        }
      } else {
        const uncle = grandparent.left;

        if (uncle && uncle.color === "RED") {
          parent.color = "BLACK";
          uncle.color = "BLACK";
          grandparent.color = "RED";

          node = grandparent;
        } else {
          if (node === parent.left) {
            node = parent;
            this.rotateRight(node);
          }

          node.parent.color = "BLACK";
          node.parent.parent.color = "RED";

          this.rotateLeft(node.parent.parent);
        }
      }
    }

    this.root.color = "BLACK";
  }

  search(key) {
    let current = this.root;
    const target = Number(key);

    while (current) {
      if (target === Number(current.key)) {
        return current.value;
      }

      if (target < Number(current.key)) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return null;
  }

  toJSON(node = this.root) {
    if (!node) return null;

    return {
      key: node.key,
      color: node.color,
      value: node.value,
      left: this.toJSON(node.left),
      right: this.toJSON(node.right),
    };
  }

  getTree() {
    return this.root;
  }

  clear() {
    this.root = null;
  }
}
