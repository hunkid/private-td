import * as types from '../constants/ActionTypes'
// action creators
export const changeActiveBox = (id) => {
  return {
    type: types.CHANGE_ACTIVE,
    id
  }
}

export const addBox = (id) => {
  return {
    type: types.ADD_BOX,
    id
  }
}

export const removeBox = (id) => {
  return {
    type: types.REMOVE_BOX,
    id
  }
}
