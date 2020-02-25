import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Form, Icon, Input, Button } from 'antd'
import { actions as authActions } from '../../redux/auth'
import { withRouter, Redirect } from 'react-router-dom'
import './Login.css'

class Login extends Component {
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.login(values)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return this.props.username ? (
      <Redirect to="/photos" />
    ) : (
      <div className="login-container">
        <Form onSubmit={this.handleSubmit} className="login-form">
          <h1>zhou_pp的个人空间</h1>
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入用户名!' }]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="用户名"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码!' }]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                type="password"
                placeholder="密码"
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              disabled={this.props.login_fail === 'loading'}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Login)
const mapStateToProps = state => {
  return {
    username: state.auth.username,
    login_fail: state.auth.login_fail
  }
}

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators(authActions, dispatch)
  }
}
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(WrappedNormalLoginForm)
)
