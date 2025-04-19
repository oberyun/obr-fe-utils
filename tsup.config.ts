import { defineConfig } from 'tsup'
import fg from 'fast-glob'

const files = fg.sync(['./src/**/*.ts', '!src/**/*.d.ts'])
export default defineConfig({
  entry: [...files],
  format: ['esm', 'cjs'],
  dts: {
    resolve: true,
  },
  external: ['vue', 'pinyin-pro', 'crypto-js'], // 排除的依赖
  clean: true,
  minify: true,
})
