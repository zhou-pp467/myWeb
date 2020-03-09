import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Redirect, withRouter, Link } from 'react-router-dom'
import { DatePicker, Button } from 'antd'
import { actions as photosActions, getPhotos } from '../../redux/photos'
import {
  actions as authActions,
  getUsername,
  getUserFunction
} from '../../redux/auth'
import './Photos.css'
import Waterfall from '../../components/Waterfall'

class Photos extends Component {
  onChange = dates => {
    console.log(dates)
    this.props.getPhotosByDates(dates)
  }
  logout = () => {
    this.props.logout()
  }
  componentWillMount() {
    this.props.getAllPhotos()
  }
  componentDidMount() {
    this.props.getAllPhotos()
  }

  render() {
    const { RangePicker } = DatePicker
    const userfunction = this.props.userfunction
    const username = this.props.username
    const {
      photos: { data = [] }
    } = this.props
    return username ? (
      <div className="photos-container">
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
            <h1>zhou_pp的照片墙</h1>
            <div className="user">
              <span>用户：</span>
              <span>{username}</span>
              {userfunction === 2 || userfunction === 1 ? (
                <Link to="/administer">
                  <Button type="normal" className="manage">
                    管理账号
                  </Button>
                </Link>
              ) : (
                ''
              )}
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
            <div className="range">
              <span>选择照片时段：</span>
              <RangePicker
                placeholder={['        起始日期', '        结束日期']}
                className="range-picker"
                size="medium"
                onChange={dates => this.onChange(dates)}
              />
            </div>
          </div>
        </div>
        <div className="photos-body">
          <div className="photo-contents">
            {!(data && data.length) ? (
              <p>抱歉，没有当前时段的照片~</p>
            ) : (
              <Waterfall data={data}></Waterfall>
            )}
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
    photos: getPhotos(state.photos)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators(photosActions, dispatch),
    ...bindActionCreators(authActions, dispatch)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Photos))
