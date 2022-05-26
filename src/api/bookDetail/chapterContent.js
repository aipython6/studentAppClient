import request from '@/utils/request'

export function allBybid(bid) {
  return request({
    url: '/chapterContent/allBybid',
    method: 'GET',
    params: { bid: bid }
  })
}
// 获取所有的2级标题下的所有课本内容(为图片格式)
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

export function del(ccid) {
  return request({
    url: '/chapterContent/del',
    method: 'DELETE',
    params: { ccid: ccid }
  })
}
