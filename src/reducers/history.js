import * as types from '../constants/ActionTypes'
import { formDate, formTime, isCoordInvalid } from '../util'

/**
 * @param {Object} action
 *            - id: Number，box ID号
 *            - total: Number, data数组长度
 *            - data: Array<Object>
 *                 - id: 递进顺序号
 *                 - longitude
 *                 - latitude
 *                 - temperature
 *                 - createAt
 * 
 *  ||
 *  ||
 *  ||
 * \  /
 *  \/
 * 
 * @param {Object} state
 *            - id: Object, box ID号
 *                - total: Number, 目前state的total值
 *                - [Date]: Array<Object>
 *                    - longitude
 *                    - latitude
 *                    - temperature
 * 
 */
export default (state = {}, action) => {
  switch (action.type) {
    case types.ADD_HISTROTY:
      let newState = {...state}
      newState[action.id] = newState[action.id] || {}
      newState[action.id].total = newState[action.id].total || 0
      if (newState[action.id].total === action.total) {
        return newState
      } else {
        let index = newState[action.id].total // todo
        for(; index < action.total; index++) {
          let m = action.data[index]
          if (isCoordInvalid({latitude: m.latitude, longitude: m.longitude})) {
            continue // 如果坐标无效，不记录
          }
          let date = formDate(m.createAt)
          let time = formTime(m.createAt)
          newState[action.id][date] = newState[action.id][date] || []
          newState[action.id][date].push({
            step: m.id,
            longitude: m.longitude,
            latitude: m.latitude,
            temperature: m.temperature,
            time: time,
            command: m.command,
            deliverCargos:m.deliverCargos
          })
        }
      }
      newState[action.id].total = action.total
      return newState
    default:
      return state
  }
}
