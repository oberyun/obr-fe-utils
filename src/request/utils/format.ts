import get from 'lodash.get'
import type { BaseOptionType, ObjectDataType, OptionResAlias, PageAlias, PageQueryType, PageResType, ResAlias, ResDataType } from '../../types'
import { OPTION_RES_ALIAS, RECORD_RES_ALIAS, RES_ALIAS } from '../constant'
import { isBoolean, isEmptyArray, isEmptyValue, isNumber, isObjectDataType, isString } from '../../base'
import { deleteEmptyElement, tree2array, uniqueArrayByKeys } from '../../array'
import { parseTemplate } from '../../parse'

export function sort(object: ObjectDataType = {}) {
  const keys: string[] = Object.keys(object).sort()
  return keys.reduce((obj, key) => {
    obj[key] = object[key]
    return obj
  }, {} as ObjectDataType)
}

export function format(object: ObjectDataType = {}) {
  return Object.keys(object).reduce((obj, key) => {
    const value = object[key]
    if (!isEmptyValue(value)) {
      // 数字处理
      if (isNumber(value)) {
        // 整数失精处理
        if (String(value).length >= 15) {
          obj[key] = String(value)
        }
        else {
          obj[key] = value
        }
      }
      else {
        obj[key] = value
      }
    }

    return obj
  }, {} as ObjectDataType)
}

export function formatData(object: ResDataType, alias: ResAlias = RES_ALIAS): ResDataType {
  const { code = 'code', data = 'data', msg = 'msg' } = alias
  return { data: object[data], msg: object[msg], code: object[code] }
}

export function formatOption<T = ObjectDataType>(array: any[], alias: Partial<OptionResAlias> = OPTION_RES_ALIAS, unique = true): BaseOptionType<T>[] {
  const { label = 'label', value = 'value', json = 'json', disabled = 'disabled', children = 'children' } = alias

  let _array = array

  // 判断是否为树形数据 元素必须是对象且对象的键必须包含 children 字段 这里用some判断是因为可能某些层级不存在children
  const isTreeData = array.some(current => isObjectDataType(current) && Object.keys(current).includes(children))
  if (isTreeData) {
    _array = tree2array(array, children)
  }

  const options = _array.reduce((result, current) => {
    if (isObjectDataType(current)) {
      const useLabel = label.includes('#{') ? label : `#{${label}}`

      const option = {
        label: parseTemplate(useLabel, current, { prefix: '#{', suffix: '}' }),
        value: get(current, value),
        disabled: get(current, disabled) ?? false,
        json: get(current, json) ?? current,
      }

      result.push(option)
    }
    else if (isNumber(current) || isString(current) || isBoolean(current)) {
      result.push({
        label: current,
        value: current,
        json: {},
      })
    }

    return result
  }, [])

  // 根据value值去重
  return unique ? uniqueArrayByKeys<BaseOptionType<T>>(options, ['value']) : options
}

export function formatPageQuery(object: PageQueryType = { pageSize: 10, pageNo: 1 }, alias: Partial<PageAlias> = RECORD_RES_ALIAS) {
  return Object.keys(object).reduce((obj, current) => {
    obj[alias[current as keyof PageQueryType] as string] = object[current as keyof PageQueryType]
    return obj
  }, {} as ObjectDataType)
}

export function formatPageRecords<T = ObjectDataType>(data: ObjectDataType, alias: Partial<PageAlias> = RECORD_RES_ALIAS): PageResType<T> {
  const { records = 'records', total = 'total' } = alias
  return {
    records: data[records] ?? [],
    total: data[total] ?? 0,
  }
}

export function getSuccessCode(code?: number | number[]) {
  const useCode: number[] = deleteEmptyElement([code].flat()) as number[]
  if (isEmptyArray(useCode))
    return [200]

  return useCode
}

export function getUnauthorizedCode(code?: number | number[]) {
  const useCode: number[] = deleteEmptyElement([code].flat()) as number[]
  if (isEmptyArray(useCode))
    return [401]

  return useCode
}
