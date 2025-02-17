import { isEmptyObject, isEmptyValue, isNumber, isObjectDataType } from './base'
import { cloneDeep } from './lodash'
import { deleteEmptyValue } from './object'
import type { BaseOptionType, ObjectDataType, TreeItemType } from './types'

/**
 * @description: 字符串元组
 * @param {*} args
 * @return {*}
 * @autor: 刘 相卿
 */
export const tuple = <T extends string[]>(...args: T): T => args

/**
 * @description: 数字元组
 * @param {*} args
 * @return {*}
 * @autor: 刘 相卿
 */
export const tupleNum = <T extends number[]>(...args: T): T => args

/**
 * @description: 转换为数组
 * @param {*} val
 * @return {*}
 * @autor: 刘 相卿
 */
export function toArray<T>(val: T): T[] {
  return Array.isArray(val) ? val : [val]
}

/**
 * @description: 数组转树型结构数据
 * @param {any[]} data
 * @param {string} id id字段名
 * @param {string} pid pid字段名
 * @param {string} children children字段名
 * @return {TreeItemType[]} 树型数据
 * @autor: 刘 相卿
 */
export function array2tree<T = TreeItemType>(data: ObjectDataType[] = [], id: string = 'id', pid: string = 'pid', children: string = 'children'): T[] {
  const result: T[] = []
  const temp: ObjectDataType = {}
  const ndata: ObjectDataType[] = cloneDeep(data)

  for (let index = 0; index < ndata.length; index++) {
    temp[ndata[index][id]] = ndata[index]
  }
  for (let index = 0; index < ndata.length; index++) {
    if (temp[ndata[index][pid]] && ndata[index][id] !== ndata[index][pid]) {
      if (!temp[ndata[index][pid]][children]) {
        temp[ndata[index][pid]][children] = []
      }
      temp[ndata[index][pid]][children].push(ndata[index])
    }
    else {
      result.push(ndata[index] as T)
    }
  }

  return result
}

/**
 * @description: 对象数组转换为选项数组
 * @param {ObjectDataType[]} array
 * @param {{ label: string; value: string }} alias
 * @return {BaseOptionType[]}
 * @autor: 刘 相卿
 */
export function array2option(array: ObjectDataType[], alias: { label: string, value: string }): BaseOptionType[] {
  return array.map(data => ({
    label: data[alias.label],
    value: data[alias.value],
  }))
}

/**
 * @description: 删除数组中的空元素
 * @param {T[]} array
 * @return {*}
 * @autor: 刘 相卿
 */
export function deleteEmptyElement<T>(array: T[]): T[] {
  return array.filter(element => !isEmptyValue(element))
}

/**
 * @description: 根据给定的值集合，查找树型结构数据中符合条件的元素
 * @param {TreeItemType[]} array 树型数组
 * @param {(string | number)[]} values 值集合
 * @param {{ value?: string; children?: string }} alias
 * @return {*}
 * @autor: 刘 相卿
 */
export function getElementsByValues(array: TreeItemType[] = [], values: (string | number)[], alias?: { value?: string, children?: string }, reserveChildren: boolean = false): ObjectDataType[] {
  const useAlias = {
    value: 'value',
    children: 'children',
    ...deleteEmptyValue(alias),
  }
  const result: ObjectDataType[] = []

  const [value] = values
  const data = array.find(element => element[useAlias.value] === value)
  if (!isEmptyValue(value) && !isEmptyValue(data)) {
    const { [useAlias.children]: children, ...rest } = data as TreeItemType
    return result.concat(
      reserveChildren ? { ...rest, children } : rest,
      ...getElementsByValues(children ?? [], values.slice(1), useAlias),
    )
  }

  return result
}

/**
 * @description: 将树型结构数组拉平为一维数组
 * @param {TreeItemType[]} data 树型数组
 * @param {{ value?: string; children?: string }} alias
 * @return {TreeItemType[]}
 * @autor: 刘 相卿
 */
export function tree2array<T extends ObjectDataType = ObjectDataType>(data: T[] = [], alias: string = 'children', reserveChildren: boolean = false): T[] {
  const result: T[] = []
  const flat = (data: T[], useAlias: string) => {
    data.forEach((element) => {
      const { [useAlias]: children, ...rest } = element
      if (reserveChildren) {
        result.push(element)
      }
      else {
        result.push(rest as T)
      }
      if (children) {
        flat(children, useAlias)
      }
    })
  }

  flat(data, alias)

  return result
}

/**
 * @description: 根据对象数组中的keys去重
 * @param {ObjectDataType[]} array 原数组
 * @param {string[]} keys 对象key
 * @return {T[]}
 * @autor: 刘 相卿
 */
export function uniqueArrayByKeys<T = ObjectDataType>(array: T[], keys: (keyof T)[]): T[] {
  const data = array.reduce<T[]>((result, current) => {
    const hasElement = result.find(element =>
      keys.every(key => element[key] === current[key]),
    )
    if (!hasElement) {
      result.push(current)
    }
    return result
  }, [])

  return data
}

/**
 * @description: 删除简单数组中的符合规则的元素，并返回新数组
 * @param {(number|string|boolean)[]} array 原数组
 * @param {(number|string|boolean)[]} values 符合的元素值
 * @return {*} (number|string|boolean)[]
 * @autor: 刘 相卿
 */
export function deleteElement(array: (number | string | boolean)[], values: (number | string | boolean)[] = []): (number | string | boolean)[] {
  return array.filter(a => !values.includes(a))
}

/**
 * @description: 删除数组中的符合规则的元素，并返回新数组
 * @param {any[]} array 原数组
 * @param {any[]} rules 符合的元素值，如：[1, { name: 'x', age: 12 }, { name: 'z' }]则删除「元素 = 1 或 元素.name = 'x' && 元素.age = 'x' 或 元素.name = 'z'」的元素
 * @return {*}
 * @autor: 刘 相卿
 */
export function deleteElementPro(array: any[], rules: any[] = []): any[] {
  return array.filter((a) => {
    const valid = rules.some((r) => {
      // 规则为对象 且 数组的单个元素值也是对象
      if (isObjectDataType(r) && isObjectDataType(a)) {
        // 当规则为空对象时 仅判断元素值是否为空对象
        if (isEmptyObject(r))
          return isEmptyObject(a)
        // 判断数据对象中对应的key值是否和规则中的key值一致
        return Object.entries(r).every(([key, value]) => value === a[key])
      }
      else if (isNumber(r) && Number.isNaN(r)) {
        // NaN的判断
        return isNumber(a) && Number.isNaN(a)
      }
      else {
        // 其他类型的判断
        return a === r
      }
    })

    return !valid
  })
}
