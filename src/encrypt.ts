import CryptoJS from 'crypto-js'

const { atob, btoa } = window

const K = btoa('OTc2NWE3ZDFkYjI1MjZkOQ==')
const V = btoa('a2o4ZTYxajhsajM3NTA5NA==')

/**
 * @description AES密码加密
 * @param {string} pwd 密码
 * @param {string} key Key
 * @param {string} iv  IV
 * @returns {string} 加密后的密码
 */
export function encrypt(pwd: string, key: string, iv: string): string {
  const PWD = CryptoJS.enc.Utf8.parse(pwd)
  const KEY = CryptoJS.enc.Utf8.parse(key)
  const IV = CryptoJS.enc.Utf8.parse(iv)

  const encrypted = CryptoJS.AES.encrypt(PWD, KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding,
  })

  const jm_pwd = CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
  return jm_pwd
}

/**
 * @description 生成加密密码
 * @param {string} password 密码
 * @return {string} 加密后的密码
 */
export const createPwd = (password: string): string => encrypt(password, atob(atob(K)), atob(atob(V)))

const useKey = btoa('jK2oBORH4mcIPhKymU0e7E==')

/**
 * @description 加密
 * @param {string} v 明文
 * @return
 */
export const encryptText = (v: string) => CryptoJS.AES.encrypt(v, useKey).toString()

/**
 * @description 解密
 * @param {string} k 密文
 * @return
 */
export const decryptText = (k: string) => CryptoJS.AES.decrypt(k, useKey).toString(CryptoJS.enc.Utf8)
