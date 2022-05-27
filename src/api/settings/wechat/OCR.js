import request from '@/utils/request'

export function all(params) {
  return request({
    url: '/settings/wechat/OCR/all',
    method: 'GET',
    params: params
  })
}

export function add(data) {
  return request({
    url: '/settings/wechat/OCR/add',
    method: 'POST',
    data
  })
}

export function edit(data) {
  return request({
    url: '/settings/wechat/OCR/edit',
    method: 'PUT',
    data
  })
}

export function all(wid) {
  return request({
    url: '/settings/wechat/OCR/del',
    method: 'DELETE',
    params: { wid: wid }
  })
}