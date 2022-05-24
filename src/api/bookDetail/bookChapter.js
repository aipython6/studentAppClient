import request from '@/utils/request'

export function allBookChapter() {
  return request({
    url: '/bookList/all',
    method: 'GET'
  })
}

export function all(params) {
  return request({
    url: '/bookChapter/all',
    method: 'GET',
    params: params
  })
}

export function add(data) {
  return request({
    url: '/bookChapter/add',
    method: 'POST',
    data
  })
}

export function edit(data) {
  return request({
    url: '/bookChapter/edit',
    method: 'PUT',
    data
  })
}

export function del(bcid) {
  return request({
    url: '/bookChapter/del',
    method: 'DELETE',
    params: { bcid: bcid }
  })
}

export function blurry(data) {
  return request({
    url: '/bookChapter/blurry',
    method: 'POST',
    data
  })
}