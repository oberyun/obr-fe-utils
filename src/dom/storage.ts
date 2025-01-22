import type { ObjectDataType } from '../types'

/**
 * @description: 获取本地存储(LocalStorage)
 * @param {string[]} keys
 * @return {*}
 * @autor: 刘 相卿
 */
export function getLocalStorage(keys: string[] = []): ObjectDataType | null {
  if (localStorage) {
    if (keys.length) {
      return keys.reduce((result, key) => {
        result[key] = localStorage.getItem(key)
        return result
      }, {} as ObjectDataType)
    }
    else {
      return Object.keys(localStorage).reduce((r, key) => {
        r[key] = localStorage.getItem(key)
        return r
      }, {} as ObjectDataType)
    }
  }
  else {
    return keys.length === 1 ? null : {}
  }
}

/**
 * @description: 获取本地存储(SessionStorage)
 * @param {string[]} keys
 * @return {*}
 * @autor: 刘 相卿
 */
export function getSessionStorage(keys: string[] = []): ObjectDataType | null {
  if (sessionStorage) {
    if (sessionStorage) {
      if (keys.length) {
        return keys.reduce((result, key) => {
          result[key] = sessionStorage.getItem(key)
          return result
        }, {} as ObjectDataType)
      }
      else {
        return Object.keys(sessionStorage).reduce((r, key) => {
          r[key] = sessionStorage.getItem(key)
          return r
        }, {} as ObjectDataType)
      }
    }
    else {
      return null
    }
  }
  else {
    return keys.length === 1 ? null : {}
  }
}

export function getCookie(keys: string[] = []): Record<string, string> | null {
  if (document.cookie) {
    // 创建一个空对象用于存储解析后的cookie
    const cookies = document.cookie.split('; ').reduce((result, cookie) => {
      const [key = '', value = ''] = cookie.split('=').map(decodeURIComponent)
      result[key] = value
      return result
    }, {} as Record<string, string>)

    if (keys.length) {
      return keys.reduce((result, key) => {
        result[key] = cookies[key]
        return result
      }, {} as Record<string, string>)
    }
    else {
      return cookies
    }
  }
  else {
    return keys.length === 1 ? null : {}
  }
}
