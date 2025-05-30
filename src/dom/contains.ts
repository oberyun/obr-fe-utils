/**
 * @description: 是否包含节点
 * @param {Node} root
 * @param {Node} n
 * @return {*}
 * @autor: 刘 相卿
 */
export default function contains(root: Node | null | undefined, n?: Node) {
  if (!root)
    return false

  // Use native if support
  if (root.contains)
    return root.contains(n as any)

  // `document.contains` not support with IE11
  let node: any = n
  while (node) {
    if (node === root)
      return true

    node = node.parentNode
  }

  return false
}
