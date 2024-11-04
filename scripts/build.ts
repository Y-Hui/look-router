import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import ts from '@rollup/plugin-typescript'
import chalk from 'chalk'
import path from 'path'
import copy from 'rollup-plugin-copy'
import del from 'rollup-plugin-delete'
import { dts } from 'rollup-plugin-dts'
import extensions from 'rollup-plugin-extensions'
import nodeExternals from 'rollup-plugin-node-externals'

import { compile } from './utils/compile'
import { copyPackageJson } from './utils/copy-package-json'
import Logger from './utils/logger'

const resolve = (...pathName: string[]) => {
  return path.resolve(__dirname, '../', ...pathName)
}

const external = [
  'react',
  'react-dom',
  'use-sync-external-store',
  'use-sync-external-store/shim',
]

async function main() {
  const startTime = Date.now()
  const log = new Logger('look-router')
  log.info('start compiling')

  try {
    const root = resolve()
    const input = resolve('src/index.ts')
    const output = resolve('dist/dist')
    await compile({
      input,
      output: {
        file: `${output}/index.esm.js`,
        format: 'esm',
        sourcemap: true,
        exports: 'named',
        preserveModules: false,
        externalLiveBindings: true,
      },
      external,
      plugins: [
        del({ targets: resolve('dist') }),
        extensions({ extensions: ['.tsx', '.ts'] }),
        nodeExternals(),
        babel({
          babelHelpers: 'bundled',
          exclude: /node_modules/,
          presets: [
            ['@babel/preset-env', { loose: true }],
            '@babel/preset-react',
            ['@babel/preset-typescript', { optimizeConstEnums: false }],
          ],
          extensions: ['.ts', '.tsx'],
        }),
        ts({
          tsconfig: path.resolve(process.cwd(), 'tsconfig.json'),
          exclude: ['__tests__'],
          noEmitOnError: true,
          outDir: path.resolve(output, './dts'),
        }),
        replace({
          preventAssignment: true,
          __DEV__: `process.env.NODE_ENV !== 'production'`,
        }),
      ],
    })
    await compile({
      input,
      output: {
        file: `${output}/index.js`,
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
        preserveModules: false,
        externalLiveBindings: true,
        name: 'ReactLookRouter',
      },
      external,
      plugins: [
        extensions({ extensions: ['.tsx', '.ts'] }),
        nodeExternals(),
        babel({
          babelHelpers: 'bundled',
          exclude: /node_modules/,
          presets: [
            ['@babel/preset-env', { loose: true }],
            '@babel/preset-react',
            ['@babel/preset-typescript', { optimizeConstEnums: false }],
          ],
          extensions: ['.ts', '.tsx'],
        }),
        replace({
          preventAssignment: true,
          __DEV__: `process.env.NODE_ENV !== 'production'`,
        }),
      ],
    })
    await compile({
      input: resolve(output, 'dts/index.d.ts'),
      output: [{ file: resolve(output, 'index.d.ts'), format: 'es' }],
      plugins: [
        del({ targets: resolve(output, './dts'), hook: 'buildEnd' }),
        dts(),
        copy({
          targets: [
            { src: path.join(root, 'LICENSE'), dest: resolve('dist') },
            { src: path.join(root, 'README.md'), dest: resolve('dist') },
          ],
          verbose: true,
        }),
      ],
    })
    copyPackageJson(resolve())
    log.info(
      `Package ${chalk.cyan('look-router')} was built in ${chalk.green(
        `${((Date.now() - startTime) / 1000).toFixed(2)}s`,
      )}`,
    )
    log.success('Compilation completed.')
  } catch (error) {
    log.error(error)
  }
}

main()
