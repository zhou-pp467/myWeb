import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Redirect, withRouter, Link } from 'react-router-dom'
import {
  actions as authActions,
  getUsername,
  getUserFunction
} from '../../redux/auth'
import { actions as usersActions, getUserList } from '../../redux/users'
import { Button, Switch } from 'antd'
import './Administer.css'

class Administer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showPassword: false
    }
  }
  logout = () => {
    this.props.logout()
  }
  componentDidMount() {
    this.props.getUsers()
  }
  render() {
    const { username, userfunction, userList } = this.props
    const userListToMap = userList.data
    console.log(userListToMap)
    return userfunction === 0 || userfunction === 1 ? (
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
        <div className="administer-body">
          <h1>账号列表</h1>
          <div>
            {userListToMap.map((item, index, arr) => {
              let user_function
              switch (item['user_function']) {
                case 0:
                  user_function = '总管理员'
                  break
                case 1:
                  user_function = '副管理员'
                  break
                case 9:
                  user_function = '游客'
                  break
                default:
                  break
              }
              return (
                <div key={index}>
                  {(username === item['user_name'] || userfunction === 0) && (
                    <div>
                      <b>{item['user_name']}</b>
                      {this.state.showPassword && (
                        <b>{item['user_password']}</b>
                      )}

                      <b>{user_function}</b>
                      <Button>修改信息</Button>
                      <Button>删除</Button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <Switch
            checkedChildren="隐藏密码"
            unCheckedChildren="显示密码"
            onChange={(checked, event) => {
              this.setState({ showPassword: checked })
            }}
          />
          {userfunction === 0 && <Button>新增用户</Button>}
        </div>
      </div>
    ) : (
      <Redirect to="/" />
    )
  }
}

const mapStateToProps = state => {
  return {
    userfunction: getUserFunction(state.auth),
    username: getUsername(state.auth),
    userList: getUserList(state.users)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators(authActions, dispatch),
    ...bindActionCreators(usersActions, dispatch)
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Administer)
)
