import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // 中文
import 'dayjs/locale/en' // 英文

import { isArray, isEmptyValue } from './base'

export type { Dayjs } from 'dayjs'

export { dayjs }

export type DateType = 'year' | 'month' | 'date' | 'week'

function transformFormatter(format: string) {
  const formatArray = ['YYYY', 'MM', 'DD', 'HH', 'mm', 'ss']
  const formatSplit = format.replace(/[^a-z\s]/gi, '').split('')

  // 找到所有符合条件的元素
  const matches = formatArray.filter(f => formatSplit.some(char => f.includes(char)))

  // 取最后一个匹配项
  const found = matches.length > 0 ? matches[matches.length - 1] : 's'

  return (found[0] || 's') as dayjs.OpUnitType
}

/**
 * @description: 区间选择格式化
 * @param {dayjs} value
 * @param {DateType} formatType
 * @param {string} format
 * @return {*}
 * @autor: 刘 相卿
 */
export function dateRangeFormatter(value: dayjs.ConfigType[], formatType: DateType = 'date', format: string = 'YYYY-MM-DD') {
  if (isArray(value) && value.some(val => isEmptyValue(val)))
    return value
  const [start, end] = value

  // 非date的都从对应的formatType开始
  if (formatType !== 'date')
    return [dayjs(start).startOf(formatType).format('YYYY-MM-DD HH:mm:ss'), dayjs(end).endOf(formatType).format('YYYY-MM-DD HH:mm:ss')]

  const char = transformFormatter(format || 'YYYY-MM-DD')

  return [dayjs(start).startOf(char).format('YYYY-MM-DD HH:mm:ss'), dayjs(end).endOf(char).format('YYYY-MM-DD HH:mm:ss')]
}

/**
 * @description: 设置语言
 * @param {*} locale
 * @return {*}
 * @autor: 刘 相卿
 */
export function setLocale(locale: 'zh-cn' | 'en' = 'zh-cn') {
  dayjs.locale(locale)
}

/**
 * @description: 动态注册dayjs组件
 * @param {string} pluginName
 * @return {*}
 * @autor: 刘 相卿
 */
export async function registryDayjsPlugin(pluginName: string[]): Promise<void> {
  const plugins = pluginName.map(name => () => import(`dayjs/plugin/${name}`))

  for (const plugin of plugins) {
    try {
      const _plugin = await plugin()
      dayjs.extend(_plugin)
    }
    catch (error) {
      console.error('[registryDayjsPlugin]dayjs组件注册失败:', error)
    }
  }
}
