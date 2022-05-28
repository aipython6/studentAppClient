import request from '@/utils/request'

export function all(params) {
  return request({
    url: '/settings/wechat/student/all',
    method: 'GET',
    params: params
  })
}