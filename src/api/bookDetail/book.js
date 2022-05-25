import request from '@/utils/request'

export function allbookList() {
  return request({
    url: '/book/all',
    method: 'GET'
  })
}

export function all() {
  return request({
    url: '/book/all',
    method: 'GET',
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

export function del(bid) {
  return request({
    url: '/book/del',
    method: 'DELETE',
    params: { bid: bid }
  })
}

export function blurry(data) {
  return request({
    url: '/book/blurry',
    method: 'POST',
    data
  })
}