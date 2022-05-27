import request from '@/utils/request'

export function all(params) {
  return request({
    url: '/settings/wechat/link/all',
    method: 'GET',
    params: params
  })
}

export function add(data) {
  return request({
    url: '/settings/wechat/link/add',
    method: 'POST',
    data
  })
}

export function edit(data) {
  return request({
    url: '/settings/wechat/link/edit',
    method: 'PUT',
    data
  })
}

export function all(wid) {
  return request({
    url: '/settings/wechat/link/del',
    method: 'DELETE',
    params: { wid: wid }
  })
}