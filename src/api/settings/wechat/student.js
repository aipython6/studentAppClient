import request from '@/utils/request'

export function all(params) {
  return request({
    url: '/settings/wechat/student/all',
    method: 'GET',
    params: params
  })
}

export function add(data) {
  return request({
    url: '/settings/wechat/student/add',
    method: 'POST',
    data
  })
}

export function edit(data) {
  return request({
    url: '/settings/wechat/student/edit',
    method: 'PUT',
    data
  })
}

export function all(wid) {
  return request({
    url: '/settings/wechat/student/del',
    method: 'DELETE',
    params: { wid: wid }
  })
}