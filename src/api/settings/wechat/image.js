import request from '@/utils/request'

export function all(params) {
  return request({
    url: '/settings/wechat/image/all',
    method: 'GET',
    params: params
  })
}

export function add(data) {
  return request({
    url: '/settings/wechat/image/add',
    method: 'POST',
    data
  })
}

export function edit(data) {
  return request({
    url: '/settings/wechat/image/edit',
    method: 'PUT',
    data
  })
}

export function del(wid, url) {
  return request({
    url: '/settings/wechat/image/del',
    method: 'DELETE',
    params: { wid: wid, url: url }
  })
}