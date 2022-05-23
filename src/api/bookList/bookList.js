import request from '@/utils/request'

export function allbookList() {
  return request({
    url: '/bookList/all',
    method: 'GET'
  })
}

export function all(params) {
  return request({
    url: '/bookList/all',
    method: 'GET',
    params: params
  })
}

export function add(data) {
  return request({
    url: '/bookList/add',
    method: 'POST',
    data
  })
}

export function edit(data) {
  return request({
    url: '/bookList/edit',
    method: 'PUT',
    data
  })
}

export function del(blid) {
  return request({
    url: '/bookList/del',
    method: 'DELETE',
    params: { btid: blid }
  })
}

export function blurry(data) {
  return request({
    url: '/bookList/blurry',
    method: 'POST',
    data
  })
}