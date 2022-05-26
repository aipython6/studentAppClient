import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const username_ = 'username'
const bid_ = 'bid_'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUsername() {
  return Cookies.get(username_)
}

export function setUsername(username) {
  return Cookies.set(username_, username)
}

export function removeUsername() {
  return Cookies.remove(username_)
}

// 用于二级章节具体内容的页面
export function setBid(bid) {
  return Cookies.set(bid_, bid)
}

export function getBid() {
  return Cookies.get(bid_)
}

export function removeBid() {
  return Cookies.remove(bid_)
}