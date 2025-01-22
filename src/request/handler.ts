import type { InternalAxiosRequestConfig } from 'axios'
import type { ErrorContentObject, ErrorType, ObjectDataType, ObrAxiosRequestConfig, ObrAxiosResponse, RequestBaseConfig, ResDataType } from '../types'
import { merge } from '../lodash'
import { ERROR_401, RES_ALIAS } from './constant'
import { addPending, removeAllPending, removePending } from './utils/cancel'
import { readBlobResponse } from './utils/file'
import { format, formatData, sort } from './utils/format'

// 错误消息Map
export const ErrorMessage: Map<number, string> = new Map()

export function requestUrl2json(url: string): ObjectDataType {
  const obj: ObjectDataType = {}
  const paramStr = url.split('?')[1]

  if (paramStr) {
    paramStr.split('&').forEach((group) => {
      const [key = '', value = ''] = group.split('=')
      obj[key] = value
    })
  }

  return obj
}

export function useRequestHandler(config: ObrAxiosRequestConfig, options: RequestBaseConfig) {
  // 判断是否在401状态 且不在白名单的接口要取消执行
  if (ErrorMessage.get(ERROR_401) && !options.whiteUrl?.().includes(config.url ?? '')) {
    removePending(config, true)
  }

  // TODO: 防重放、完整性校验
  // 参数空值/空数组/空对象、JSON参数排序
  const _config = merge({}, config)
  // 整理参数
  const [url = ''] = (_config.url ?? '').split('?')
  // 对象排序
  let params = sort(merge({}, requestUrl2json(_config.url ?? ''), _config.params))
  // 不允许空值时去除参数中的空值
  if (!options.allowNullValue) {
    params = format(params)
  }
  // 重新对url params进行赋值
  _config.url = url
  _config.params = params

  // headers未设置Content-Type时，设置为json格式
  if (!_config.headers?.['Content-Type']) {
    merge(_config.headers, { 'Content-Type': 'application/json;charset=utf-8' })
  }

  // 请求headers添加token
  const { token } = options
  if (token?.key && token.get()) {
    const headers = { [token.key]: token.get() }
    merge(_config.headers, headers)
  }
  else if (token?.key && _config.headers) {
    // 获取不到token时将headers中的tokenKey值清空
    Reflect.deleteProperty(_config.headers, token.key)
  }

  // 允许取消请求时将请求添加到pendingList
  if (options.allowCancel) {
    // 请求开始之前检查一下是否有该请求，有则移除上一次的请求，没有则添加
    removePending(_config)
    addPending(_config)
  }

  // 判断是否有beforeRequest
  if (options.beforeRequest) {
    return options.beforeRequest(_config)
  }

  return _config
}

// 错误拦截(status !== 200)
export function useErrorHandler<T extends keyof ErrorContentObject>(type: T, content: ErrorContentObject[T], options: RequestBaseConfig): any {
  const error = { type, content, options }

  if (type === 'REQUEST' && content.code === 401) {
    // 响应报错
    // 移除所有请求
    removeAllPending()
    // 调用自定义的401捕捉函数
    if (options[401]) {
      return options[401](content)
    }
  }
  else if (type === 'CANCEL' && options.cancel) {
    // 请求取消报错 调用自定义的cancel捕捉函数
    return options.cancel(error as ErrorType<'CANCEL'>)
  }
  else if (options.error) {
    // 其他错误 调用自定义的error捕捉函数
    return options.error(error as ErrorType<'ERROR'>)
  }

  // 未配置时reject
  return Promise.reject(error)
}

// status === 200
export async function useResponseHandler(response: ObrAxiosResponse<ResDataType>, options: RequestBaseConfig) {
  const { data: rdata, config: rconfig } = response
  let data: ResDataType<ResDataType<any>> = rdata
  let config: InternalAxiosRequestConfig<any> = rconfig

  // 判断是否有afterRequest
  if (options.afterRequest) {
    const { data: ardata, config: arconfig } = options.afterRequest(response, options)
    data = ardata
    config = arconfig
  }

  // alias
  const alias = merge({}, RES_ALIAS, options.alias?.())

  // 响应完成后移除请求队列
  removePending(response.config)

  // 401
  if (data[alias.code] === 401) {
    return useErrorHandler('REQUEST', formatData(data, alias), options)
  }
  else {
    // 非401状态 删除401
    ErrorMessage.delete(ERROR_401)

    // 根据不同情况处理响应数据
    if (config.responseType === 'blob') {
      // 1. 文件处理逻辑 因为文件处理返回字段不需要考虑alias
      const fileResult = await readBlobResponse(data as any)
      if (fileResult.code === 200)
        return formatData(fileResult, alias)
      else
        return useErrorHandler('REQUEST', fileResult, options)
    }
    else if (data[alias.code] === options.successCode) {
      // 2. json处理逻辑
      return Promise.resolve(formatData(data, alias))
    }
    else {
      // 3. 其他错误处理逻辑
      return useErrorHandler('REQUEST', formatData(data, alias), options)
    }
  }
}
