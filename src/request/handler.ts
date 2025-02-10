import type { InternalAxiosRequestConfig } from 'axios'
import type { ErrorType, ObjectDataType, ObrAxiosRequestConfig, ObrAxiosResponse, RequestBaseConfig, ResDataType } from '../types'
import { merge } from '../lodash'
import { RES_ALIAS } from './constant'
import { addPending, removeAllPending, removePending } from './utils/cancel'
import { readBlobResponse } from './utils/file'
import { format, formatData, getSuccessCode, getUnauthorizedCode, sort } from './utils/format'

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
  if (ErrorMessage.get(401) && !options.whiteUrl?.().includes(config.url ?? '')) {
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
export function useErrorHandler(error: ErrorType) {
  if (error.type === 'REQUEST' && getUnauthorizedCode(error.options.unauthorizedCode).includes(error.content.code)) {
    // 响应报错(401)
    // 移除所有请求
    removeAllPending()

    // 调用自定义的401捕捉函数
    if (error.options[401]) {
      return error.options[401](error)
    }
  }
  else if (error.type === 'CANCEL' && error.options.cancel) {
    // 请求取消报错 调用自定义的cancel捕捉函数
    return error.options.cancel(error)
  }
  else if (error.options.error) {
    // 其他错误 调用自定义的error捕捉函数
    return error.options.error(error)
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
  if (getUnauthorizedCode(options.unauthorizedCode).includes(data[alias.code])) {
    return useErrorHandler({ type: 'REQUEST', content: formatData(data, alias), options, response })
  }
  else {
    // 非401状态 删除401
    ErrorMessage.delete(401)

    // 根据不同情况处理响应数据
    if (config.responseType === 'blob') {
      // 1. 文件处理逻辑 因为文件处理返回字段不需要考虑alias
      const fileResult = await readBlobResponse(data as any)
      if (getSuccessCode(options.successCode).includes(fileResult.code))
        return formatData(fileResult, alias)
      else
        return useErrorHandler({ type: 'REQUEST', content: fileResult, options, response })
    }
    else if (getSuccessCode(options.successCode).includes(data[alias.code])) {
      // 2. json处理逻辑
      return Promise.resolve(formatData(data, alias))
    }
    else {
      // 3. 其他错误处理逻辑
      return useErrorHandler({ type: 'REQUEST', content: formatData(data, alias), options, response })
    }
  }
}
