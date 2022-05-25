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

// 根据bid获取对应的name
export function getNameBybid(bid) {
  return request({
    url: '/bookChapter/getNameBybid',
    method: 'GET',
    params: { bid: bid }
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

export function del(bid) {
  return request({
    url: '/bookChapter/del',
    method: 'DELETE',
    params: { bid: bid }
  })
}

export function blurry(data) {
  return request({
    url: '/bookChapter/blurry',
    method: 'POST',
    data
  })
}