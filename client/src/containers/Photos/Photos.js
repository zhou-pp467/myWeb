import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Redirect, withRouter, Link } from 'react-router-dom'
import { DatePicker, Button } from 'antd'
import { actions as photosActions, getPhotos } from '../../redux/photos'
import { actions as authActions, getUsername } from '../../redux/auth'
import './Photos.css'
import errImage from '../../images/error.jpg'

class Photos extends Component {
  onChange = dates => {
    console.log(dates)
    this.props.getPhotosByDates(dates)
  }
  logout = () => {
    this.props.logout()
  }

  componentDidMount() {
    this.props.getPhotos()
    // let imgs = document.getElementsByTagName('img')
    // Array.prototype.map.call(imgs, (item, index, arr) => {
    //   item.addEventListener('error', () => {
    //     item.src = { errImage }
    //   })
    // })
  }

  render() {
    const { RangePicker } = DatePicker
    console.log(this.props.photos.data)
    const username = this.props.username
    return username ? (
      <div className="photos-container">
        <div className="header-container">
          <div className="header">
            <h1>zhou_pp的个人空间</h1>
            <div className="user">
              <span>用户：</span>
              <span>{username}</span>
              {username === '呆呆' ? (
                <Link to="/admin">
                  <Button type="normal" className="manage">
                    管理
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
                className="range-picker"
                size="medium"
                onChange={dates => this.onChange(dates)}
              />
            </div>
          </div>
        </div>
        <div className="photos-body">
          <div className="photo-contents">
            {this.props.photos.data.map((item, index, arr) => {
              let marginRight = (index + 1) % 4 === 0 ? 0 : 10
              return (
                <img
                  style={{ marginRight: `${marginRight}px` }}
                  key={item['picture_Id']}
                  src={item['picture_content']}
                  title={item['picture_description']}
                  //   onError={e => {
                  //     e.target.src = { errImage }
                  //   }}
                />
              )
            })}
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
