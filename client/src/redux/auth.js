import axios from 'axios'
axios.defaults.withCredentials = true

export const types = {
  LOGIN: 'AUTH/LOGIN',
  LOGOUT: 'AUTH/LOGOUT',
  LOGINFAIL: 'AUTH/LOGINFAIL',
  LOADING: 'AUTH/LOADING'
}

const initialState = {
  userId: null,
  username: null,
  user_function: 9
}

export const actions = {
  login: obj => {
    return dispatch => {
      dispatch({ type: types.LOADING })
      let resuser_function, resusername
      axios
        .post('http://127.0.0.1/api/login', {
          username: obj.username,
          password: obj.password
        })
        .then(function(res) {
          resusername = res.data[0]['user_name']
          resuser_function = res.data[0]['user_function']
          console.log(resusername, resuser_function)
          dispatch({
            type: types.LOGIN,
            username: resusername,
            user_function: resuser_function
          })
        })
        .catch(function(err) {
          console.log(err)
          alert('登陆失败！')
          dispatch({ type: types.LOGINFAIL })
        })
    }
  },
  logout: () => {
    axios
      .get('http://127.0.0.1/api/logout')
      .then(function(response) {
        console.log(response)
      })
      .catch(function(error) {
        console.log(error)
      })
    return {
      type: types.LOGOUT
    }
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN:
      return {
        ...state,
        username: action.username,
        user_function: action['user_function'],
        login_fail: 'notloading'
      }
    case types.LOGOUT:
      return {
        ...state,
        username: null,
        userId: null,
        user_function: 9
      }
    case types.LOGINFAIL:
      return {
        ...state,
        login_fail: 'notloading'
      }
    case types.LOADING:
      return {
        ...state,
        login_fail: 'loading'
      }
    default:
      return state
  }
}

export default reducer

export const getUsername = state => {
  return state.username
}

export const getUserFunction = state => {
  return state.user_function
}
