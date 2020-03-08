import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Redirect, withRouter, Link } from 'react-router-dom'
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
  logout = () => {
    this.props.logout()
  }
  componentDidMount() {
    this.props.getPhotoDetail(this.props.match.params.id)
    this.props.getComments(this.props.match.params.id)
  }
  render() {
    const { userfunction, username } = this.props
    console.log(this.props.currentComments)
    console.log(this.props)
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
          <div>
            <div className="photo-show"></div>
            <LeftOutlined
              className="left-icon"
              style={{ fontSize: 45, color: 'rgba(0, 0, 0,0.8)' }}
            />
            <RightOutlined
              className="right-icon"
              style={{ fontSize: 45, color: 'rgba(0, 0, 0,0.8)' }}
            />
            <div className="photo-text myclearfix">
              <p className="photo-description">alkenfwenfa</p>
              <span className="photo-info">asdfs</span>
              <Button type="primary" size="small" className="edit-picture-info">
                编辑
              </Button>
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
    ...bindActionCreators(photoDetailActions, dispatch)
  }
}
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PhotoDetails)
)
