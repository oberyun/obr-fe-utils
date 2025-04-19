import dayjs from 'dayjs'
import { isArray, isEmptyValue } from './base'

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

export function dayRangeFormatter(value: dayjs.ConfigType[], formatType: DateType = 'date', format: string = 'YYYY-MM-DD') {
  if (isArray(value) && value.some(val => isEmptyValue(val)))
    return value
  const [start, end] = value

  // 非date的都从对应的formatType开始
  if (formatType !== 'date')
    return [dayjs(start).startOf(formatType).format('YYYY-MM-DD HH:mm:ss'), dayjs(end).endOf(formatType).format('YYYY-MM-DD HH:mm:ss')]

  const char = transformFormatter(format || 'YYYY-MM-DD')

  return [dayjs(start).startOf(char).format('YYYY-MM-DD HH:mm:ss'), dayjs(end).endOf(char).format('YYYY-MM-DD HH:mm:ss')]
}
