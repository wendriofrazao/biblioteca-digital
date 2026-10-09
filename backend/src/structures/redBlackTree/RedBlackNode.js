export class RedBlackNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;

    this.color = "RED";

    this.left = null;
    this.right = null;
    this.parent = null;
  }
}
