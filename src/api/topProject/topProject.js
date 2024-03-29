import request from '@/utils/request'

export function alltopProject() {
  return request({
    url: '/topProject/all',
    method: 'GET'
  })
}

export function all(params) {
  return request({
    url: '/topProject/all',
    method: 'GET',
    params: params
  })
}

export function add(data) {
  return request({
    url: '/topProject/add',
    method: 'POST',
    data
  })
}

export function edit(data) {
  return request({
    url: '/topProject/edit',
    method: 'PUT',
    data
  })
}

export function del(tid) {
  return request({
    url: '/topProject/del',
    method: 'DELETE',
    params: { tid: tid }
  })
}

export function blurry(data) {
  return request({
    url: '/topProject/blurry',
    method: 'POST',
    data
  })
}