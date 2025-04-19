/**
 * @description: 计算滚动条宽度
 * @return {*}
 * @autor: 刘 相卿
 */
export function getScrollbarWidth(): number {
  const outer = document.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.overflow = 'scroll'
  outer.style.width = '100px'
  outer.style.height = '100px'
  document.body.appendChild(outer)
  const inner = document.createElement('div')
  inner.style.width = '100%'
  outer.appendChild(inner)

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth

  outer.parentNode?.removeChild(outer)

  return scrollbarWidth
}
