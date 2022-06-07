import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, getUsername, setUsername, removeUsername } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    username: getUsername(),
    user: {},
    hasInfo: '',
    weather: {}
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_INFO: (state, info) => {
    state.hasInfo = info
  },
  SET_WEATHER: (state, weather) => {
    state.weather = weather
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    // console.log(userInfo)
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { token, username } = response
        setUsername(username)
        commit('SET_USERNAME', username)
        commit('SET_TOKEN', token)
        setToken(token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.username).then(response => {
        const { content, weather } = response
        if (!content) {
          return reject('验证失败,请重新登录')
        }
        commit('SET_USER', content)
        commit('SET_WEATHER', weather)
        commit('SET_INFO')
        resolve(content)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

