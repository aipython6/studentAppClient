import request from '@/utils/request'

export function all(params) {
  return request({
    url: '/settings/wechat/notice/all',
    method: 'GET',
    params: params
  })
}

export function add(data) {
  return request({
    url: '/settings/wechat/notice/add',
    method: 'POST',
    data
  })
}

export function edit(data) {
  return request({
    url: '/settings/wechat/notice/edit',
    method: 'PUT',
    data
  })
}

export function del(nid) {
  return request({
    url: '/settings/wechat/notice/del',
    method: 'DELETE',
    params: { nid: nid }
  })
}