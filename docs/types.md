---
outline: deep
---

# Typescript 类型

按照基础、对象、数组、文件、其他五个分类介绍 `@obr-fe/utils`的能力。

## 基础
### ObjectDataType

基础对象类型，接受一个泛型。

```typescript
type ObjectDataType<T = any, D extends string = string> = Record<D, T>
```

### BaseOptionType

基础选项类型，接受一个泛型，继承 `ObjectDataType`，常用于下拉选项数据。

```typescript
interface BaseOptionType<T = ObjectDataType> extends ObjectDataType {
  label: string // 显示标签内容
  value: string | number // 选项对应的数值
  json?: T // 扩展json
}
```

### DataType

数据类型。

```typescript
type DataType =
  | 'set'
  | 'map'
  | 'function'
  | 'object'
  | 'array'
  | 'undefined'
  | 'null'
  | 'number'
  | 'symbol'
  | 'string'
  | 'boolean'
  | 'regexp'
  | 'date'
  | 'bigint'
  | 'blob'
  | 'formdata'
```

### TreeItemType

树型结构数据类型，继承 `ObjectDataType`。

```typescript
interface TreeItemType extends ObjectDataType {
  label: string
  children?: TreeItemType[]
}
```

### FileChunkType

切片文件数据类型。

```typescript
interface FileChunkType {
  file: Blob // 文件
  size: number // 文件大小
  index: number // 文件索引
}
```

### MappingType

映射关系对象类型。

```typescript
interface MappingType extends ObjectDataType {
  default: any // 默认映射关系
}
```

## Axios
### RequestBaseConfig

axios请求配置类型，继承 `AxiosRequestConfig`。

```typescript
interface RequestBaseConfig extends AxiosRequestConfig {
  basePath?: string // 配置请求本地资源的路径
  allowCancel?: boolean // 重复请求允许取消
  allowNullValue?: boolean // 请求参数过滤空值
  successCode?: number // 请求成功的code
  whiteUrl?: () => string[] // 请求白名单(不需要在headers中配置token) 如遇其他接口401错误时白名单接口仍然正常请求
  alias?: () => Partial<ResAlias> // 配置响应数据字段的别名
  token?: TokenConfig // token配置项
  beforeRequest?: (config: ObrAxiosRequestConfig) => ObrAxiosRequestConfig // 请求前的操作
  afterRequest?: (response: ObrAxiosResponse<ResDataType>, options: RequestBaseConfig) => ObrAxiosResponse<ResDataType> // 请求后的操作
  401?: (error: ResDataType) => any // 处理401错误
  cancel?: (error: any) => any // 处理请求取消捕捉的错误
  error?: (error: any) => any // 处理其他请求错误(服务端错误/客户端错误)捕捉的错误
}
```

### HeadersType

headers扩展类型。

```typescript
interface HeadersType {
  'X-Never-Cancel'?: boolean // 请求是否永远不会被取消
  'X-Cancel-Rule'?: 'path' | 'method' | 'params' // 请求取消判断的规则 (path: 同一路径; method: 同一路径+请求方法; params: 同一路径+请求方法+参数)
  'X-Hide-Message'?: boolean // 是否隐藏请求消息提示（暂不启用）
}
```

### ObrAxiosRequestConfig

请求配置项类型。

```typescript
interface ObrAxiosRequestConfig<D = any> extends AxiosRequestConfig<D> {
  headers?: AxiosRequestConfig['headers'] & HeadersType
}
```

### ObrAxiosResponse

请求响应类型。

```typescript
interface ObrAxiosResponse<T = any> extends Omit<AxiosResponse<T>, 'data'> {
  data: ResDataType<T>
}
```

### ObrAxiosStatic

axios静态方法类型。

```typescript
export interface ObrAxiosStatic extends Omit<AxiosStatic, 'create'> {
  create: (config?: CreateAxiosDefaults) => ObrAxiosInstance
}
```

### ObrAxiosInstance

axios实例类型。

```typescript
interface ObrAxiosInstance extends Pick<AxiosInstance, 'defaults'> {
  interceptors: {
    request: AxiosInterceptorManager<ObrAxiosRequestConfig>
    response: AxiosInterceptorManager<ObrAxiosResponse<ResDataType>>
  }

  <T = any, D = any>(config: AxiosRequestConfig<D>): Promise<ResDataType<T>>
  <T = any, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<ResDataType<T>>

  getUri: (config?: ObrAxiosRequestConfig) => string
  request: <T = any>(config: ObrAxiosRequestConfig) => Promise<ResDataType<T>>
  get: <T = any>(url: string, config?: ObrAxiosRequestConfig) => Promise<ResDataType<T>>
  delete: <T = any> (url: string, config?: ObrAxiosRequestConfig) => Promise<ResDataType<T>>
  head: <T = any>(url: string, config?: ObrAxiosRequestConfig) => Promise<ResDataType<T>>
  options: <T = any>(url: string, config?: ObrAxiosRequestConfig) => Promise<ResDataType<T>>
  post: <T = any, D = any>(url: string, data?: D, config?: ObrAxiosRequestConfig) => Promise<ResDataType<T>>
  put: <T = any, D = any>(url: string, data?: D, config?: ObrAxiosRequestConfig) => Promise<ResDataType<T>>
  postForm: <T = any, D = any>(url: string, data?: D, config?: ObrAxiosRequestConfig) => Promise<ResDataType<T>>
  putForm: <T = any, D = any>(url: string, data?: D, config?: ObrAxiosRequestConfig) => Promise<ResDataType<T>>
  patch: <T = any, D = any>(url: string, data?: D, config?: ObrAxiosRequestConfig) => Promise<ResDataType<T>>
  patchForm: <T = any, D = any>(url: string, data?: D, config?: ObrAxiosRequestConfig) => Promise<ResDataType<T>>
}
```

## Alias
### ResAlias

响应数据别名配置类型。

```typescript
interface ResAlias {
  code: string // 响应code字段别名
  data: string // 响应数据字段别名
  msg: string // 响应消息提示字段别名
}
```

### OptionResAlias

option数据别名配置类型。

```typescript
interface OptionResAlias {
  label: string // label字段别名
  value: string // value字段别名
  json: string // 扩展字段别名
}
```

### PageAlias

分页数据别名配置类型。

```typescript
interface PageAlias {
  records: string // 分页数据字段别名
  total: string // 数据总数字段别名
  pageSize: string // 分页大小字段别名
  pageNo: string // 页码字段别名
}
```

## Config
### TokenConfig

token配置类型。

```typescript
interface TokenConfig {
  key: string // token的键名称
  get: () => string // 获取token的方法
}
```

## Data
### ResDataType

接口响应数据类型，接受一个泛型，继承 `AxiosRequestConfig`。

```typescript
interface ResDataType<T = any> extends ObjectDataType {
  code: number
  data: T
  msg: string
}
```

### PageQueryType

分页接口请求数据类型。

```typescript
export interface PageQueryType {
  pageSize?: number // 分页大小
  pageNo?: number // 页码
}
```

### PageResType

分页接口响应数据类型，接受一个泛型。

```typescript
interface PageResType<R = ObjectDataType> {
  records: R[] // 分页数据
  total: number // 分页总数
}
```

## Others
### ErrorType

错误捕捉数据类型。

```typescript
export interface ErrorContentObject {
  REQUEST: ResDataType // 请求类错误(code===500...)
  CANCEL: any // 请求被取消捕捉的错误
  ERROR: any // 其他错误
}

export interface ErrorType { type: keyof ErrorContentObject, content: ErrorContentObject[keyof ErrorContentObject] }
```
