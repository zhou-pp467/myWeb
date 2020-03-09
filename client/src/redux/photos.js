import axios from '../utils/axios'
import { store } from '../index'

const initialState = {
  photos: {}
}

export const types = {
  GETPHOTOS: 'PHOTOS/GETPHOTOS',
  GETPHOTOSBYDATE: 'PHOTOS/GETPHOTOSBYDATE',
  DELETEPHOTO: 'PHOTOS/DELETE'
}

export const actions = {
  getAllPhotos: () => {
    return dispatch => {
      let photos
      axios
        .get('http://118.89.63.17:80/api/getPhotos')
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
        .post('http://118.89.63.17:80/api/getPhotosByDate', { dates })
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
  },
  deletePhoto: pictureId => {
    return dispatch => {
      axios
        .post('http://118.89.63.17:80/api/deletePhoto', {
          picture_Id: pictureId
        })
        .then(res => {
          console.log(res)
          let deletedPhoto = pictureId
          dispatch({ type: types.DELETEPHOTO, deletedPhoto })
        })
        .catch(err => {
          console.log(err, 'deletePhotoerr')
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
    case types.DELETEPHOTO:
      return {
        photos: {
          data: state.photos.data.filter((item, index, arr) => {
            return item['picture_Id'] !== action.deletedPhoto
          })
        }
      }
    default:
      return state
  }
}

export default reducer

export const getPhotos = state => {
  return state.photos
}

export const getNextPicture = currentId => {
  let currentIndex
  let state = store.getState()
  state.photos.photos.data.forEach((item, index, arr) => {
    if (item['picture_Id'] === currentId) {
      currentIndex = index
      console.log(currentIndex, 'currentIndex')
    }
  })
  const nextPicture =
    currentIndex === state.photos.photos.data.length - 1
      ? null
      : state.photos.photos.data[currentIndex + 1]
  return nextPicture
}

export const getLastPicture = currentId => {
  let currentIndex
  let state = store.getState()
  state.photos.photos.data.forEach((item, index, arr) => {
    if (item['picture_Id'] === currentId) {
      currentIndex = index
    }
  })
  const lastPicture =
    currentIndex === 0 ? null : state.photos.photos.data[currentIndex - 1]
  return lastPicture
}
