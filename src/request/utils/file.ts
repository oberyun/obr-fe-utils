import type { ResDataType } from '../../types'

export function readBlobResponse(file: Blob): Promise<ResDataType> {
  return new Promise((resolve) => {
    let result: ResDataType = {
      code: 200,
      data: file,
      msg: '',
    }

    if (file.type !== 'application/json') {
      resolve(result)
    }
    else {
      const fileReader = new FileReader()
      fileReader.readAsText(file)

      fileReader.onloadend = () => {
        result = JSON.parse(fileReader.result as string)

        resolve(result)
      }
    }
  })
}
