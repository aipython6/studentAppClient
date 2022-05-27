import request from '@/utils/request'

export function getProvinces() {
  return request({
    url: '/settings/wechat/link/getProvinces',
    method: 'GET',
  })
}

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

export function del(lid, url) {
  return request({
    url: '/settings/wechat/link/del',
    method: 'DELETE',
    params: { lid: lid, url: url }
  })
}