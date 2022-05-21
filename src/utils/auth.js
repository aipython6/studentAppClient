import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const username_ = 'username'

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
