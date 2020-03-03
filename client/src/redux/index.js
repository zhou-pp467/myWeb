import auth from './auth'
import photos from './photos'
// import comments from './comments'
import users from './users'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  auth,
  photos,
  //   comments,
  users
})

export default rootReducer
