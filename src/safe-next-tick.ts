import { isFunction } from './base'

export async function delayTimer(delay = 0) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve(true)
      clearTimeout(timer)
    }, delay)
  })
}
export function safeNextick(fn?: () => void, option?: { delay: number }): void
export async function safeNextick(
  fn?: () => void,
  option?: { delay: number }
): Promise<void>
export async function safeNextick(fn?: () => void, option?: { delay: number }) {
  await delayTimer(option?.delay)
  if (fn && isFunction(fn))
    fn()
}
