import request from '@/utils/request'

export function getWeather() {
  return request({
    url: '/pc/tool/getWeather',
    method: 'get',
  })
}
