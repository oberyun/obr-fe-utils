import type { ResDataType } from '../../types'

export function readBlobResponse(file: Blob): Promise<ResDataType> {
  return new Promise((resolve) => {
    const fileReader = new FileReader()
    fileReader.readAsText(file)
    let result: ResDataType = {
      code: 200,
      data: null,
      msg: '',
    }
    fileReader.onloadend = () => {
      if (file.type === 'application/json') {
        result = JSON.parse(fileReader.result as string)
      }
      else {
        result.data = file
      }

      resolve(result)
    }
  })
}
