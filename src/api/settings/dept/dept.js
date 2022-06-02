import request from '@/utils/request'

// 获取
export function getDeptList(params) {
  return request({
    url: '/dept/all',
    method: 'GET',
    params: params
  })
}

// 添加
export function add(data) {
  return request({
    url: '/dept/add',
    method: 'POST',
    data
  })
}

export function edit(data) {
  return request({
    url: '/dept/edit',
    method: 'PUT',
    data
  })
}

export function del(deptid) {
  return request({
    url: '/dept/del',
    method: 'DELETE',
    params: { deptid: deptid }
  })
}

export function blurry(data) {
  return request({
    url: '/dept/blurry',
    method: 'POST',
    data
  })
}