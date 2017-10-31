import * as types from '../constants/ActionTypes'
// action creators
export const changeActiveBox = (id) => {
  return {
    type: types.CHANGE_ACTIVE,
    id
  }
}

export const addBox = (id, name, description, isActive, token) => {
  return {
    type: types.ADD_BOX,
    id,
    name,
    description,
    isActive,
    token
  }
}

export const removeBox = (id) => {
  return {
    type: types.REMOVE_BOX,
    id
  }
}

// 这里需要注意到底需不需要total，如果不需要total，应该在dispatch之前来判断是否要叠加
export const addHistory = (id, data, total, command, deliverCargos) => {
  return {
    type: types.ADD_HISTROTY,
    id,
    data,
    total,
    command,
    deliverCargos
  }
}
