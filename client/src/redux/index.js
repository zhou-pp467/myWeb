import auth from './auth'
import photos from './photos'
import photoDetail from './photoDetail'
import users from './users'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  auth,
  photos,
  photoDetail,
  users
})

export default rootReducer
