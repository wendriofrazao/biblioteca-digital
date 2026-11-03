/**
 * @typedef {"RED" | "BLACK"} Color
 */

/**
 * Cópia serializável e imutável de um nó da árvore.
 *
 * @typedef {Object} SnapshotNode
 * @property {number} id
 * @property {number} value
 * @property {Color} color
 * @property {number | null} left
 * @property {number | null} right
 */

/**
 * Representação da árvore em um determinado momento.
 *
 * @typedef {Object} TreeSnapshot
 * @property {number | null} rootId
 * @property {Record<number, SnapshotNode>} nodes
 */

/**
 * Tipos de etapas registradas pelo algoritmo.
 *
 * @typedef {
 *   "start" |
 *   "compare" |
 *   "insert-node" |
 *   "violation" |
 *   "recolor" |
 *   "rotate-left" |
 *   "rotate-right" |
 *   "found" |
 *   "not-found" |
 *   "duplicate" |
 *   "remove-node" |
 *   "successor" |
 *   "fix-delete" |
 *   "done"
 * } StepKind
 */

/**
 * Informações de destaque de uma etapa.
 *
 * @typedef {Object} StepHighlight
 * @property {number} [current]
 * @property {number[]} [path]
 * @property {number} [newNode]
 * @property {number[]} [rotated]
 * @property {number[]} [recolored]
 * @property {number} [found]
 * @property {number} [removed]
 * @property {number[]} [related]
 */

/**
 * Evento registrado pelo algoritmo.
 *
 * @typedef {Object} Step
 * @property {StepKind} kind
 * @property {string} message
 * @property {TreeSnapshot} snapshot
 * @property {StepHighlight} highlight
 * @property {number} rotations
 * @property {number} comparisons
 */

/**
 * @typedef {"insert" | "delete" | "search"} OperationType
 */

/**
 * Resultado de uma operação na árvore.
 *
 * @typedef {Object} OperationResult
 * @property {OperationType} type
 * @property {number} value
 * @property {boolean} success
 * @property {string} message
 * @property {Step[]} steps
 * @property {number} rotations
 * @property {number} recolorings
 * @property {number} comparisons
 */

/**
 * Resultado da validação da árvore.
 *
 * @typedef {Object} ValidationResult
 * @property {boolean} valid
 * @property {string[]} errors
 * @property {number} blackHeight
 */

/**
 * Estatísticas da árvore.
 *
 * @typedef {Object} TreeStatistics
 * @property {number} nodeCount
 * @property {number} height
 * @property {number} blackHeight
 * @property {boolean} valid
 */

/**
 * Configurações da árvore Rubro-Negra.
 *
 * @typedef {Object} RedBlackTreeOptions
 * @property {boolean} [recordSteps=true]
 */
