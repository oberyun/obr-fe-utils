---
outline: deep
---

# 安装

在项目中创建 `.npmrc` 文件并配置 `@obr-fe` 组织的下载源。

```bash
touch .npmrc
echo "@obr-fe:registry = https://dev-fe.oberyun.com/npm/" > .npmrc
```

支持 npm、pnpm 安装。

```bash
# npm
npm install @obr-fe/utils@latest

# pnpm（推荐）
pnpm add @obr-fe/utils@latest
```

在 `tsconfig.json` 文件中引入组件的 TS 类型声明文件

```json
{
  "compilerOptions": {
    "types": ["@obr-fe/utils/global.d.ts"]
  }
}
```

以上完成后即可在项目中使用。

```md
<script setup>
import { isEmptyValue } from '@obr-fe/utils'

console.log(isEmptyValue('')) // true
</script>
```
