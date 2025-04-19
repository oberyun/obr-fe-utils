/**
 * @description: 获取视频文件的封面
 * @param {File} file
 * @return {*}
 * @autor: 刘 相卿
 */
export function getVideoPoster(file: File): Promise<string> {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    const url = URL.createObjectURL(file)
    video.src = url

    video.addEventListener('loadedmetadata', () => {
      // 跳转到第一帧
      video.currentTime = 0
    })

    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)

      const dataURL = canvas.toDataURL('image/png')
      resolve(dataURL)

      URL.revokeObjectURL(url)
    })
  })
}
