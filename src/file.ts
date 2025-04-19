/**
 * @description: 切片文件数据类型
 * @return {*}
 * @autor: 刘 相卿
 */
export interface FileChunkType {
  file: Blob
  size: number
  index: number
}

/**
 * @description: 文件切片
 * @param {File} file 文件
 * @param {number} mb 单个切片大小，单位MB（默认4MB）
 * @return {{ file: Blob }[]} chunkList 切片集合
 * @autor: 刘 相卿
 */
export function chunkFile(file: File, mb: number = 4): FileChunkType[] {
  const chunkList: FileChunkType[] = []
  const size = 1024 * 1024 * mb
  let cur = 0

  while (cur < file.size) {
    const chunk = file.slice(cur, cur + size)
    chunkList.push({
      file: chunk,
      size: chunk.size,
      index: cur / size,
    })
    cur += size
  }

  return chunkList
}

/**
 * @description: file转base64
 * @param {File} file
 * @return {*}
 * @autor: 刘 相卿
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = ({ target }: ProgressEvent<FileReader>) => {
      const base64 = (target?.result ?? '') as string
      if (base64) {
        resolve(base64)
      }
      else {
        reject(base64)
      }
    }

    reader.onerror = (error) => {
      reject(error)
    }

    reader.readAsDataURL(file) // 开始读取文件
  })
}

/**
 * @description: base64转file
 * @param {string} base64
 * @param {string} filename
 * @return {*}
 * @autor: 刘 相卿
 */
export function base64ToFile(base64: string, filename: string): File {
  // 分离数据URI和Base64数据
  const parts = base64.split(',')
  const base64Data = parts.length > 1 ? parts[1] : parts[0]

  // 提取MIME类型，默认application/octet-stream
  const mimeType = parts[0].match(/:(.*?);/)?.[1] || 'application/octet-stream'

  // 解码Base64字符串
  const byteString = atob(base64Data)

  // 转换为Uint8Array
  const byteArray = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i)
  }

  // 创建并返回File对象
  return new File([byteArray], filename, { type: mimeType })
}
