import { isObject, uuid } from '../base'
import { merge } from '../lodash'
import { getCookie, getLocalStorage, getSessionStorage } from './storage'

export type AllowMessageType = 'default' | 'LocalStorage' | 'SessionStorage' | 'Cookie'

/**
 * @description: 配置类型
 * @param {number} timeout 消息回传超时时间(单位毫秒 默认5000ms)
 * @param {string} allowPostOrigins 允许发送消息的origin 多个用半角逗号分隔[,] 默认为空
 * @param {string} allowReceiveOrigins 允许接收消息的origin 多个用半角逗号分隔[,](永远都不会接收自己页面的message) 默认为空
 * @autor: 刘 相卿
 */
export interface IFrameUtilConfig {
  timeout?: number
  allowPostOrigins?: string
  allowReceiveOrigins?: string
}

export interface IFrameMessageDataType<T = any> {
  uuid: string
  type: AllowMessageType
  content: T
}

/**
 * @description: iframe消息发送hook
 * 应用于父页面
 * 父页面必须通过发消息才能与嵌套的iframe建立通信
 * 不可直接调用iframe的内容
 * @param {HTMLIFrameElement} element
 * @param {IFrameUtilConfig} configs 可选项
 * @return {*}
 * @autor: 刘 相卿
 */
export function iframePostHook(element: HTMLIFrameElement, configs?: IFrameUtilConfig) {
  const iframe = element
  let useConfigs = { timeout: 5000, allowPostOrigins: '', allowReceiveOrigins: '' }
  const initialConfig = () => {
    useConfigs = merge({}, useConfigs, configs)
  }

  // 消息存储Map
  const messageMap = new Map<string, any>()

  /**
   * @description: 检查iframe是否已加载
   * @return {*}
   * @autor: 刘 相卿
   */
  const checkIFrame = (): boolean => {
    if (iframe && iframe?.contentWindow) {
      return true
    }

    throw new Error('iframe content not load!')
  }

  /**
   * @description: 消息格式化
   * @param {any} content
   * @return {*}
   * @autor: 刘 相卿
   */
  const messageFormat = <T = any>(content: T, type: AllowMessageType = 'default'): IFrameMessageDataType<T> => {
    return { uuid: uuid(10), type, content }
  }

  /**
   * @description: 接收消息
   * @param {MessageEvent} message
   * @return {*}
   * @autor: 刘 相卿
   */
  const onMessage = (message: MessageEvent): void => {
    const allowReceiveOrigins = useConfigs.allowReceiveOrigins?.split(',') ?? []
    // 判断接收消息的源
    if (allowReceiveOrigins.some(origin => origin === '*' || origin === message.origin)) {
      const data = message.data

      // 存在已发送的uuid才会存储 只存储content的值
      if (data.uuid && messageMap.has(data.uuid)) {
        messageMap.set(data.uuid, data.content)
      }
    }
  }

  /**
   * @description: 发送消息
   * @param {IFrameMessageDataType<T>} message
   * @param {string} origin
   * @return {*}
   * @autor: 刘 相卿
   */
  const sendMessage = <T>(message: IFrameMessageDataType<T>, origin?: string): void => {
    checkIFrame()
    const url = origin ?? iframe.src
    const allowPostOrigins = useConfigs.allowPostOrigins?.split(',') ?? []
    if (url && allowPostOrigins.some(origin => origin === '*' || url.includes(origin))) {
      // 格式化传输的数据
      messageMap.set(message.uuid, null)
      iframe.contentWindow?.postMessage(message, url)
    }
    else {
      throw new Error(`iframe[${url}]不在[configs.allowPostOrigins]范围内!`)
    }
  }

  /**
   * @description:
   * @param {any} data
   * @param {string} origin
   * @return {*}
   * @autor: 刘 相卿
   */
  const post = <T = any>(data: T | IFrameMessageDataType<T>, origin?: string): Promise<T> => {
    // 轮询间隔时间
    const POLLING_INTERVAL = 10
    return new Promise((resolve, reject) => {
      try {
        // 校验消息
        const message = ((isObject(data) && (data as IFrameMessageDataType<T>).uuid) ? data : messageFormat<T>(data as any)) as IFrameMessageDataType<T>
        // 发送消息
        sendMessage(message, origin)

        if (message.uuid) {
          messageMap.set(message.uuid, null)
        }
        else {
          throw new Error('消息发送失败')
        }

        let timeout = 0
        // 10ms轮询
        const t = setInterval(() => {
          const data = messageMap.get(message.uuid)
          // 判断不等于初始值null
          if (data !== null) {
            clearInterval(t)
            messageMap.delete(message.uuid)
            resolve(data)
            return
          }

          timeout += POLLING_INTERVAL

          if (timeout >= useConfigs.timeout) {
            clearInterval(t)
            throw new Error('消息回传超时!')
          }
        }, POLLING_INTERVAL)
      }
      catch (error) {
        reject(error)
      }
    })
  }

  const getStorage = async <T>(type: AllowMessageType, key?: string, origin?: string): Promise<T | null> => {
    let data: T | null = null
    try {
      const message = messageFormat<T>(key as any, type)
      const result = await post<T>(message, origin)
      data = result
    }
    // eslint-disable-next-line unused-imports/no-unused-vars
    catch (error) {
      data = null
    }
    return data
  }

  /**
   * @description: 获取全部LocalStorage
   * @param {string} key 获取单个key的值 传空值时获取全部的LocalStorage
   * @param {string} origin
   * @return {*}
   * @autor: 刘 相卿
   */
  const getLocalStorage = <T>(key: string = '', origin?: string): Promise<T | null> => {
    return getStorage<T>('LocalStorage', key, origin)
  }

  /**
   * @description: 获取全部SessionStorage
   * @param {string} key 获取单个key的值 传空值时获取全部的SessionStorage
   * @param {string} origin
   * @return {*}
   * @autor: 刘 相卿
   */
  const getSessionStorage = <T>(key: string = '', origin?: string): Promise<T | null> => {
    return getStorage<T>('SessionStorage', key, origin)
  }

  /**
   * @description: 获取全部cookie
   * @param {string} key 获取单个key的值 传空值时获取全部的cookie
   * @param {string} origin
   * @return {*}
   * @autor: 刘 相卿
   */
  const getCookie = <T>(key: string = '', origin?: string): Promise<T | null> => {
    return getStorage<T>('Cookie', key, origin)
  }

  /**
   * @description: 监听
   * @return {*}
   * @autor: 刘 相卿
   */
  const listener = (): void => {
    checkIFrame()
    window.addEventListener('message', onMessage)
  }

  const load = (): Promise<boolean> => {
    initialConfig()
    return new Promise((resolve) => {
      iframe.onload = () => {
        resolve(true)
      }
      listener()
    })
  }

  /**
   * @description: 销毁工具函数
   * @return {*}
   * @autor: 刘 相卿
   */
  const destory = (): void => {
    window.removeEventListener('message', onMessage)
  }

  return { load, post, destory, getLocalStorage, getSessionStorage, getCookie, messageFormat }
}

/**
 * @description: iframe消息接收hook
 * 应用于以frame方式嵌入的页面 非iframe嵌入方式不可使用
 * @param {IFrameUtilConfig} messageEvent
 * @param {(data: any) => T | Promise<T>} callback 可选项
 * @param {IFrameUtilConfig} allowOrigins 允许接收消息的origin 多个用半角逗号分隔[,](永远都不会接收自己页面的message)
 * @return {*}
 * @autor: 刘 相卿
 */
export async function iframeReceiveHook<T = any>(messageEvent: MessageEvent<IFrameMessageDataType<any>>, callback?: (data: any) => T | Promise<T>, allowOrigins?: string) {
  if (window.top === window.self) {
    throw new Error(`页面[${location.origin}]非iframe嵌入方式, 不允许接收message!`)
  }
  else {
    const origins = allowOrigins?.split(',') ?? []
    if (origins.some(origin => origin === '*' || origin === messageEvent.origin)) {
      const AllowMessageTypes = ['default', 'LocalStorage', 'SessionStorage', 'Cookie']
      const data = messageEvent.data
      if (data && data.uuid && AllowMessageTypes.includes(data.type)) {
        let result: T | null | undefined = null
        try {
          if (data.type === 'LocalStorage') {
            const storageData: any = getLocalStorage(data.content ? [data.content as string] : [])
            if (data.content) {
              result = storageData?.[data.content]
            }
            else {
              result = storageData
            }
          }
          else if (data.type === 'SessionStorage') {
            const storageData: any = getSessionStorage(data.content ? [data.content as string] : [])
            if (data.content) {
              result = storageData?.[data.content]
            }
            else {
              result = storageData
            }
          }
          else if (data.type === 'Cookie') {
            const cookieData: any = getCookie(data.content ? [data.content as string] : [])
            if (data.content) {
              result = cookieData?.[data.content]
            }
            else {
              result = cookieData
            }
          }
          else {
            if (callback) {
              result = await callback(data.content)
            }
            else {
              result = null
            }
          }

          if (result === null) {
            // 改变初始值
            result = undefined
          }
        }
        // eslint-disable-next-line unused-imports/no-unused-vars
        catch (error) {
          result = null
        }

        // 回传消息
        if (window.top) {
          window.top.postMessage({ ...data, content: result }, messageEvent.origin)
        }
      }
    }
  }
}

/**
 * @description: 向父级发送消息
 * @param {any} content
 * @param {string} origin
 * @return {*}
 * @autor: 刘 相卿
 */
export function postMessage2Top(content: any, origin?: string) {
  if (window.top && window.top !== window.self) {
    window.top.postMessage({ uuid: uuid(), content }, origin ?? window.top.origin)
  }
}
