import moment from 'moment'

export function handleDate(date) {
  return moment(date).locale('zh-cn').format('YYYY-MM-DD HH:mm:ss')
}

export function getYMD(date) {
  return moment(date).locale('zh-cn').format('YYYY-MM-DD')
}