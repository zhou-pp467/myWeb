import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Redirect, withRouter, Link } from 'react-router-dom'
import { getLastPicture, getNextPicture } from '../../redux/photos'
import { errImg } from '../../images/index'
import {
  actions as authActions,
  getUsername,
  getUserFunction
} from '../../redux/auth'
import './PhotoDetail.css'
import {
  LeftOutlined,
  RightOutlined,
  CloseCircleOutlined
} from '@ant-design/icons'
import {
  actions as photoDetailActions,
  getCurrentComments,
  getCurrentPicture
} from '../../redux/photoDetail'
import {
  Comment,
  Avatar,
  Form,
  Button,
  List,
  Input,
  message,
  Tooltip,
  Modal,
  Spin
} from 'antd'
import moment from 'moment'
import { actions as photoActions } from '../../redux/photos'

const { TextArea } = Input

const deleteIconController = {
  onMouseOver: e => {
    e.currentTarget.querySelector('.deleteicon').style.display = 'block'
  },
  onMouseOut: e => {
    e.currentTarget.querySelector('.deleteicon').style.display = 'none'
  }
}
const CommentList = props => {
  console.log(props.userfunction)
  const controller = props.userfunction === 2 ? deleteIconController : ''
  return (
    <List
      dataSource={props.comments}
      header={`${props.comments.length} 条评论`}
      itemLayout="horizontal"
      renderItem={props => <Comment {...props} {...controller} />}
    />
  )
}

const Editor = ({ onChange, onSubmit, submitting, value, username }) => (
  <div className="edit-textarea">
    <span className="editor-name">{username}：</span>
    <Form.Item>
      <TextArea
        rows={1}
        autoSize
        onChange={onChange}
        value={value}
        style={{ resize: 'none' }}
      />
    </Form.Item>
    <Form.Item>
      <Button
        className="add-comment-button"
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        添加评论
      </Button>
    </Form.Item>
  </div>
)

class App extends React.Component {
  state = {
    submitting: false,
    value: ''
  }
  handleDeleteComment = e => {
    console.log(e.currentTarget)
    const comId = e.currentTarget.id
    console.log(comId)
    const picId = this.props.pictureId
    this.props.deleteComment(comId, picId)
  }
  handleSubmit = () => {
    if (!this.state.value) {
      return
    }

    this.setState({
      submitting: true
    })

    setTimeout(() => {
      this.props.createComment({
        user_name: this.props.username,
        comment_content: this.state.value,
        comment_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        picture_Id: this.props.pictureId
      })
      this.props.getPhotoDetail(this.props.pictureId)
      this.props.getComments(this.props.pictureId)
      this.setState({
        ...this.state,
        submitting: false,
        value: ''
      })
    }, 500)
  }

  handleChange = e => {
    this.setState({
      value: e.target.value
    })
  }

  render() {
    const { submitting, value } = this.state
    console.log(this.props)
    let comments = this.props.currentComments.map((item, index, arr) => {
      return {
        author: item['user_name'],
        content: <p>{item['comment_content']}</p>,
        datetime: (
          <Tooltip
            title={moment(item['comment_date']).format('YYYY-MM-DD HH:mm:ss')}
          >
            <span>{moment(item['comment_date']).fromNow()}</span>
          </Tooltip>
        ),
        actions:
          this.props.userfunction === 2
            ? [
                <CloseCircleOutlined
                  onClick={e => {
                    this.handleDeleteComment(e)
                  }}
                  id={item['comment_Id']}
                  className="deleteicon"
                  style={{
                    color: 'red',
                    fontSize: 12,
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    display: 'none'
                  }}
                />
              ]
            : []
      }
    })
    console.log(this.props.issssLoading)
    return (
      <div>
        {this.props.issssLoading ? (
          <div>
            <Spin />
          </div>
        ) : (
          comments.length > 0 && (
            <CommentList
              comments={comments}
              userfunction={this.props.userfunction}
            />
          )
        )}
        {this.props.userfunction === 1 || this.props.userfunction === 2 ? (
          <Comment
            content={
              <Editor
                username={this.props.username}
                onChange={this.handleChange}
                onSubmit={this.handleSubmit}
                submitting={submitting}
                value={value}
              />
            }
          />
        ) : (
          ''
        )}
      </div>
    )
  }
}
class PhotoDetails extends Component {
  state = {
    ratio: 0
  }
  logout = () => {
    this.props.logout()
  }
  componentDidMount() {
    this.props.getPhotoDetail(this.props.match.params.id)
    this.props.getComments(this.props.match.params.id)
    const img = new Image()
    img.src = this.props.currentPicture.picture_content
    const width = img.width
    console.log(width, 'width')
    const height = img.height
    console.log(height, 'height')
    const ratio = width / height || 0
    console.log(ratio, 'ratio')
    this.setState({ ratio })
  }
  handleDeletePicture(currentPicture) {
    if (getNextPicture(currentPicture.picture_Id) !== null) {
      let id = getNextPicture(currentPicture.picture_Id).picture_Id
      this.props.deletePhoto(currentPicture.picture_Id)
      this.props.history.push('/photodetail/' + id)
      this.props.getPhotoDetail(id)
      this.props.getAllPhotos()
    } else {
      this.props.deletePhoto(currentPicture.picture_Id)
      message.warning('后面没有图片了，已回到照片墙')
      this.props.history.push('/photos')
    }
  }
  handleNextPicture(currentPicture) {
    console.log(currentPicture, 'nextpicture')
    if (getNextPicture(currentPicture.picture_Id) !== null) {
      let id = getNextPicture(currentPicture.picture_Id).picture_Id
      this.props.history.push('/photodetail/' + id)
      this.props.getPhotoDetail(id)
    } else {
      message.warning('已经是最后一张了')
      return
    }
  }
  handleLastPicture(currentPicture) {
    console.log(currentPicture, 'lastpicture')
    if (getLastPicture(currentPicture.picture_Id) !== null) {
      let id = getLastPicture(currentPicture.picture_Id).picture_Id
      this.props.history.push('/photodetail/' + id)
      this.props.getPhotoDetail(id)
    } else {
      message.warning('已经是第一张了')
      return
    }
  }

  render() {
    const { userfunction, username, currentPicture } = this.props
    const { picture_content } = currentPicture
    console.log(picture_content, currentPicture)
    return username ? (
      <div className="photo-detail-container myclearfix">
        <div className="header-container">
          <div className="header">
            {userfunction === 2 || userfunction === 1 ? (
              <Link to="/photoupload">
                <Button type="normal" className="upload-photo">
                  上传照片
                </Button>
              </Link>
            ) : (
              ''
            )}
            {userfunction === 2 || userfunction === 1 ? (
              <Link to="/administer">
                <Button type="normal" className="manage">
                  管理账号
                </Button>
              </Link>
            ) : (
              ''
            )}
            <h1>zhou_pp的照片详情页面</h1>
            <div className="user">
              <span>用户：</span>
              <span>{username}</span>
              <Link to="/photos">
                <Button type="normal" className="photo-wall">
                  照片墙
                </Button>
              </Link>
              <Button
                type="normal"
                className="logout"
                onClick={() => {
                  this.logout()
                }}
              >
                退出登录
              </Button>
            </div>
          </div>
        </div>
        <div className="photo-detail-body myclearfix">
          {/* 图片及详情 */}
          <div className="description-section">
            <div
              className="photo-show"
              //   style={{
              //     width: 800,
              //     height: 500,
              //     backgroundImage:
              //       `${picture_content}` &&
              //       `${picture_content}` !== undefined &&
              //       `url(${picture_content})`,
              //     backgroundSize: 'contain',
              //     backgroundRepeat: 'no-repeat',
              //     backgroundPosition: 'center',
              //     backgroundColor: 'rgba(0,0,0,0.2)'
              //   }}
              //   currentPicture.picture_content
            >
              <img
                src={currentPicture.picture_content}
                alt=""
                onError={e => {
                  e.target.onError = null
                  e.target.src = errImg
                }}
              />
              {this.props.userfunction === 2 ? (
                <Button
                  type="danger"
                  className="deletePhotoButton"
                  onClick={() => {
                    this.handleDeletePicture(currentPicture)
                  }}
                >
                  删除照片
                </Button>
              ) : (
                ''
              )}
            </div>
            <LeftOutlined
              onClick={() => {
                this.handleLastPicture(currentPicture)
              }}
              className="left-icon"
              style={{ fontSize: 45, color: 'rgba(0, 0, 0,0.8)' }}
            />
            <RightOutlined
              onClick={() => {
                this.handleNextPicture(currentPicture)
              }}
              className="right-icon"
              style={{ fontSize: 45, color: 'rgba(0, 0, 0,0.8)' }}
            />
            <div className="photo-text myclearfix">
              <p className="photo-description">
                照片描述：{currentPicture['picture_description']}
              </p>
              <span className="photo-info">
                拍摄时间：
                {moment(currentPicture.taken_time).format(
                  'YYYY-MM-DD HH:mm:ss'
                )}
                <br />
                上传时间：
                {moment(currentPicture.upload_time).format(
                  'YYYY-MM-DD HH:mm:ss'
                )}
                <br />
                上传者：{currentPicture.user_name}
              </span>
              {this.props.userfunction === 2 ? (
                <Button
                  type="primary"
                  size="small"
                  className="edit-picture-info"
                >
                  编辑
                </Button>
              ) : (
                ''
              )}
            </div>
          </div>
          {/* 评论部分 */}
          <div className="comment-section">
            <App
              issssLoading={this.props.issssLoading}
              username={username}
              pictureId={this.props.match.params.id}
              currentComments={this.props.currentComments}
              createComment={this.props.createComment}
              getComments={this.props.getComments}
              getPhotoDetail={this.props.getPhotoDetail}
              currentPicture={this.props.currentPicture}
              deleteComment={this.props.deleteComment}
              userfunction={this.props.userfunction}
            />
          </div>
        </div>
      </div>
    ) : (
      <Redirect to="/" />
    )
  }
}
const mapStateToProps = state => {
  console.log(state, 'state=====')
  return {
    username: getUsername(state.auth),
    userfunction: getUserFunction(state.auth),
    currentComments: state.photoDetail.currentComments || [],
    currentPicture: getCurrentPicture(state.photoDetail),
    issssLoading: state.photoDetail.issssLoading
  }
}

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators(authActions, dispatch),
    ...bindActionCreators(photoDetailActions, dispatch),
    ...bindActionCreators(photoActions, dispatch)
  }
}
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PhotoDetails)
)
