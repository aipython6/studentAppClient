import request from '@/utils/request'

export function allbookType() {
  return request({
    url: '/bookType/all',
    method: 'GET'
  })
}

export function all(params) {
  return request({
    url: '/bookType/all',
    method: 'GET',
    params: params
  })
}

export function add(data) {
  return request({
    url: '/bookType/add',
    method: 'POST',
    data
  })
}

export function edit(data) {
  return request({
    url: '/bookType/edit',
    method: 'PUT',
    data
  })
}

export function del(btid) {
  return request({
    url: '/bookType/del',
    method: 'DELETE',
    params: { btid: btid }
  })
}

export function blurry(data) {
  return request({
    url: '/bookType/blurry',
    method: 'POST',
    data
  })
}