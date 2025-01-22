---
outline: deep
---

# API

按照基础、对象、数组、文件、其他五个分类介绍 `@obr-fe/utils`的能力。

## 基础

### isEmpty

判断数据是否为 `null` 或者类似 `null`，返回一个布尔值。

参数
| 参数名         | 说明                                   |   类型    | 默认值 |
| -------------- | -------------------------------------- | :-------: | :----: |
| value          | 需要判断的数据                         |   `any`   |   -    |
| undefinedValue | 判断类似 `null`值时是否包含`undefined` | `boolean` |  true  |

```vue
<script setup>
import { isEmpty } from '@obr-fe/utils'

isEmpty(null) // true
isEmpty('null') // true
isEmpty(undefined) // true
isEmpty(undefined, false) // false
</script>
```

### isEmptyValue

判断数据是否为空值，返回一个布尔值。空值包含`null` 、`undefined` 、`''` 和 `NaN`。

参数
| 参数名 | 说明           | 类型  | 默认值 |
| ------ | -------------- | :---: | :----: |
| value  | 需要判断的数据 | `any` |   -    |

```vue
<script setup>
import { isEmptyValue } from '@obr-fe/utils'

isEmptyValue(null) // true
isEmptyValue(undefined) // true
isEmptyValue('') // true
isEmptyValue(Number.NaN) // true
isEmptyValue(0) // false
</script>
```

### isEmptyObject

判断数据是否为空对象，返回一个布尔值。

参数
| 参数名 | 说明           |       类型       | 默认值 |
| ------ | -------------- | :--------------: | :----: |
| object | 需要判断的对象 | `ObjectDataType` |   -    |

```vue
<script setup>
import { isEmptyObject } from '@obr-fe/utils'

isEmptyObject({}) // true
isEmptyObject({ name: '' }) // false
isEmptyObject([]) // false

// 当然这个函数也可以做空值的校验
isEmptyObject('') // true
isEmptyObject(0) // true
</script>
```

### isEmptyArray

判断数据是否为空数组，返回一个布尔值。仅可用于一维数组的非空判断。

参数
| 参数名 | 说明           |  类型   | 默认值 |
| ------ | -------------- | :-----: | :----: |
| array  | 需要判断的数组 | `any[]` |  `[]`  |

```vue
<script setup>
import { isEmptyArray } from '@obr-fe/utils'

isEmptyArray([]) // true
isEmptyArray([0]) // false

// 由于设置了参数默认值为[]，所以传入undefined值时亦会返回true
isEmptyArray() // true
isEmptyArray(undefined) // true
</script>
```

### isMeaninglessArray

判断数据是否为无意义的数组，即数组的每个元素都为空值/类似空值，返回一个布尔值。仅可用于一维数组的判断。

参数
| 参数名 | 说明           |  类型   | 默认值 |
| ------ | -------------- | :-----: | :----: |
| array  | 需要判断的数组 | `any[]` |  `[]`  |

```vue
<script setup>
import { isMeaninglessArray } from '@obr-fe/utils'

isMeaninglessArray([]) // true
isMeaninglessArray(['', null, Number.NaN, undefined]) // true
isMeaninglessArray([0]) // false

// 由于设置了参数默认值为[]，所以传入undefined值时亦会返回true
isMeaninglessArray() // true
isMeaninglessArray(undefined) // true

// 传入非数组类型的数据时，返回false
isMeaninglessArray({} as any) // false
</script>
```

### getDataType

判断传入的数据为何种类型，返回一个 `DataType` 类型的字符串。

参数
| 参数名 | 说明           | 类型  | 默认值 |
| ------ | -------------- | :---: | :----: |
| data   | 需要判断的数据 | `any` |   -    |

```vue
<script setup>
import { getDataType } from '@obr-fe/utils'

getDataType([]) // array
getDataType(0) // number
getDataType('') // string
getDataType(new FormData()) // formdata
</script>
```

### getFileType

根据文件全路径 url 获取文件的类型，返回一个大写的字符串（即最后一个 `.` 后面的文件后缀）或返回 `未知`。

参数
| 参数名 | 说明       |   类型   | 默认值 |
| ------ | ---------- | :------: | :----: |
| url    | 文件全路径 | `string` |   -    |

```vue
<script setup>
import { getFileType } from '@obr-fe/utils'

getFileType('https://xx.xxx.com/files/demo.png') // PNG
getFileType('https://xx.xxx.com/files/images/1') // 未知
</script>
```

### replaceLastMatch

将最后一个匹配成功的字符替换为期望值，并返回新的替换后的字符串。

参数
| 参数名 | 说明           |   类型   | 默认值 |
| ------ | -------------- | :------: | :----: |
| str    | 原始字符串     | `string` |   -    |
| char   | 需要匹配的字符 | `string` |   -    |
| target | 期望替换值     | `string` |   -    |

```vue
<script setup>
import { replaceLastMatch } from '@obr-fe/utils'

replaceLastMatch('hello world!', '!', '.') // hello world.
replaceLastMatch('hello world!', 'l', 'L') // helLo world!
replaceLastMatch('hello world!', '', 'A') // hello world!A
replaceLastMatch('hello world!', 'obr', 'OBR') // hello world!
</script>
```

### replaceMatch

按照传入的正则表达式，将所有匹配到的字符替换为期望值。

参数
| 参数名 | 说明       |   类型   | 默认值 |
| ------ | ---------- | :------: | :----: |
| str    | 原始字符串 | `string` |   -    |
| reg    | 正则表达式 | `RegExp` |   -    |
| target | 期望替换值 | `string` |   -    |

```vue
<script setup>
import { replaceMatch } from '@obr-fe/utils'

// 将非数字和-的字符替换为空字符
replaceLastMatch('+86 -137 0123/4567', /[^\d./]/, '') // 86-13701234567
</script>
```

### formatPositiveNumber

将数字转换为正数并返回。

参数
| 参数名 | 说明 |   类型   | 默认值 |
| ------ | ---- | :------: | :----: |
| value  | 数值 | `number` |   -    |

```vue
<script setup>
import { formatPositiveNumber } from '@obr-fe/utils'

formatPositiveNumber(-1) // 0
formatPositiveNumber(Number.NaN) // 0
formatPositiveNumber(1.2) // 1.2
</script>
```

### string2json

将传入的JSON字符串转换为JSON对象，传入的字符串转换失败时，返回默认值或空对象。

参数
| 参数名       | 说明       |   类型   | 默认值 |
| ------------ | ---------- | :------: | :----: |
| str          | JSON字符串 | `string` |   -    |
| defaultValue | 默认值     |  `any`   |  `{}`  |

```vue
<script setup>
import { string2json } from '@obr-fe/utils'

string2json('') // {}
string2json('', []) // []
string2json('{"type":"module"}') // {type: 'module'}
</script>
```

### json2string

将传入的JSON对象/数组转换为JSON字符串，传入的对象/数组无法转换为字符串时，返回空字符串。

参数
| 参数名 | 说明          | 类型  | 默认值 |
| ------ | ------------- | :---: | :----: |
| json   | JSON对象/数组 | `any` |   -    |

```vue
<script setup>
import { json2string } from '@obr-fe/utils'

json2string([File]) // ''
string2json([1, 3]) // '[1,3]'
</script>
```

## 对象

### objectSortByKey

根据对象中的属性名称对传入对象进行排序，并返回一个新的排序后的对象。

参数
| 参数名 | 说明           |       类型       | 默认值 |
| ------ | -------------- | :--------------: | :----: |
| object | 需要排序的对象 | `ObjectDataType` |  `{}`  |
| asc    | 是否升序       |    `boolean`     | `true` |

```vue
<script setup>
import { objectSortByKey } from '@obr-fe/utils'

objectSortByKey({ value: '值', label: '标签' }) // { label: "标签", value: "值" }
objectSortByKey({ label: '标签', value: '值' }, false) // { value: "值", label: "标签" }
</script>
```

### json2url

将传入的 json 对象转换为 url query 格式，返回一个新的字符串。

参数
| 参数名 | 说明           |       类型       | 默认值 |
| ------ | -------------- | :--------------: | :----: |
| json   | 需要转换的对象 | `ObjectDataType` |  `{}`  |

```vue
<script setup>
import { json2url } from '@obr-fe/utils'

json2url({ id: 1, type: 'normal' }) // id=1&type=normal
</script>
```

### url2json

将传入的 url query 字符串转换为对象格式，返回一个新的对象。

参数
| 参数名 | 说明           |   类型   | 默认值 |
| ------ | -------------- | :------: | :----: |
| url    | 需要转换的 url | `string` |   -    |

```vue
<script setup>
import { url2json } from '@obr-fe/utils'

url2json('http://xx.xxx.com/api/query?name=abc&t=1359') // { name: 'abc', t: '1359' }
</script>
```

### json2formdata

将传入的 json 对象转换为 `FormData` 格式，返回一个新的 `FormData` 对象。

参数
| 参数名 | 说明                 |       类型       | 默认值 |
| ------ | -------------------- | :--------------: | :----: |
| json   | 需要转换的 json 对象 | `ObjectDataType` |  `{}`  |

```vue
<script setup>
import { json2formdata } from '@obr-fe/utils'

json2formdata({ name: 'name', value: 'value' }) // FormData {}
</script>
```

### formdata2json

将传入的 `FormData` 对象转换为普通对象格式，返回一个新的对象。

参数
| 参数名   | 说明                     |    类型    | 默认值 |
| -------- | ------------------------ | :--------: | :----: |
| formdata | 需要转换的 FormData 对象 | `FormData` |   -    |

```vue
<script setup>
import { formdata2json } from '@obr-fe/utils'

const formdata = new FormData()
formdata.append('name', 'demo-name')

formdata2json(formdata) // { name: 'demo-name' }
</script>
```

### deleteEmptyValue

删除传入对象中的空值，返回一个新的对象。

参数
| 参数名 | 说明     |       类型       | 默认值 |
| ------ | -------- | :--------------: | :----: |
| data   | 数据对象 | `ObjectDataType` |  `{}`  |

```vue
<script setup>
import { deleteEmptyValue } from '@obr-fe/utils'

deleteEmptyValue({ prop1: '', prop2: Number.NaN, prop3: null, prop4: undefined, prop5: 0 }) // { prop5: 0 }
</script>
```

### cloneData2Object

以目标对象中的属性为准，将完整对象中对应的属性值拷贝到目标对象，并返回一个新的对象。

参数
| 参数名 | 说明     |       类型       | 默认值 |
| ------ | -------- | :--------------: | :----: |
| data   | 完整对象 | `ObjectDataType` |   -    |
| object | 目标对象 | `ObjectDataType` |   -    |

```vue
<script setup>
import { cloneData2Object } from '@obr-fe/utils'

const originObject = { name: 'zhang san', age: 10, address: 'HongKong' }
const targetObject = { name: 'wang wu', address: 'TaiPei' }

cloneData2Object(originObject, targetObject) // { name: 'zhang san', address: 'HongKong' }
</script>
```

### hasProperties

判断传入对象是否存在指定的属性，返回布尔值。

参数
| 参数名 | 说明     |       类型       | 默认值 |
| ------ | -------- | :--------------: | :----: |
| object | 数据对象 | `ObjectDataType` |   -    |
| props  | 属性数组 |    `string[]`    |   -    |

```vue
<script setup>
import { hasProperties } from '@obr-fe/utils'

const data = { name: 'zhang san', age: 10, address: 'HongKong' }

hasProperties(['name', 'age']) // true
hasProperties(['name', 'tel']) // false
</script>
```

### getObjectFromMapping

根据传入的对象和映射关系创建新的数据对象，并返回一个新的对象。

参数
| 参数名  | 说明                                                       |           类型           | 默认值 |
| ------- | ---------------------------------------------------------- | :----------------------: | :----: |
| data    | 数据对象                                                   |     `ObjectDataType`     |   -    |
| mapping | 映射关系，`key`代表新对象的属性，`value`代表传入对象的属性 | `Record<string, string>` |   -    |

```vue
<script setup>
import { getObjectFromMapping } from '@obr-fe/utils'

const data = { name: 'zhang san', age: 10, address: 'HongKong' }

getObjectFromMapping(data, { userName: 'name', userAddress: 'address' }) // { userName: 'zhang san', userAddress: 'HongKong' }
</script>
```

## 数组

### array2tree

将传入的对象数组转换为树型结构数据，返回一个树型数组 `TreeItemType[]`。

参数
| 参数名   | 说明            |        类型        |   默认值   |
| -------- | --------------- | :----------------: | :--------: |
| data     | 对象数组        | `ObjectDataType[]` |    `[]`    |
| id       | id 字段名       |      `string`      |    `id`    |
| pid      | pid 字段名      |      `string`      |   `pid`    |
| children | children 字段名 |      `string`      | `children` |

```vue
<script setup>
import { array2tree } from '@obr-fe/utils'

const data = [{ id: 'A01', pid: 'A', label: 'China' }, { id: 'A0101', pid: 'A01', label: 'HongKong' }]

array2tree(data) // [{ id: 'A01', pid: 'A', label: 'China', children: [{ id: 'A0101', pid: 'A01', label: 'HongKong' }] }]
</script>
```

### array2option

将传入对象根据 `alias` 转换为选项式数组，返回一个新数组 `BaseOptionType[]`。

参数
| 参数名 | 说明     |                类型                | 默认值 |
| ------ | -------- | :--------------------------------: | :----: |
| data   | 对象数组 |         `ObjectDataType[]`         |  `[]`  |
| alias  | 别名 map | `{ label: string; value: string }` |   -    |

```vue
<script setup>
import { array2option } from '@obr-fe/utils'

const data = [{ name: 'zhang san', age: 10 }]

array2option(data, { label: 'name', value: 'age' }) // [{ label: 'zhang san', value: 10 }]
</script>
```

### deleteEmptyElement

将传入数组中的空元素删除，并返回一个新数组。

参数
| 参数名 | 说明     |    类型    | 默认值 |
| ------ | -------- | :--------: | :----: |
| object | 数组     |   `T[]`    |   -    |
| props  | 属性数组 | `string[]` |   -    |

```vue
<script setup>
import { deleteEmptyElement } from '@obr-fe/utils'

const data = ['', undefined, null, Number.NaN, 0, {}]

deleteEmptyElement(data) // [0, {}]
</script>
```

### getElementsByValues

根据给定的值集合，查找树型结构数据中符合条件的元素，并返回一个新数组。

参数
| 参数名 | 说明       |                  类型                   | 默认值 |
| ------ | ---------- | :-------------------------------------: | :----: |
| array  | 数据对象   |            `TreeItemType[]`             |  `[]`  |
| values | 数据集合   |         `(string \| number)[]`          |   -    |
| alias  | 别名 alias | `{ value?: string; children?: string }` |   -    |

```vue
<script setup>
import { getElementsByValues } from '@obr-fe/utils'

const data = [
  { id: 'A01', name: '组一', children: [{ id: 'A0101', name: '分支一', children: [{ id: 'A010101', name: '分支一', children: null }] }] },
  { id: 'A02', name: '组二', children: [{ id: 'A0201', name: '分支一', children: null }] },
  { id: 'A03', name: '组三', children: [{ id: 'A0301', name: '分支一', children: null }] }
]

const values = ['A01', 'A0101', 'A010101']

getElementsByValues(data, values, { value: 'id' }) // [{ id: 'A01', name: '组一' }, { id: 'A0101', name: '分支一' }, { id: 'A010101', name: '分支一' }]
</script>
```

### tree2array

将树型结构数组拉平为一维数组，返回一个新数组。

参数
| 参数名 | 说明       |       类型       |   默认值   |
| ------ | ---------- | :--------------: | :--------: |
| data   | 树型数据   | `TreeItemType[]` |    `[]`    |
| alias  | 别名 alias |     `string`     | `children` |

```vue
<script setup>
import { tree2array } from '@obr-fe/utils'

const data = [
  { id: 'A01', name: '组一', children: [{ id: 'A0101', name: '分支一', children: [{ id: 'A010101', name: '分支一', children: null }] }] },
  { id: 'A02', name: '组二', children: [{ id: 'A0201', name: '分支一', children: null }] }
]

tree2array(data)
// result
// [{ id: 'A01', name: '组一' }, { id: 'A0101', name: '分支一' }, { id: 'A010101', name: '分支一' }, { id: 'A02', name: '组二' }, { id: 'A0201', name: '分支一' }]
</script>
```

### uniqueArrayByKeys

根据传入的 `keys` 将对象数组去重，返回一个新数组。

参数
| 参数名 | 说明           |        类型        | 默认值 |
| ------ | -------------- | :----------------: | :----: |
| array  | 对象数组       | `ObjectDataType[]` |  `[]`  |
| keys   | 数组对象中的键 |      `string`      |   -    |

```vue
<script setup>
import { uniqueArrayByKeys } from '@obr-fe/utils'

const data = [
  { id: 'A01', name: '组一' },
  { id: 'A02', name: '组一' },
  { id: 'A01', name: '组一', age: 12 },
  { id: 'A01', name: '组二' }
]

uniqueArrayByKeys(data)
// result
// [{ id: 'A01', name: '组一' }, { id: 'A02', name: '组一' }, { id: 'A01', name: '组二' }]
</script>
```

### deleteElement

根据传入的 `values` 删除简单数组中的符合规则的元素，返回一个新数组。

参数
| 参数名 | 说明         |             类型              | 默认值 |
| ------ | ------------ | :---------------------------: | :----: |
| array  | 原数组       | `(number\|string\|boolean)[]` |   -    |
| values | 符合的元素值 | `(number\|string\|boolean)[]` |  `[]`  |

```vue
<script setup>
import { deleteElement } from '@obr-fe/utils'

const data = [1, 2, 3, 4, 5, 6, 7, 7]

deleteElement(data, [1, 3, 5, 7])
// result
// [2, 4, 6]
</script>
```

### deleteElementPro

根据传入的 `rules` 删除数组中的符合规则的元素，返回一个新数组。

参数
| 参数名 | 说明         |  类型   | 默认值 |
| ------ | ------------ | :-----: | :----: |
| array  | 原数组       | `any[]` |   -    |
| rules  | 符合的元素值 | `any[]` |  `[]`  |

```vue
<script setup>
import { deleteElementPro } from '@obr-fe/utils'

// 符合的元素值，如：[1, { name: 'x', age: 12 }, { name: 'z' }]则删除「元素 = 1 或 元素.name = 'x' && 元素.age = 'x' 或 元素.name = 'z'」的元素
const data = [1, 1, 3, Number.NaN, { name: 1, value: 1 }, { name: 1, value: 1, id: '-1' }, { name: 2, value: 3 }, { name: 3, value: 4 }]
const rules = [1, Number.NaN, { name: 1, value: 1 }, { value: 3 }]
deleteElementPro(data, rules)
// result
// [3, { name: 3, value: 4 }]
</script>
```

## 文档

### setDocumentTitle

设置文档标题。可用于路由切换为每个路由设置不同的文档标题。

参数
| 参数名 | 说明     |   类型   | 默认值 |
| ------ | -------- | :------: | :----: |
| title  | 文档标题 | `string` |   -    |

```vue
<script setup>
import { setDocumentTitle } from '@obr-fe/utils'

setDocumentTitle('@obr-fe/utils API 文档')
</script>
```

### getPx

根据窗口大小和设计稿的比例动态计算像素值，返回一个数值。

参数
| 参数名 | 说明                   |   类型   | 默认值 |
| ------ | ---------------------- | :------: | :----: |
| px     | 基于设计稿的原始像素值 | `number` |   -    |
| width  | 设计稿宽度             | `number` | `1920` |
| height | 设计稿高度             | `number` | `1080` |

```vue
<script setup>
import { getPx } from '@obr-fe/utils'

getPx(14) // 6.33 具体值由当前视口于设计稿的比例决定
</script>
```

### getMaxZIndex

获取文档所有包含 `z-index` 属性节点的 `z-index` 最大值 并 `＋1`。

```vue
<script setup>
import { nextTick, onMounted } from 'vue'
import { getMaxZIndex } from '@obr-fe/utils'

onMounted(() => nextTick(() => getMaxZIndex())) // 1
</script>
```

## 文件

### chunkFile

将文件按照传入的单个文件大小为单位切片，并返回一个新的文件切片数组 `FileChunkType[]`。

参数
| 参数名 | 说明                      |   类型   | 默认值 |
| ------ | ------------------------- | :------: | :----: |
| file   | 文件对象                  |  `File`  |   -    |
| mb     | 单个文件切片大小，单位 MB | `number` |  `4`   |

```vue
<script setup>
import { chunkFile } from '@obr-fe/utils'

const file = new FileReader()

// ...

chunkFile(file) // [...]
</script>
```

## 其他

### removeElement

将传入的 `DOM` 节点从节点树中移除。

参数
| 参数名  | 说明 |     类型      | 默认值 |
| ------- | ---- | :-----------: | :----: |
| element | 节点 | `HTMLElement` |   -    |

```vue
<script setup>
import { removeElement } from '@obr-fe/utils'

const element = document.createElement('html')
document.append(element)

removeElement(element)
</script>
```

### hex2rgba

将传入的 HEX 格式的颜色转换为 RGBA 格式的颜色，返回一个新的颜色字符串。

参数
| 参数名 | 说明         |   类型   | 默认值 |
| ------ | ------------ | :------: | :----: |
| color  | HEX 格式颜色 | `string` |   -    |
| alpha  | 透明度       | `number` |   -    |

```vue
<script setup>
import { hex2rgba } from '@obr-fe/utils'

removeElement('#FFFFFF', 0.5) // rgba(255, 255, 255, 0.5)
</script>
```

### getValueByMapping

根据映射关系对象，查找 key 对应的值，无对应关系时返回默认值（`default`对应的值）。

参数
| 参数名  | 说明             |        类型        | 默认值 |
| ------- | ---------------- | :----------------: | :----: |
| mapping | 映射关系对象     |   `MappingType`    |   -    |
| key     | 映射关系对象 key | `string \| number` |   -    |

```vue
<script setup>
import { getValueByMapping } from '@obr-fe/utils'

const mapping: MappingType = {
  abnormal: '异常',
  normal: '正常',
  default: '未知'
}

getValueByMapping(mapping, 'abnormal') // 异常
getValueByMapping(mapping, 'normal') // 正常
getValueByMapping(mapping, 'status') // 未知
</script>
```

### number2thousands

将传入的数字添加千分符 `,`，并返回一个新的字符串。

参数
| 参数名 | 说明 |   类型   | 默认值 |
| ------ | ---- | :------: | :----: |
| number | 数值 | `number` |   -    |

```vue
<script setup>
import { number2thousands } from '@obr-fe/utils'

number2thousands(123456.7809) // 123,456.7809
</script>
```

### usePromise

接收一个函数作为参数, 并返回一个新的`Promise`。

参数
| 参数名 | 说明                     |   类型   | 默认值 |
| ------ | ------------------------ | :------: | :----: |
| fn     | 传入的函数支持(异步函数) | `uknown` |   -    |

```vue
<script setup>
import { usePromise } from '@obr-fe/utils'

function fn() {
  return 'ABC'
}

usePromise(fn).then((data) => {
  console.log(data)
}) // ABC
</script>
```

### getMimeByUrl

通过fetch获取文件的MIME类型, 返回 `mime` 字符串, 若字符串为空则代表获取异常。

参数
| 参数名 | 说明           |   类型   | 默认值 |
| ------ | -------------- | :------: | :----: |
| url    | 传入的文件地址 | `string` |   -    |

```vue
<script setup>
import { getMimeByUrl } from '@obr-fe/utils'

const fileUrl = 'http://192.168.2.35/ims-resource/2024/11/19/113423809/IMG_1607.JPG?imageView2/1/w/80/h/80'

getMimeByUrl(fileUrl).then((mime) => {
  console.log(mime)
}) // image/jpeg
</script>
```
