import request from '@/utils/request'

// 获取
export function all(params) {
  return request({
    url: '/user/all',
    method: 'GET',
    params: params
  })
}

// 添加
export function add(data) {
  return request({
    url: '/user/add',
    method: 'POST',
    data
  })
}

export function edit(data) {
  return request({
    url: '/user/edit',
    method: 'PUT',
    data
  })
}

export function del(uid) {
  return request({
    url: '/user/del',
    method: 'DELETE',
    params: { uid: uid }
  })
}

export function blurry(data) {
  return request({
    url: '/user/blurry',
    method: 'POST',
    data
  })
}