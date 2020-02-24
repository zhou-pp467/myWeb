import axios from 'axios'
axios.defaults.withCredentials = true

export const types = {
  LOGIN: 'AUTH/LOGIN',
  LOGOUT: 'AUTH/LOGOUT'
}

const initialState = {
  userId: null,
  username: null,
  user_function: 9
}

export const actions = {
  login: obj => {
    return dispatch => {
      let resuser_function, resusername
      axios
        .post('http://118.89.63.17/api/login', {
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
        })
    }
  },
  logout: () => {
    axios
      .get('http://118.89.63.17/api/logout')
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
        user_function: action['user_function']
      }
    case types.LOGOUT:
      return {
        ...state,
        username: null,
        userId: null,
        user_function: 9
      }
    default:
      return state
  }
}

export default reducer

export const getUsername = state => {
  switch (state.username) {
    case 'daidai':
      return '呆呆'
    case 'guaiguai':
      return '乖乖'
    default:
      return state.username
  }
}
