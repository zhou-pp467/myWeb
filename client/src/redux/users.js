import axios from 'axios'
axios.defaults.withCredentials = true

const initialState = { userList: [] }

export const types = {
  GETUSERS: 'USERS/GETUSERS',
  ADDUSER: 'USERS/ADDUSER',
  DELETEUSER: 'USERS/DELETEUSER',
  CHANGEINFO: 'USERS/CHANGEINFO'
}

export const actions = {
  getUsers: () => {
    return dispatch => {
      axios
        .get('http://127.0.0.1/api/users')
        .then(res => {
          let users = res
          dispatch({ type: types.GETUSERS, users })
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  addUser: (newUsername, newPassword, newFunction) => {
    return dispatch => {
      axios
        .post('http://127.0.0.1/api/createUser', {
          username: newUsername,
          password: newPassword,
          user_function: newFunction
        })
        .then(function(response) {
          let addedUser = response
          dispatch({ type: types.ADDUSER, addedUser })
        })
        .catch(function(error) {
          console.log(error)
        })
    }
  },
  deleteUser: username => {
    return dispatch => {
      axios
        .get('http://127.0.0.1/api/deleteUser', { username: username })
        .then(res => {
          let deletedUser = res
          dispatch({ type: types.DELETEUSER, deletedUser })
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  changeInfo: (username, newPassword, newFunction) => {
    return dispatch => {
      axios
        .post('http://127.0.0.1/api/changeInfo', {
          username: username,
          password: newPassword,
          user_function: newFunction
        })
        .then(function(res) {
          let changedUser = res
          dispatch({ type: types.CHANGEINFO, changedUser })
        })
        .catch(function(err) {
          console.log(err)
        })
    }
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GETUSERS:
      return { ...state, userList: action.users }
    case types.ADDUSER:
      return { userList: [...state.userList, action.addedUser] }
    case types.DELETEUSER:
      return {
        userList: state.userList.filter(
          (item, index, arr) => item['user_name'] !== action.deletedUser
        )
      }
    case types.CHANGEINFO:
      return {
        userList: [
          ...state.userList.filter((item, index, arr) => {
            return item['user_name'] !== action.changedUser.user_name
          }),
          action.changedUser
        ]
      }
    default:
      return state
  }
}

export default reducer

export const getUserList = state => {
  return state.userList
}
