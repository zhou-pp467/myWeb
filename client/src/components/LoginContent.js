import { Form, Input, Button } from 'antd'
import React, { Component } from 'react'

class LoginContent extends Component {
  render() {
    const onFinish = values => {
      this.props.login(values)
    }

    const onFinishFailed = errorInfo => {}
    const layout = {
      labelCol: {
        span: 6,
        offset: 0
      },
      wrapperCol: {
        span: 18
      }
    }
    const tailLayout = {
      wrapperCol: {
        offset: 0,
        span: 10
      }
    }
    return (
      <Form
        labelAlign="left"
        {...layout}
        name="basic"
        initialValues={{
          remember: true
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            {
              required: true,
              message: '请输入用户名！'
            }
          ]}
        >
          <Input className="usernameInput" />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码!'
            }
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            登录
          </Button>
        </Form.Item>
      </Form>
    )
  }
}
export default LoginContent
