/* eslint-env node */
import replace from '@rollup/plugin-replace'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import del from 'rollup-plugin-delete'

const globals = {
  react: 'React',
  'react-native': 'ReactNative',
  'react-native-svg': 'ReactNativeSVG',
}
const external = Object.keys(globals)
const extensions = ['.js', '.ts', '.tsx']
const isProd = process.env.NODE_ENV === 'production'

const plugins = [
  replace({
    preventAssignment: true,
    values: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    },
  }),
  commonjs(),
  nodeResolve({
    extensions,
  }),
  typescript({
    extensions,
    tsconfig: './tsconfig.json',
    tsconfigOverride: {
      compilerOptions: {
        jsx: 'react-jsx',
      },
    },
  }),
]

if (isProd) {
  plugins.unshift(del({ targets: 'dist/*' }))
}

export default {
  input: './src/lib/index.ts',
  output: [
    {
      file: './dist/index.js',
      format: 'esm',
      globals,
    },
  ],
  external,
  plugins,
}
