import request from '@/utils/request'

export function allChapterChildrenList() {
  return request({
    url: '/bookList/all',
    method: 'GET'
  })
}

export function all(params) {
  return request({
    url: '/chapterChildren/all',
    method: 'GET',
    params: params
  })
}

export function add(data) {
  return request({
    url: '/chapterChildren/add',
    method: 'POST',
    data
  })
}

export function edit(data) {
  return request({
    url: '/chapterChildren/edit',
    method: 'PUT',
    data
  })
}

export function del(ccid) {
  return request({
    url: '/chapterChildren/del',
    method: 'DELETE',
    params: { ccid: ccid }
  })
}

export function blurry(data) {
  return request({
    url: '/chapterChildren/blurry',
    method: 'POST',
    data
  })
}