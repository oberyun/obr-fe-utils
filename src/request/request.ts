import axios, { isCancel } from 'axios'
import type { BaseOptionType, ObjectDataType, ObrAxiosInstance, ObrAxiosRequestConfig, ObrAxiosStatic, OptionResAlias, PageAlias, PageQueryType, PageResType, RequestBaseConfig, RequestMethod, ResDataType } from '../types'
import { merge } from '../lodash'
import { json2formdata, omit } from '../object'
import { isArray, isObject } from '../base'
import { DEFAULT_CONFIG } from './constant'
import { useErrorHandler, useRequestHandler, useResponseHandler } from './handler'
import { removeAllPending, removePending } from './utils/cancel'
import { formatOption, formatPageQuery, formatPageRecords } from './utils/format'

export class ObrRequest {
  // 配置项
  private options: RequestBaseConfig
  // 实例
  private instance: ObrAxiosInstance

  constructor(options: RequestBaseConfig) {
    this.options = merge({}, DEFAULT_CONFIG, options)
    this.instance = this.setupInterceptors(this.options)
  }

  private setupInterceptors(options: RequestBaseConfig) {
    const instance = (axios as ObrAxiosStatic).create(omit(options, ['basePath', 'allowCancel', 'allowNullValue', 'successCode', 'whiteUrl', 'alias', 'token', 'beforeRequest', 'afterRequest', 401, 'cancel', 'error']))
    instance.interceptors.request.use(config => useRequestHandler(config, this.options))
    instance.interceptors.response.use(response => useResponseHandler(response, this.options), error => useErrorHandler(isCancel(error) ? 'CANCEL' : 'ERROR', error, this.options))
    return instance
  }

  /**
   * @description: 请求本地文件
   * @param {string} path
   * @return {Promise<Response>}
   * @autor: 刘 相卿
   */
  fetchLocalFile(path: string): Promise<Response> {
    return fetch((this.options.basePath ?? '') + path)
  }

  /**
   * @description: get请求
   * @param {string} url
   * @param {ObjectDataType} params
   * @param {ObrAxiosRequestConfig} config
   * @return {*}
   * @autor: 刘 相卿
   */
  async get<T = any>(url: string, params: ObjectDataType = {}, config?: ObrAxiosRequestConfig): Promise<T> {
    const { data } = await this.instance.get<T>(url, { ...config, params })
    return data
  }

  /**
   * @description: post请求
   * @param {string} url
   * @param {ObjectDataType} params 请求参数
   * @param {ObrAxiosRequestConfig} config 请求配置项
   * @return {Promise<T>}
   * @autor: 刘 相卿
   */
  async post<T = any>(url: string, params: ObjectDataType = {}, config?: ObrAxiosRequestConfig): Promise<T> {
    const { data } = await this.instance.post<T>(url, params, config)
    return data
  }

  /**
   * @description: post请求(json参数会转为FormData类型)
   * @param {string} url
   * @param {ObjectDataType} params 请求参数
   * @param {ObrAxiosRequestConfig} config 请求配置项
   * @return {Promise<T>}
   * @autor: 刘 相卿
   */
  async postForm<T = any>(url: string, params: ObjectDataType = {}, config?: ObrAxiosRequestConfig): Promise<T> {
    const formData = json2formdata(params)
    const { data } = await this.instance.post<T>(url, formData, merge({}, { headers: { 'Content-Type': 'multipart/form-data' }, ...config }))
    return data
  }

  /**
   * @description: 请求分页接口
   * @param {string} url
   * @param {ObjectDataType} searchParams 请求参数
   * @param {PageQueryType} pageParams 分页参数
   * @param {RequestMethod} method 请求方法
   * @param {Partial} alias 分页别名配置
   * @param {ObrAxiosRequestConfig} config 请求配置项
   * @return {Promise<PageResType<R>>}
   * @autor: 刘 相卿
   */
  async getPageRecords<R = ObjectDataType>(url: string, searchParams: ObjectDataType = {}, pageParams: PageQueryType = {}, method: RequestMethod = 'GET', alias?: Partial<PageAlias>, config?: ObrAxiosRequestConfig): Promise<PageResType<R>> {
    const isGET = method.toUpperCase() === 'GET'
    const params = { ...formatPageQuery(pageParams, alias), ...searchParams }
    const { data } = await this.instance.request({ ...config, url, method, params: isGET ? params : { ...formatPageQuery(pageParams, alias) }, data: !isGET ? params : {} })

    return formatPageRecords<R>(data, alias)
  }

  /**
   * @description: 获取options类型数据（下拉选择/字典等）
   * @param {string} url
   * @param {ObjectDataType} params
   * @param {RequestMethod} method
   * @param {Partial} alias
   * @param {ObrAxiosRequestConfig} config
   * @param {boolean} unique
   * @return {Promise<BaseOptionType<T>[]>}
   * @autor: 刘 相卿
   */
  async getOptions<T = ObjectDataType>(url: string, params: ObjectDataType = {}, method: RequestMethod = 'GET', alias?: Partial<OptionResAlias>, config?: ObrAxiosRequestConfig, unique: boolean = true): Promise<BaseOptionType<T>[]> {
    const isGET = method.toUpperCase() === 'GET'
    const { data = [] } = await this.instance.request({ ...config, url, method, params, data: !isGET ? params : {} })
    if (isArray(data)) {
      return formatOption(data, alias, unique)
    }
    else if (isObject(data)) {
      const objectArray = Object.entries(data).map(d => ({ label: d[1], value: d[0] }))
      return formatOption(objectArray, undefined, unique)
    }

    return []
  }

  /**
   * @description: 强制取消请求
   * @param {ObrAxiosRequestConfig} config
   * @return {*}
   * @autor: 刘 相卿
   */
  cancel(config: ObrAxiosRequestConfig): void {
    removePending(config, true)
  }

  /**
   * @description: request请求
   * @param {ObrAxiosRequestConfig} config
   * @return {Promise<ResDataType<T>>}
   * @autor: 刘 相卿
   */
  request<T = any>(config: ObrAxiosRequestConfig): Promise<ResDataType<T>> {
    return this.instance.request<T>(config)
  }

  /**
   * @description: 取消所有请求并销毁axios实例
   * @return {*}
   * @autor: 刘 相卿
   */
  destory(): void {
    removeAllPending()
    this.instance = null as any
  }
}
