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
