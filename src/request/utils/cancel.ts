import axios from 'axios'
import type { HeadersType, ObrAxiosRequestConfig } from '../../types'

export const pendingMap = new Map()

/**
 * @description: 请求key
 * @param {ObrAxiosRequestConfig} config
 * @return {*}
 * @autor: 刘 相卿
 */
function getPendingKey(config: ObrAxiosRequestConfig): string {
  const { url, method, params, data, headers } = config
  let ndata = data
  let nparams = params
  if (typeof data === 'string') {
    ndata = JSON.parse(data)
  }
  if (typeof params === 'string') {
    nparams = JSON.parse(params)
  }

  let urls: string[] = []
  const rule: HeadersType['X-Cancel-Rule'] = headers?.['X-Cancel-Rule']
  if (rule === 'path') {
    urls = [`请求路径:${url}`]
  }
  else if (rule === 'method') {
    urls = [`请求路径:${url}`, `请求方法:${method}`]
  }
  else {
    urls = [
      `请求路径:${url}`,
      `请求方法:${method}`,
      `请求PARAMS:${JSON.stringify(nparams)}`,
      `请求DATA:${JSON.stringify(ndata)}`,
    ]
  }

  // 方便console查看重复请求的参数
  return urls.join(';')
}

/**
 * @description: 添加到pending队列
 * @param {ObrAxiosRequestConfig} config
 * @return {*}
 * @autor: 刘 相卿
 */
export function addPending(config: ObrAxiosRequestConfig): void {
  // X-Never-Cancel 永不取消请求
  if (!config.headers?.neverCancel) {
    const key = getPendingKey(config)
    config.cancelToken = new axios.CancelToken((cancel) => {
      if (!pendingMap.has(key)) {
        pendingMap.set(key, cancel)
      }
    })
  }
}

/**
 * @description: 取消重复请求
 * @param {ObrAxiosRequestConfig} config
 * @param {boolean} force 强制执行
 * @return {*}
 * @autor: 刘 相卿
 */
export function removePending(config: ObrAxiosRequestConfig, force: boolean = false): void {
  if (!config.headers?.['X-Never-Cancel'] || force) {
    const key = getPendingKey(config)
    if (pendingMap.has(key)) {
      const cancel = pendingMap.get(key)
      if (cancel) {
        cancel(key)
      }
      pendingMap.delete(key)
    }
  }
}

export function removeNdAddPending(config: ObrAxiosRequestConfig): void {
  removePending(config)
  addPending(config)
}

export function removeAllPending() {
  Array.from(pendingMap.keys()).forEach((key) => {
    if (pendingMap.get(key)) {
      pendingMap.get(key)(key)
    }
    pendingMap.delete(key)
  })
}
