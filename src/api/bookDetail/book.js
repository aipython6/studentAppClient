import request from '@/utils/request'

export function allbookList() {
  return request({
    url: '/book/all',
    method: 'GET'
  })
}

export function all(params) {
  return request({
    url: '/book/all',
    method: 'GET',
    params: params
  })
}

export function add(data) {
  return request({
    url: '/book/add',
    method: 'POST',
    data
  })
}

export function edit(data) {
  return request({
    url: '/book/edit',
    method: 'PUT',
    data
  })
}

export function del(bid, url) {
  return request({
    url: '/book/del',
    method: 'DELETE',
    params: { bid: bid, url: url }
  })
}

export function blurry(data) {
  return request({
    url: '/book/blurry',
    method: 'POST',
    data
  })
}