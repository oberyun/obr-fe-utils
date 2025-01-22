import type { BaseOptionType, ObjectDataType, OptionResAlias, PageAlias, PageQueryType, PageResType, ResAlias, ResDataType } from '../../types'
import { OPTION_RES_ALIAS, RECORD_RES_ALIAS, RES_ALIAS } from '../constant'
import { isBoolean, isEmptyValue, isNumber, isObjectDataType, isString } from '../../base'
import { uniqueArrayByKeys } from '../../array'

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
  const { label = 'label', value = 'value', json = 'json' } = alias

  const options = array.reduce((result, current) => {
    if (isObjectDataType(current)) {
      result.push({
        label: current[label],
        value: current[value],
        json: current[json] ?? current,
      })
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
