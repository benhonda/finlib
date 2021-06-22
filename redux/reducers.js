import { combineReducers } from 'redux'
import accountReducer from './accounts'
import resourcesReducer from './resources'


export default combineReducers({
  account: accountReducer,
  resources: resourcesReducer,
})