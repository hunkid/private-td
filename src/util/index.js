/**
 * 格式化毫秒数，返回日期，格式为YYYY-MM-DD
 * @param {String} num
 * @return {String}
 */
export function formDate(num) {
  let date = new Date(num)
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  let res = year + '-' + month + '-' + day
  return res
}

/**
 * 
 * @param {String} num
 * @return {String}
 */
export function formTime(num) {
  let date = new Date(num)
  let hour = date.getHours() //获取当前小时数(0-23)
  let minu = date.getMinutes() //获取当前分钟数(0-59)
  if (minu < 10) {
    minu = '0' + minu
  }
  if (hour < 10) {
    hour = '0' + hour
  }
  let sec = date.getSeconds() //获取当前秒数(0-59)
  return `${hour}:${minu}:${sec}`
}

/**
 * 坐标如果是0,0，暂定为无效
 * @param {Object} coordinate
 */
export function isCoordInvalid(coordinate) {
  if ((+coordinate.latitude - 0) < Number.EPSILON &&
    (+coordinate.longitude - 0) < Number.EPSILON) {
    return true
  }
}

/**
 * 根据location样式返回
 * @param {object} location
 * @return {Bool} true:画线，false:不画 
 */
export function judgeUrlForDraw(location) {
  let params = location.search.substr(1).split('&')
  let last = params.length > 0 ? params[params.length - 1] : ''
  if (params.length && last.indexOf('line') !== -1) {
    if(last.split('line=')[1] === 'false') {
      return false
    }
  }
  return true
}

