import type { MappingType } from './types'

/**
 * @description: 移除DOM节点
 * @param {HTMLElement} element 要移除的DOM节点
 * @return {*}
 * @autor: 刘 相卿
 */
export function removeElement(element: HTMLElement): void {
  if (element)
    element.parentNode?.removeChild(element)
}

/**
 * @description: 计算 rgba 颜色
 * @param {string} color
 * @param {number} alpha
 * @return {*}
 */
export function hex2rgba(color: string, alpha: number): string {
  const c = color.slice(1)
  const rgba = [
    Number.parseInt(`0x${c.slice(0, 2)}`),
    Number.parseInt(`0x${c.slice(2, 4)}`),
    Number.parseInt(`0x${c.slice(4, 6)}`),
    alpha,
  ]
  return `rgba(${rgba.toString()})`
}

/**
 * @description: 根据映射关系对象，查找key对应的值
 * @param {MappingType} mapping 映射关系对象
 * @param {string} key 映射关系对象key
 * @return {*}
 * @autor: 刘 相卿
 */
export function getValueByMapping(mapping: MappingType, key: string | number): any {
  return mapping[key] ?? mapping.default
}

/**
 * @description: 给传入的数字添加千分符
 * @param {number} number
 * @return {*}
 * @autor: 刘 相卿
 */
export function number2thousands(number: number): string {
  return number
    .toString()
    .replace(/\d+/, n => n.replace(/(\d)(?=(\d{3})+$)/g, $1 => `${$1},`))
}

/**
 * @description: 使用usePromise 接收一个函数作为参数 返回一个新的 Promise
 * @param {unknown} fn 传入的函数
 * @param {Array} args 传入的参数
 * @return {*}
 * @autor: 刘 相卿
 */
export function usePromise<T>(fn: unknown, ...args: any[]): Promise<T> {
  return new Promise((resolve, reject) => {
    // 如果传入的不是一个函数，则直接拒绝Promise
    if (typeof fn !== 'function') {
      return reject(new Error('usePromise传入的第一个参数必须为函数!'))
    }

    try {
      const result = fn(...args)
      if (result instanceof Promise) {
        result.then(resolve, reject)
      }
      else {
        resolve(result)
      }
    }
    catch (error) {
      reject(error)
    }
  })
}

/**
 * @description: 通过fetch获取文件的MIME类型
 * @param {string} url 文件地址
 * @return {*}
 * @autor: 刘 相卿
 */
export async function getMimeByUrl(url: string): Promise<string> {
  return new Promise((resolve) => {
    fetch(url, { method: 'HEAD' }).then((response) => {
      try {
        const mime = response.headers.get('content-type') || ''
        resolve(mime)
      }
      // eslint-disable-next-line unused-imports/no-unused-vars
      catch (error) {
        resolve('')
      }
    }).catch(() => {
      resolve('')
    })
  })
}
