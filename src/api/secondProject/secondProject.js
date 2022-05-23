import request from '@/utils/request'

export function allSecondProject() {
  return request({
    url: '/secondProject/all',
    method: 'GET',
  })
}

export function all(params) {
  return request({
    url: '/secondProject/all',
    method: 'GET',
    params: params
  })
}

export function add(data) {
  return request({
    url: '/secondProject/add',
    method: 'POST',
    data
  })
}

export function edit(data) {
  return request({
    url: '/secondProject/edit',
    method: 'PUT',
    data
  })
}

export function del(sid) {
  return request({
    url: '/secondProject/del',
    method: 'DELETE',
    params: { sid: sid }
  })
}

export function blurry(data) {
  return request({
    url: '/secondProject/blurry',
    method: 'POST',
    data
  })
}