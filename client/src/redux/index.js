import auth from './auth'
// import ui from './ui'
import photos from './photos'
// import comments from './comments'
// import users from './users'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  auth,
  //   ui,
  photos
  //   comments,
  //   users
})

export default rootReducer
