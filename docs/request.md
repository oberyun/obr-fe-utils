---
outline: deep
---

# Request

## 创建
```typescript
import { type ObrAxiosRequestConfig, ObrRequest, type ResDataType } from '@obr-fe/utils'

const http = new ObrRequest({
  baseURL: '/obr-api', // 配置接口请求前缀
  basePath: import.meta.env.VITE_BASE_PATH, // 配置请求本地资源的路径
  allowCancel: true, // 重复请求允许取消
  allowNullValue: false, // 请求参数过滤空值
  successCode: 200, // 请求成功的code
  whiteUrl: () => ['/UserService/getCode'], // 请求白名单(不需要在headers中配置token) 如遇其他接口401错误时白名单接口仍然正常请求
  alias: () => ({ code: 'status', data: 'result', msg: 'message' }), // 配置响应数据字段的别名
  token: () => ({ key: 'X-Access-Token', get: () => LocalStorage.getItem('token') ?? '' }), // token配置项
  beforeRequest: (config: ObrAxiosRequestConfig) => {
    console.log('ObrAxiosRequestConfig', config)
    return config
  },
  afterRequest: (response: ObrAxiosResponse<ResDataType>, options: RequestBaseConfig) => {
    console.log('ObrAxiosResponse<ResDataType>', response)
    return response
  },
  401: (error: ResDataType) => {
    console.log('处理401错误', error)
  },
  cancel: (error: any) => {
    console.log('处理请求取消捕捉的错误', error)
  },
  error: (error: any) => {
    console.log('处理其他请求错误(服务端错误/客户端错误)捕捉的错误', error)
  }
})
```

## GET请求
```typescript
interface UserInfo {
  name: string
  id: string
}

function getUserInfoById(id: string) {
  // 拼接到URL的参数处理后会放到params中
  // return http.get(`/UserService/get?${id}`)
  return http.get<UserInfo>('/UserService/get', { id })
}

const user = await getUserInfoById('01') // { name: 'user01', id: '01' }
```

## POST请求(JSON)
```typescript
interface UserInfo {
  name: string
  id: string
}

function updateUserById(user: UserInfo) {
  return http.post<string>('/UserService/edit', user)
}

const result = await updateUserById({ name: 'user01_', id: '01' }) // "操作成功"
```

## POST请求(FormData)
```typescript
interface FileInfo {
  file: Blob
  name: string
}

function uploadFile(file: FileInfo) {
  // 使用postForm方法时，传入的json数据将会被转换为FormData格式
  // 且headers中的Content-Type将被设置为multipart/form-data
  return http.postForm<string>('/CommonService/upload', file)
}

const result = await uploadFile({ file: {}, name: 'display' }) // "http://xxx/display.pdf"
```

## 分页请求
```typescript
import type { PageQueryType } from '@obr-fe/utils'

interface UserInfo {
  name: string
  id: string
}

function getUserPageList(searchParams: { name: string }, pageParams?: PageQueryType) {
  // 分页请求的实际请求参数和分页参数需要分开传
  // 分页请求默认为GET请求，其他请求需要特殊配置
  // 需要注意的是post请求时所有参数会同时放到params和data中 即RequestParams和RequestBody都会接收到
  // alias别名配置参考PageAlias类型
  return http.getPageRecords<UserInfo>('/UserService/list', searchParams, pageParams, 'POST', { records: 'result', total: 'resultTotal' })
}

const result = await getUserPageList({ name: 'us' }) // { records: [{ name: 'user01_', id: '01' }, { name: 'user02', id: '02' }], total: 2 }
```

## 字典请求
```typescript
interface UserInfo {
  name: string
  id: string
}

function getUserOptions(params: { type: string }) {
  // 字典请求默认为GET请求，其他请求需要特殊配置
  // alias别名配置参考OptionAlias类型
  // 最后一个参数为是否根据value值去重(默认去重)
  return http.getOptions<UserInfo>('/UserService/dict', params, 'GET', { label: 'name', value: 'id' }, true)
}

// 当返回值为对象数组，且未配置json字段的别名时，json字段的值为整个对象
const result = await getUserOptions({ type: 'all' }) // [{ label: 'user01_', value: '01', json: { name: 'user01_', id: '01' } }, { label: 'user02', value: '02', json: { name: 'user02', id: '02' } }]
// 当响应数据为基本类型数组时，label与value的值一致
// 如 [1, 2, 3] => [{ label: 1, value: 1, json: {} }, { label: 2, value: 2, json: {} }, { label: 3, value: 3, json: {} }]
// 当响应数据为对象时，对象的键为value 值作为label
// 如 { name: '名称', age: '年龄' } => [{ label: '名称', value: 'name', json: { label: '名称', value: 'name' } }, { label: '年龄', value: 'age', json: { label: '年龄', value: 'age' } } }]
```

## 默认请求(request)
```typescript
interface UserInfo {
  name: string
  id: string
}

function getUserInfoById(id: string) {
  return http.request<UserInfo>({
    url: '/UserService/get',
    params: { id }
  })
}

// 使用默认请求时，将返回ResDataType<T>的数据
const user = await getUserInfoById('01') // { code: 200, msg: '查询成功', data: { name: 'user01_', id: '01' } }
```
