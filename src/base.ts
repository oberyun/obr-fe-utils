import type { DataType, ObjectDataType } from './types'

/**
 * @description: 判断是否为string类型
 * @param {unknown} val
 * @return {*}
 * @autor: 刘 相卿
 */
export const isString = (val: unknown): val is string => typeof val === 'string'

/**
 * @description: 判断是否为number类型
 * @param {unknown} val
 * @return {*}
 * @autor: 刘 相卿
 */
export const isNumber = (val: unknown): val is number => typeof val === 'number'

/**
 * @description: 判断是否为boolean类型
 * @param {unknown} val
 * @return {*}
 * @autor: 刘 相卿
 */
export function isBoolean(val: unknown): val is boolean {
  return typeof val === 'boolean'
}

/**
 * @description: 判断是否为函数类型
 * @param {unknown} val
 * @return {*}
 * @autor: 刘 相卿
 */
// eslint-disable-next-line ts/no-unsafe-function-type
export const isFunction = (val: unknown): val is Function => typeof val === 'function'

/**
 * @description: 判断是否为数组类型
 * @param {unknown} val
 * @return {*}
 * @autor: 刘 相卿
 */
export const isArray = <T>(val: unknown): val is T[] => Array.isArray(val)

/**
 * @description: 判断是否为undefined类型
 * @param {unknown} val
 * @return {*}
 * @autor: 刘 相卿
 */
export function isUndefined(val: unknown): val is undefined {
  return typeof val === 'undefined'
}

/**
 * @description: 判断参数已定义且不为空
 * @param {*} val
 * @return {*}
 * @autor: 刘 相卿
 */
export const isDef = <T = any>(val?: T): val is NonNullable<T> => typeof val !== 'undefined'

/**
 * @description: 是否为null
 * @param {unknown} val
 * @return {*}
 * @autor: 刘 相卿
 */
export const isNull = (val: unknown): val is null => val === null

/**
 * @description: 是否为symbol类型
 * @param {unknown} val
 * @return {*}
 * @autor: 刘 相卿
 */
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'

/**
 * @description: 是否为对象类型
 * @param {unknown} val
 * @return {*}
 * @autor: 刘 相卿
 */
export const isObjectDataType = <T extends ObjectDataType = ObjectDataType>(val: unknown): val is T => Object.prototype.toString.call(val) === '[object Object]'
export const isObject = (val: unknown): val is object => Object.prototype.toString.call(val) === '[object Object]'

/**
 * @description: 是否为日期类型
 * @param {unknown} val
 * @return {*}
 * @autor: 刘 相卿
 */
export function isDate(val: unknown): val is Date {
  return Object.prototype.toString.call(val) === '[object Date]'
}

/**
 * @description: 是否为原始类型
 * @return {*}
 * @autor: 刘 相卿
 */
export function isBaseType(val: unknown): boolean {
  return (
    isString(val)
    || isNumber(val)
    || isBoolean(val)
    || isSymbol(val)
    || isUndefined(val)
    || isNull(val)
  )
}

/**
 * @description: 是否为url
 * @param {string} val
 * @return {*}
 * @autor: 刘 相卿
 */
export function isUrl(val: string): boolean {
  const reg = /^(?:https?|mailto|tel|file):/
  return reg.test(val)
}

/**
 * @description: 判断是否未null或者undefined
 * @param {unknown} value
 * @return {*}
 * @autor: 刘 相卿
 */
export function isEmpty(value: unknown, undefinedValue = true): boolean {
  return (
    (undefinedValue && value === undefined)
    || value === null
    || value === 'null'
  )
}

/**
 * @description: 判断是否为空值
 * @param {unknown} value
 * @return {boolean}
 * @autor: 刘 相卿
 */
export function isEmptyValue(value: unknown): boolean {
  return (
    value === undefined
    || value === null
    || value === ''
    || (typeof value === 'number' && Number.isNaN(value))
  )
}

/**
 * @description: 判断是否为空对象
 * @param {ObjectDataType} object
 * @return {*}
 * @autor: 刘 相卿
 */
export function isEmptyObject(object: ObjectDataType): boolean {
  return !object || Object.getOwnPropertyNames(object).length === 0
}

/**
 * @description: 判断是否为空数组
 * @param {any} data
 * @return {boolean}
 * @autor: 刘 相卿
 */
export function isEmptyArray(data: any[] = []): boolean {
  return Array.isArray(data) && !data.length
}

/**
 * @description: 判断是否为无意义的数组，即数组的每个元素都是空值
 * @param {any} data
 * @return {boolean}
 * @autor: 刘 相卿
 */
export function isMeaninglessArray(data: any[] = []): boolean {
  if (Array.isArray(data)) {
    return isEmptyArray(data) || data.every(d => isEmptyValue(d))
  }
  else {
    return false
  }
}

/**
 * @description: 获取数据类型
 * @param {any} data
 * @return {DataType} 数据类型字符串
 * @autor: 刘 相卿
 */
export function getDataType(data: any): DataType {
  return Object.prototype.toString
    .call(data)
    .slice(8, -1)
    .toLowerCase() as DataType
}

/**
 * @description: 根据url获取文件类型
 * @param {string} fileUrl
 * @return {*}
 * @autor: 刘 相卿
 */
export function getFileType(fileUrl: string): string {
  const match = fileUrl.match(/\.([^.]+)$/)
  const type = match?.[1] ?? '未知'

  return type.toUpperCase()
}

/**
 * @description: 替换最后一个匹配的字符串
 * @param {string} str
 * @param {string} char
 * @param {string} target
 * @return {*}
 * @autor: 刘 相卿
 */
export function replaceLastMatch(str: string, char: string, target: string): string {
  return str.replace(new RegExp(`(.*)${char}`), `$1${target}`)
}

/**
 * @description: 替换所有匹配的字符串
 * @param {string} str
 * @param {RegExp} reg
 * @param {string} target
 * @return {*}
 * @autor: 刘 相卿
 */
export function replaceMatch(str: string, reg: RegExp, target: string): string {
  return str.replace(new RegExp(reg, 'g'), target)
}

/**
 * @description: 将数字转化为正数
 * @param {number} value
 * @return {*}
 * @autor: 刘 相卿
 */
export function formatPositiveNumber(value: number): number {
  return value && value > 0 ? value : 0
}

/**
 * @description: JSON字符串转换为JSON对象/数组
 * @param {string} str JSON字符串
 * @return {T}
 * @autor: 刘 相卿
 */
export function string2json<T>(str: string, defaultValue?: T): T {
  let object = null
  try {
    if (!!str && isString(str)) {
      object = JSON.parse(str)
    }
  }
  finally {
    if (isNull(object)) {
      object = defaultValue || {}
    }
  }

  return object as T
}

/**
 * @description: JSON对象转换为JSON字符串
 * @param {any} json
 * @return {string}
 * @autor: 刘 相卿
 */
export function json2string(json: any): string {
  let str = ''
  try {
    if (!!str && (isArray(json) || isObject(json))) {
      str = JSON.stringify(str)
    }
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  catch (error) {
    str = ''
  }

  return str
}

/**
 * @description: 生成随机字符串
 * @param {number} length 随机字符串长度 默认长度为10
 * @return {*}
 * @autor: 刘 相卿
 */
export function uuid(length: number = 10): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
