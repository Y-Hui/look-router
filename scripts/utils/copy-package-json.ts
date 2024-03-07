import fs from 'fs'
import { omit } from 'lodash-es'
import path from 'path'

import { writeFile } from './write-file'

export function copyPackageJson(packagePath: string) {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(packagePath, './package.json')).toString('utf-8'),
  )

  const result = omit(packageJson, [
    'scripts',
    'buildOptions',
    'devDependencies',
    'prettier',
    'jest',
  ])

  return writeFile(
    path.join(packagePath, 'dist/package.json'),
    JSON.stringify(result, null, '  '),
  )
}
