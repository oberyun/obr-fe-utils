import { isEmptyValue } from './base'
import type { ObjectDataType } from './types'

/**
 * @description: 根据模板和对象值转换为字符串
 * @param {string} template
 * @param {ObjectDataType} data
 * @param {object} options
 * @return {*}
 * @autor: 刘 相卿
 */
export function parseTemplate(template: string, data: ObjectDataType = {}, options?: { prefix?: string, suffix?: string, defaultValue?: string | number }) {
  const { prefix = '#{', suffix = '}', defaultValue = '' } = options ?? {}
  // 参数校验
  if (typeof template !== 'string') {
    return String(template)
  }

  if (!data || typeof data !== 'object') {
    return template
  }

  // 转义正则表达式特殊字符
  const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const prefixEscaped = escapeRegExp(prefix)
  const suffixEscaped = escapeRegExp(suffix)

  // 创建正则表达式匹配变量占位符
  const regex = new RegExp(`${prefixEscaped}([^${suffixEscaped}]+)${suffixEscaped}`, 'g')

  // 替换所有匹配的变量
  return template.replace(regex, (_match, varName) => {
    // 获取变量值，如果不存在则返回默认值
    const value = data[varName]
    return isEmptyValue(value) ? String(isEmptyValue(defaultValue) ? '' : defaultValue) : String(value)
  })
}
