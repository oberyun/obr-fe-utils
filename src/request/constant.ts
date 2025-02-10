import type { OptionResAlias, PageAlias, RequestBaseConfig, ResAlias } from '../types'

export const RES_ALIAS: ResAlias = {
  data: 'data',
  code: 'code',
  msg: 'msg',
}

export const OPTION_RES_ALIAS: OptionResAlias = {
  label: 'label',
  value: 'value',
  json: 'json',
}

export const RECORD_RES_ALIAS: PageAlias = {
  pageSize: 'pageSize',
  pageNo: 'pageNo',
  total: 'total',
  records: 'records',
}

export const DEFAULT_CONFIG: RequestBaseConfig = {
  baseURL: '',
  timeout: 60 * 1000,
  basePath: '',
  allowCancel: false,
  allowNullValue: true,
  successCode: [200],
  unauthorizedCode: [401],
  whiteUrl: () => [],
  alias: () => (RES_ALIAS),
  token: {
    key: 'x-access-token',
    get: () => '',
  },
}
