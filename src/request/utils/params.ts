import get from 'lodash.get'
import { isArray, isEmptyValue, isObject, isString } from '../../base'
import type { ObjectDataType, RequestParamConfig } from '../../types'

function valueFormat(value: any, formatter: RequestParamConfig['source'][number]['formatter']) {
  if (formatter === 'toArray') {
    return isArray(value) ? value : [value].flat().filter(v => !isEmptyValue(v))
  }
  else if (formatter === 'toNumber') {
    return isString(value) ? Number(value) : value
  }
  else if (formatter === 'toString') {
    return isArray(value) ? value.join(',') : String(value)
  }

  return value
}

function getValue(source: RequestParamConfig['source'], data: ObjectDataType = {}) {
  let value: any | undefined
  for (const element of source) {
    value = (element.path ? get(data, element.path) : element.defaultValue) ?? element.defaultValue

    if (element.formatter) {
      value = valueFormat(value, element.formatter)
    }

    if (!isEmptyValue(value)) {
      break
    }
  }

  return value
}

export function getRequestParamValues(params: RequestParamConfig[] = [], data: ObjectDataType = {}): any[] | ObjectDataType | null {
  let values: any[] | ObjectDataType | null = {}
  for (const config of params) {
    values = values === null ? {} : values

    // 参数为必选参数 但是key为空值 则直接返回null
    if (config.required && (!config.key || !config.source.length)) {
      values = null
      break
    }
    else if (config.key && config.source.length) {
      const value = getValue(config.source, data)

      if (config.required && isEmptyValue(value)) {
        values = null
        break
      }
      else if (config.toValue) {
        values = value

        // 非对象类型直接break 终止循环
        if (!isObject(values))
          break
      }
      else if (isObject(values)) {
        (values as ObjectDataType)[config.key] = value
      }
    }
  }

  return values
}
