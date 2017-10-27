import { combineReducers } from 'redux'
import box from './box'
import history from './history'
import activeBox from './activeBox'
const reducer = combineReducers({
  box,
  history,
  activeBox
})

export default reducer
