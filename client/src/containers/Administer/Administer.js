import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Redirect, withRouter, Link } from 'react-router-dom'
import { actions as authActions, getUsername } from '../../redux/auth'
import { Button } from 'antd'
import './Administer.css'

class Administer extends Component {
  logout = () => {
    this.props.logout()
  }
  render() {
    const { username } = this.props
    return username === '呆呆' ? (
      <div className="administer">
        <div className="header-container">
          <div className="header">
            <h1>zhou_pp的管理员页面</h1>
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
        <div className="administer-body"></div>
      </div>
    ) : (
      <Redirect to="/" />
    )
  }
}

const mapStateToProps = state => {
  return {
    username: getUsername(state.auth)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators(authActions, dispatch)
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Administer)
)
