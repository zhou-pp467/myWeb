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
          let users = res.data
          dispatch({ type: types.GETUSERS, users })
        })
        .catch(err => {
          alert(err)
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
          let addedUser = response.data
          dispatch({ type: types.ADDUSER, addedUser })
        })
        .catch(function(error) {
          alert(error)
        })
    }
  },
  deleteUser: username => {
    return dispatch => {
      console.log(username)
      axios
        .get('http://127.0.0.1/api/deleteUser', {
          params: { username: username }
        })
        .then(res => {
          let deletedUser = res.data
          console.log(deletedUser)
          dispatch({ type: types.DELETEUSER, deletedUser })
        })
        .catch(err => {
          alert(err)
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
          let changedUser = res.data
          dispatch({ type: types.CHANGEINFO, changedUser })
        })
        .catch(function(err) {
          alert(err)
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
      console.log(state.userList)
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
