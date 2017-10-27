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
