import axios from 'axios'
axios.defaults.withCredentials = true

const initialState = {
  photos: {}
}

export const types = {
  GETPHOTOS: 'PHOTOS/GETPHOTOS',
  GETPHOTOSBYDATE: 'PHOTOS/GETPHOTOSBYDATE'
}

export const actions = {
  getPhotos: () => {
    return dispatch => {
      let photos
      axios
        .get('http://127.0.0.1/api/getPhotos')
        .then(res => {
          photos = res
          dispatch({ type: types.GETPHOTOS, photos: photos })
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  getPhotosByDates: dates => {
    return dispatch => {
      let photos
      axios
        .post('http://127.0.0.1/api/getPhotosByDate', { dates })
        .then(res => {
          photos = res
          dispatch({
            type: types.GETPHOTOSBYDATE,
            photos: photos
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GETPHOTOS:
      return {
        ...state,
        photos: action.photos
      }
    case types.GETPHOTOSBYDATE:
      return {
        ...state,
        photos: action.photos
      }
    default:
      return state
  }
}

export default reducer

export const getPhotos = state => {
  return state.photos
}
