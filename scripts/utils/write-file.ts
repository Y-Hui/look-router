import fs from 'fs'

export function writeFile(pathName: string, data: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const lastPath = pathName.substring(0, pathName.lastIndexOf('/'))
    fs.mkdir(lastPath, { recursive: true }, (err) => {
      if (err) {
        reject(err)
        return
      }
      fs.writeFile(pathName, data, (err2) => {
        if (err2) {
          reject(err2)
          return
        }
        resolve()
      })
    })
  })
}
