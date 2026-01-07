import { cloneDeep, merge } from 'es-toolkit/compat'
import type { ObjectDataType } from './types'
import { isEmptyObject, isEmptyValue, isObject, isString } from './base'

/**
 * @description: pick函数
 * @return {*}
 * @autor: 刘 相卿
 */
export function pick<T, K extends keyof T, R extends Record<string, any>>(
  object: T,
  keys: K[] = [],
  rest?: R,
  // eslint-disable-next-line ts/no-empty-object-type
): Pick<T, K> & (R extends undefined ? {} : R) {
  if (object === null || object === undefined)
    return (rest || object) as any
  const names = Object.getOwnPropertyNames(object)
  const values: any = names.reduce((result, key) => {
    if ((keys as string[]).includes(key))
      result[key] = object[key as keyof T]
    return result
  }, {} as any)

  return Object.assign(values, rest)
}

export function omit<T, K extends keyof T, R extends Record<string, any>>(
  object: T,
  keys: K[] = [],
  rest?: R,
  // eslint-disable-next-line ts/no-empty-object-type
): Omit<T, K> & (R extends undefined ? {} : R) {
  if (object === null || object === undefined)
    return (rest || object) as any
  const names = Object.getOwnPropertyNames(object)
  const values: any = names.reduce((result, key) => {
    if (!(keys as string[]).includes(key))
      result[key] = object[key as keyof T]
    return result
  }, {} as any)

  return Object.assign(values, rest)
}

/**
 * @description:
 * @param {ObjectDataType} object 传入的对象
 * @param {boolean} asc 是否升序
 * @return {*}
 * @autor: 刘 相卿
 */
export function objectSortByKey(object: ObjectDataType = {}, asc: boolean = true): ObjectDataType {
  const keys = Object.keys(object).sort()
  if (!asc)
    keys.reverse()

  return keys.reduce((result, key) => {
    result[key] = object[key]
    return result
  }, {} as ObjectDataType)
}

/**
 * @description: json转url
 * @param {ObjectDataType} json
 * @return {string} url
 * @autor: 刘 相卿
 */
export function json2url(json: ObjectDataType = {}): string {
  return Object.entries(json)
    .reduce((result, [key, value]) => {
      if (!isEmptyValue(value))
        result.push(`${key}=${value}`)
      return result
    }, [] as string[])
    .join('&')
}

/**
 * @description: url转json参数
 * @param {string} url
 * @return {*}
 * @autor: 刘 相卿
 */
export function url2json(url: string): ObjectDataType {
  if (!isString(url)) {
    return {}
  }

  let useSearchUrl = url.trim()

  if (useSearchUrl[0] === '?') {
    useSearchUrl = useSearchUrl.slice(1)
  }
  else if (useSearchUrl.indexOf('http') === 0) {
    try {
      const urlInstance = new URL(useSearchUrl)
      useSearchUrl = urlInstance.search ? urlInstance.search.slice(1) : ''
    }
    catch (error) {
      console.error('传入的[url]格式错误: ', error)
    }
  }

  if (!useSearchUrl) {
    return {}
  }

  const query = new URLSearchParams(useSearchUrl)
  return Array.from(query.entries()).reduce((result, [key, value]) => {
    result[key] = value
    return result
  }, {} as ObjectDataType)
}

/**
 * @description: json转formdata
 * @param {ObjectDataType} json
 * @return {*}
 * @autor: 刘 相卿
 */
export function json2formdata(json: ObjectDataType = {}): FormData {
  const formdata = new FormData()
  Object.entries(json).forEach(([key, value]) => {
    formdata.append(key, value)
  })

  return formdata
}

/**
 * @description: formdata转json
 * @param {FormData} formdata
 * @return {*}
 * @autor: 刘 相卿
 */
export function formdata2json(formdata: FormData): ObjectDataType {
  const obj: ObjectDataType = {}
  for (const [key, value] of formdata.entries()) {
    obj[key] = value
  }

  return obj
}

/**
 * @description: 删除对象中的空值
 * @return {*}
 * @autor: 刘 相卿
 */
export function deleteEmptyValue(data: ObjectDataType = {}): ObjectDataType {
  return Object.entries(data).reduce((result, [key, value]) => {
    if (!isEmptyValue(value))
      result[key] = value
    return result
  }, {} as ObjectDataType)
}

/**
 * @description: 把某个对象中对应的属性值拷贝到另一对象
 * @param {ObjectDataType} data 完整对象
 * @param {ObjectDataType} object 目标对象
 * @return {*}
 * @autor: 刘 相卿
 */
export function cloneData2Object(data: ObjectDataType, object: ObjectDataType): ObjectDataType {
  return Object.keys(object).reduce((pre, key) => {
    pre[key] = data[key]
    return pre
  }, {} as ObjectDataType)
}

/**
 * @description: 判断对象是否存在某些属性
 * @param {ObjectDataType} object
 * @param {string} props
 * @return {*}
 * @autor: 刘 相卿
 */
export function hasProperties(object: ObjectDataType, props: string[]): boolean {
  return props.every(prop => Reflect.has(object, prop))
}

/**
 * @description: 根据传入的对象和映射关系返回一个新的对象
 * @param {ObjectDataType} data
 * @param {Record<string, string>} mapping
 * @return {*}
 * @autor: 刘 相卿
 */
export function getObjectFromMapping(data: ObjectDataType, mapping: Record<string, string>): ObjectDataType {
  return Object.entries(mapping).reduce((object, [dkey, mkey]) => {
    object[dkey] = data[mkey]
    return object
  }, {} as ObjectDataType)
}

/**
 * @description: 合并对象
 * @param {ObjectDataType} data
 * @param {ObjectDataType} mergeData
 * @return {*}
 * @autor: 刘 相卿
 */
export function mergeObject<T extends ObjectDataType = ObjectDataType>(data: T, mergeData: ObjectDataType = {}): T {
  const result: T = merge({}, data)

  if (isEmptyObject(mergeData))
    return result

  for (const key in mergeData) {
    const _key = key as keyof T
    if (isObject(mergeData[key]) && isObject(result[key])) {
      result[_key] = mergeObject<T>(result[_key], mergeData[key]) as any
    }
    else {
      result[_key] = mergeData[key]
    }
  }

  return cloneDeep(result)
}
