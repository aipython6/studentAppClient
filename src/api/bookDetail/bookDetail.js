import request from '@/utils/request'

export function allbookDetail() {
  return request({
    url: '/bookDetail/all',
    method: 'GET'
  })
}

export function all(params) {
  return request({
    url: '/bookDetail/all',
    method: 'GET',
    params: params
  })
}

export function add(data) {
  return request({
    url: '/bookDetail/add',
    method: 'POST',
    data
  })
}

export function edit(data) {
  return request({
    url: '/bookDetail/edit',
    method: 'PUT',
    data
  })
}

export function del(bdid) {
  return request({
    url: '/bookDetail/del',
    method: 'DELETE',
    params: { btid: bdid }
  })
}

export function blurry(data) {
  return request({
    url: '/bookDetail/blurry',
    method: 'POST',
    data
  })
}