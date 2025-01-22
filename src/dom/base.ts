/**
 * @description: 设置文档标题
 * @param {string} title
 * @return {*}
 * @autor: 刘 相卿
 */
export function setDocumentTitle(title: string): void {
  document.title = title
}

/**
 * @description: 动态计算px
 * @param {number} px 原始px数值
 * @param {number} width 设计稿宽度 默认1920
 * @param {number} height 设计稿高度 默认1080
 * @return {*}
 * @autor: 刘 相卿
 */
export function getPx(px: number, width: number = 1920, height: number = 1080): number {
  const currentScreenWidth = document.documentElement.clientWidth || document.body.clientWidth || width
  const currentScreenHeight = window.screen.height || document.body.clientHeight || width
  const defaultProportion = width / height

  return (currentScreenWidth / currentScreenHeight / defaultProportion) * px
}

/**
 * @description: 获取页面中最大的z-index并＋1
 * @return {number} zIndex 最大的index
 * @autor: 刘 相卿
 */
export function getMaxZIndex(): number {
  const elements = document.querySelectorAll('[style*=z-index]')
  let maxZIndex = 0
  elements.forEach((element) => {
    const zIndex = window.getComputedStyle(element).zIndex
    if (zIndex !== 'auto') {
      const parseZIndex = Number.parseInt(zIndex, 10)
      if (!Number.isNaN(parseZIndex) && parseZIndex > maxZIndex) {
        maxZIndex = parseZIndex
      }
    }
  })

  return maxZIndex + 1
}
