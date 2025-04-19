import { pinyin } from 'pinyin-pro'

export { pinyin }

/**
 * @description: 汉字转拼音
 * @param {string} text
 * @return {*}
 * @autor: 刘 相卿
 */
export function chinese2pinyin(text: string): string {
  return pinyin(text, { toneType: 'none' }).replaceAll(' ', '')
}

/**
 * @description: 汉字转声母
 * @param {string} text
 * @return {*}
 * @autor: 刘 相卿
 */
export function chinese2initial(text: string): string {
  return pinyin(text, { pattern: 'initial' }).replaceAll(' ', '')
}
