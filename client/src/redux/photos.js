import axios from '../utils/axios'

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
        .get('http://118.89.63.17/api/getPhotos')
        .then(res => {
          console.log(res)
          photos = res
          dispatch({ type: types.GETPHOTOS, photos: photos })
        })
        .catch(err => {
          console.log(err, 'getphotos')
        })
    }
  },
  getPhotosByDates: dates => {
    return dispatch => {
      let photos
      axios
        .post('http://118.89.63.17/api/getPhotosByDate', { dates })
        .then(res => {
          photos = res
          dispatch({
            type: types.GETPHOTOSBYDATE,
            photos: photos
          })
        })
        .catch(err => {
          console.log(err, 'getphotosbydate')
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
