import axios from '../utils/axios'
import { types as photoTypes, getNextPicture, getLastPicture } from './photos'

const initialState = {
  currentPicture: {},
  currentComments: [],
  issssLoading: false
}

const types = {
  COMMENTDELETE: 'COMMENT/DELETE',
  COMMENTSGET: 'COMMENTS/GET',
  PHOTOGET: 'PHOTO/GET',
  NEXTPHOTO: 'PHOTO/NEXT',
  LASTPHOTO: 'PHOTO/LAST'
}

export const actions = {
  deletePhoto(picture_Id) {
    return dispatch => {
      axios
        .post('http://118.89.63.17:80/api/deletePhoto', { picture_Id })
        .then(res => {})
        .catch(err => {
          console.log(err, 'deletePhotoerr')
        })
    }
  },
  getPhotoDetail(photoId) {
    return dispatch => {
      axios
        .get('http://118.89.63.17:80/api/photoDetail', {
          params: {
            pictureId: photoId
          }
        })
        .then(res => {
          let pictureInfo = res.data[0]
          console.log(res)
          console.log(pictureInfo)
          dispatch({ type: types.PHOTOGET, pictureInfo })
        })
      axios
        .get('http://118.89.63.17:80/api/comments', {
          params: { picture_Id: photoId }
        })
        .then(res => {
          let comments = res.data
          dispatch({ type: types.COMMENTSGET, comments })
        })
        .catch(err => {
          console.log(err, 'getcommentserr')
        })
    }
  },
  getComments(pictureId) {
    return dispatch => {
      axios
        .get('http://118.89.63.17:80/api/comments', {
          params: { picture_Id: pictureId }
        })
        .then(res => {
          let comments = res.data
          dispatch({ type: types.COMMENTSGET, comments })
        })
        .catch(err => {
          console.log(err, 'getcommentserr')
        })
    }
  },
  deleteComment(commentId, pictureId) {
    return dispatch => {
      axios
        .post('http://118.89.63.17:80/api/deleteComment', {
          comment_Id: commentId
        })
        .then(res => {
          console.log(res)
          let deletedCommentId
          dispatch({ type: types.COMMENTDELETE, deletedCommentId })
          if (res.status == 200) {
            axios
              .get('http://118.89.63.17:80/api/comments', {
                params: { picture_Id: pictureId }
              })
              .then(res => {
                let comments = res.data
                dispatch({ type: types.COMMENTSGET, comments })
              })
              .catch(err => {
                console.log(err, 'getcommentserr')
              })
          }
        })
        .catch(err => {
          console.log(err, 'deleteCommenterr')
        })
    }
  },
  createComment({ user_name, comment_content, comment_date, picture_Id }) {
    // let _this = this
    return dispatch => {
      axios
        .post('http://118.89.63.17:80/api/createComment', {
          user_name,
          comment_content,
          comment_date,
          picture_Id
        })
        .then(res => {
          console.log(res)
          if (res.status == 200) {
            axios
              .get('http://118.89.63.17:80/api/comments', {
                params: { picture_Id }
              })
              .then(res => {
                let comments = res.data
                dispatch({ type: types.COMMENTSGET, comments })
              })
              .catch(err => {
                console.log(err, 'getcommentserr')
              })
          }
        })
        .catch(err => {
          console.log(err, 'createcommenterr')
        })
    }
  },
  editPhotoDetail(picture_Id, picture_description) {
    return dispatch => {
      axios
        .post('http://118.89.63.17:80/api/editPhotoDetail', {
          picture_Id,
          picture_description
        })
        .then(res => {
          //   getPhotoDetail(picture_Id)
        })
        .catch(err => {
          console.log(err, 'editphotodetailerr')
        })
    }
  },
  nextPhoto(currentPictureId) {
    return dispatch => {
      let next = getNextPicture(currentPictureId)
      dispatch({ type: types.NEXTPHOTO, next })
    }
  },
  lastPhoto(currentPictureId) {
    return dispatch => {
      let last = getLastPicture(currentPictureId)
      dispatch({ type: types.LASTPHOTO, last })
    }
  }
}

const reducer = (state = initialState, action) => {
  console.log(
    state,
    'photeD---state---reducer',
    initialState,
    '===initialState'
  )
  switch (action.type) {
    case types.PHOTOGET:
      return {
        ...state,
        currentPicture: action.pictureInfo
      }
    case types.COMMENTSGET:
      return {
        ...state,
        currentComments: action.comments
      }
    case types.COMMENTDELETE:
      return {
        ...state,
        currentComments: state.currentComments.filter((item, index, arr) => {
          return item['comment_Id'] !== action.deletedCommentId
        })
      }
    case types.NEXTPHOTO:
      return {
        ...state,
        currentPicture: action.next
      }
    case types.LASTPHOTO:
      return {
        ...state,
        currentPicture: action.last
      }
    default:
      return state
  }
}

export default reducer

export const getCurrentComments = state => {
  return state.currentComments || []
}
export const getCurrentPicture = state => {
  return state.currentPicture || {}
}
