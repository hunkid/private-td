import * as types from '../constants/ActionTypes'
// action creators
export const changeActiveBox = (id) => {
  return {
    type: types.CHANGE_ACTIVE,
    id
  }
}

export const addBox = (id, name, description, isActive) => {
  return {
    type: types.ADD_BOX,
    id,
    name,
    description,
    isActive
  }
}

export const removeBox = (id) => {
  return {
    type: types.REMOVE_BOX,
    id
  }
}
