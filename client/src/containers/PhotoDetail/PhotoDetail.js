import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Redirect, withRouter, Link } from 'react-router-dom'
import { getLastPicture, getNextPicture } from '../../redux/photos'
import { errImg, loadingGif } from '../../images/index'
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
    const comId = e.currentTarget.id
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
  constructor(props) {
    super(props)
    this.state = {
      editing: false,
      description: this.props.currentPicture.picture_description
    }
  }

  logout = () => {
    this.props.logout()
  }

  componentWillMount() {
    this.props.getPhotoDetail(this.props.match.params.id)
    this.props.getComments(this.props.match.params.id)
  }
  componentDidMount() {
    this.picture.src = this.props.currentPicture.picture_content
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
    if (getLastPicture(currentPicture.picture_Id) !== null) {
      let id = getLastPicture(currentPicture.picture_Id).picture_Id
      this.props.history.push('/photodetail/' + id)
      this.props.getPhotoDetail(id)
    } else {
      message.warning('已经是第一张了')
      return
    }
  }
  editDescription() {
    this.setState({ editing: true })
  }
  confirmEdit() {
    this.props.editPhotoDetail(
      this.props.currentPicture.picture_Id,
      this.state.description.trim()
    )
    this.setState({
      editing: false
    })
  }
  cancelEdit() {
    this.setState({
      editing: false,
      description: this.props.currentPicture.picture_description
    })
  }
  handelDescriptionChange(e) {
    this.setState({ description: e.target.value })
  }
  componentWillReceiveProps(nextprops) {
    this.picture.src = loadingGif
    console.log('picturechanged')
    if (nextprops.currentPicture !== this.props.currentPicture) {
      this.setState({
        description: nextprops.currentPicture.picture_description
      })
    }
  }
  componentDidUpdate(prevProps, prevState) {
    // if (prevProps.currentPicture !== this.props.currentPicture) {
    this.picture.src = this.props.currentPicture.picture_content
    // }
  }

  componentWillUnmount() {
    this.props.clear()
  }

  render() {
    const { userfunction, username, currentPicture } = this.props

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
            <div className="photo-show">
              <img
                ref={ref => (this.picture = ref)}
                src={loadingGif}
                alt=""
                onError={e => {
                  e.target.onError = null
                  e.target.src = loadingGif
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
              {this.state.editing === true ? (
                <TextArea
                  value={this.state.description}
                  onChange={e => {
                    this.handelDescriptionChange(e)
                  }}
                  rows={3}
                  style={{
                    width: 350,
                    resize: 'none',
                    position: 'absolute',
                    top: 16,
                    left: 106
                  }}
                >
                  {this.state.description}
                </TextArea>
              ) : (
                ''
              )}
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
              {this.props.userfunction === 2 && this.state.editing === false ? (
                <Button
                  type="primary"
                  size="small"
                  className="edit-picture-info"
                  onClick={() => {
                    this.editDescription()
                  }}
                >
                  编辑
                </Button>
              ) : (
                ''
              )}
              {this.props.userfunction === 2 && this.state.editing === true ? (
                <div className="buttons">
                  <Button
                    className="confirmBUtton"
                    size="small"
                    type="primary"
                    onClick={() => {
                      this.confirmEdit()
                    }}
                  >
                    确认
                  </Button>
                  <Button
                    className="cancelButton"
                    size="small"
                    onClick={() => {
                      this.cancelEdit()
                    }}
                  >
                    取消
                  </Button>
                </div>
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
