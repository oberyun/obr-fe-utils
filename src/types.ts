import type { AxiosInstance, AxiosInterceptorManager, AxiosRequestConfig, AxiosResponse, AxiosStatic, CreateAxiosDefaults, Method } from 'axios'

export type ObjectDataType<T = any, D extends string = string> = Record<D, T>

/**
 * @description: 树形结构数据类型
 * @autor: 刘 相卿
 */
export interface TreeItemType extends ObjectDataType {
  label?: string
  children?: TreeItemType[]
}

/**
 * @description: 数据类型
 * @autor: 刘 相卿
 */
export type DataType =
  | 'set'
  | 'map'
  | 'function'
  | 'object'
  | 'array'
  | 'undefined'
  | 'null'
  | 'number'
  | 'symbol'
  | 'string'
  | 'boolean'
  | 'regexp'
  | 'date'
  | 'bigint'
  | 'blob'
  | 'formdata'

export interface MappingType {
  [x: string | number]: any
  default: any
}

export interface BaseOptionType<T = ObjectDataType> extends ObjectDataType {
  label: string
  value: string | number
  json?: T
}

export interface OptionResAlias {
  label: string
  value: string
  json: string
}

/**
 * @description: Token配置类型
 * @param {string} key token的键名称
 * @param {() => string} get 获取token的方法
 * @autor: 刘 相卿
 */
export interface TokenConfig {
  key: string
  get: () => string
}

/**
 * @description: header配置
 * @param {boolean} `X-Never-Cancel` 是否永远不取消该请求
 * @param {'path' | 'method' | 'params'} `X-Cancel-Rule` 取消规则(path: 同一路径; method: 同一路径+请求方法; params: 同一路径+请求方法+参数)
 * @param {boolean} `X-Hide-Message` 是否隐藏请求消息提示
 * @autor: 刘 相卿
 */
export interface HeadersType {
  'X-Never-Cancel'?: boolean
  'X-Cancel-Rule'?: 'path' | 'method' | 'params'
  'X-Hide-Message'?: boolean
}

// headers?: (RawAxiosRequestHeaders & MethodsHeaders) | AxiosHeaders;
// RawAxiosRequestHeaders & AxiosHeaders
// headers: AxiosRequestHeaders;
// (RawAxiosRequestHeaders & MethodsHeaders) | AxiosHeaders
// in RawAxiosRequestHeaders & AxiosHeaders;
export interface ObrAxiosRequestConfig<D = any> extends AxiosRequestConfig<D> {
  headers?: AxiosRequestConfig['headers'] & HeadersType
}

export interface ObrAxiosResponse<T = any> extends Omit<AxiosResponse<T>, 'data'> {
  data: ResDataType<T>
}

export interface ObrAxiosStatic extends Omit<AxiosStatic, 'create'> {
  create: (config?: CreateAxiosDefaults) => ObrAxiosInstance
}

export interface ObrAxiosInstance extends Pick<AxiosInstance, 'defaults'> {
  interceptors: {
    request: AxiosInterceptorManager<ObrAxiosRequestConfig>
    response: AxiosInterceptorManager<ObrAxiosResponse<ResDataType>>
  }

  <T = any, D = any>(config: AxiosRequestConfig<D>): Promise<ResDataType<T>>
  <T = any, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<ResDataType<T>>

  getUri: (config?: ObrAxiosRequestConfig) => string
  request: <T = any>(config: ObrAxiosRequestConfig) => Promise<ResDataType<T>>
  get: <T = any>(url: string, config?: ObrAxiosRequestConfig) => Promise<ResDataType<T>>
  delete: <T = any> (url: string, config?: ObrAxiosRequestConfig) => Promise<ResDataType<T>>
  head: <T = any>(url: string, config?: ObrAxiosRequestConfig) => Promise<ResDataType<T>>
  options: <T = any>(url: string, config?: ObrAxiosRequestConfig) => Promise<ResDataType<T>>
  post: <T = any, D = any>(url: string, data?: D, config?: ObrAxiosRequestConfig) => Promise<ResDataType<T>>
  put: <T = any, D = any>(url: string, data?: D, config?: ObrAxiosRequestConfig) => Promise<ResDataType<T>>
  postForm: <T = any, D = any>(url: string, data?: D, config?: ObrAxiosRequestConfig) => Promise<ResDataType<T>>
  putForm: <T = any, D = any>(url: string, data?: D, config?: ObrAxiosRequestConfig) => Promise<ResDataType<T>>
  patch: <T = any, D = any>(url: string, data?: D, config?: ObrAxiosRequestConfig) => Promise<ResDataType<T>>
  patchForm: <T = any, D = any>(url: string, data?: D, config?: ObrAxiosRequestConfig) => Promise<ResDataType<T>>
}

/**
 * @description: 响应字段别名
 * @param {string} code 响应code别名
 * @param {string} data 响应数据别名
 * @param {string} msg 响应消息提示别名
 * @autor: 刘 相卿
 */
export interface ResAlias {
  code: string
  data: string
  msg: string
}

export interface PageAlias {
  records: string
  total: string
  pageSize: string
  pageNo: string
}

/**
 * @description: 响应数据类型
 * @param {number} code 响应code
 * @param {T} data 响应数据
 * @param {string} msg 响应消息提示
 * @autor: 刘 相卿
 */
export interface ResDataType<T = any> extends ObjectDataType {
  code: number
  data: T
  msg: string
}

/**
 * @description: 分页接口响应数据
 * @param {R[]} records 分页数据
 * @param {number} total 分页总数
 * @autor: 刘 相卿
 */
export interface PageResType<R = ObjectDataType> {
  records: R[]
  total: number
}

/**
 * @description: 错误消息类型
 * @param {number} type 错误类型
 * @param {T} error 错误数据
 * @autor: 刘 相卿
 */
export interface ErrorContentObject {
  REQUEST: {
    type: 'REQUEST'
    content: ResDataType
  }
  CANCEL: {
    type: 'CANCEL'
    content: unknown
  }
  ERROR: {
    type: 'ERROR'
    content: unknown
  }
}

interface ErrorBasicType {
  options: RequestBaseConfig
  response?: ObrAxiosResponse<ResDataType>
}

export type ErrorTypeKey = keyof ErrorContentObject

export type ErrorType<T extends ErrorTypeKey = ErrorTypeKey> = ErrorBasicType & ErrorContentObject[T]

/**
 * @description: 分页查询请求参数
 * @param {number} pageSize 分页大小 = 10
 * @param {number} pageNo 分页页码 = 1
 * @autor: 刘 相卿
 */
export interface PageQueryType {
  pageSize?: number
  pageNo?: number
}

export interface RequestBaseConfig extends AxiosRequestConfig {
  basePath?: string
  allowCancel?: boolean
  allowNullValue?: boolean
  successCode?: number | number[]
  unauthorizedCode?: number | number[] // 401 code
  whiteUrl?: () => string[]
  alias?: () => Partial<ResAlias>
  token?: TokenConfig
  beforeRequest?: (config: ObrAxiosRequestConfig) => ObrAxiosRequestConfig
  afterRequest?: (response: ObrAxiosResponse<ResDataType>, options: RequestBaseConfig) => ObrAxiosResponse<ResDataType>
  401?: (error: ErrorType<'REQUEST'>) => any
  cancel?: (error: ErrorType<'CANCEL'>) => any
  error?: (error: ErrorType<'ERROR'>) => any
}

export type RequestMethod = Method
