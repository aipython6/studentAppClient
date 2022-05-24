import request from '@/utils/request'

export function allChapterContentList() {
  return request({
    url: '/bookList/all',
    method: 'GET'
  })
}

export function all(params) {
  return request({
    url: '/chapterContent/all',
    method: 'GET',
    params: params
  })
}

export function add(data) {
  return request({
    url: '/chapterContent/add',
    method: 'POST',
    data
  })
}

export function edit(data) {
  return request({
    url: '/chapterContent/edit',
    method: 'PUT',
    data
  })
}

export function del(cid) {
  return request({
    url: '/chapterContent/del',
    method: 'DELETE',
    params: { cid: cid }
  })
}

export function blurry(data) {
  return request({
    url: '/chapterContent/blurry',
    method: 'POST',
    data
  })
}