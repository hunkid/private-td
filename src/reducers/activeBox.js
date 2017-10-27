import * as types from '../constants/ActionTypes'

export default (state = {id: 1}, action) => {
  switch (action.type) {
    case types.CHANGE_ACTIVE:
      let newState = {id: action.id}
      return newState
    default:
      return state
  }
}
