/**
 * @description: 节点是否存在某个class
 * @param {HTMLElement} node
 * @param {string} className
 * @return {*}
 * @autor: 刘 相卿
 */
export function hasClass(node: HTMLElement, className: string) {
  if (node.classList)
    return node.classList.contains(className)

  const originClass = node.className
  return ` ${originClass} `.includes(` ${className} `)
}

/**
 * @description: 给节点添加class
 * @param {HTMLElement} node
 * @param {string} className
 * @return {*}
 * @autor: 刘 相卿
 */
export function addClass(node: HTMLElement, className: string) {
  if (node.classList) {
    node.classList.add(className)
  }
  else {
    if (!hasClass(node, className))
      node.className = `${node.className} ${className}`
  }
}

/**
 * @description: 移除class
 * @param {HTMLElement} node
 * @param {string} className
 * @return {*}
 * @autor: 刘 相卿
 */
export function removeClass(node: HTMLElement, className: string) {
  if (node.classList) {
    node.classList.remove(className)
  }
  else {
    if (hasClass(node, className)) {
      const originClass = node.className
      node.className = ` ${originClass} `.replace(` ${className} `, ' ')
    }
  }
}
