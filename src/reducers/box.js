import * as types from '../constants/ActionTypes'

export default (state = [], action) => {
  switch (action.type) {
    case types.ADD_BOX:
      let newState = [...state]
      newState.push({
        id: action.id,
        name: action.name,
        description: action.description,
        isActive: action.isActive,
        token: action.token
      })
      return newState
    case types.CHANGE_ACTIVE:
      newState = [...state]
      let id = action.id
      for (let i = 0; i < newState.length; i++) {
        newState[i]['isActive'] = false
        if(id === newState[i]['id']) {
          newState[i]['isActive'] = true
        }
      }
      return newState
    default:
      return state
  }
}
