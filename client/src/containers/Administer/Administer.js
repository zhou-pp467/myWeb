import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Redirect, withRouter, Link } from 'react-router-dom'
import {
  actions as authActions,
  getUsername,
  getUserFunction
} from '../../redux/auth'
import { actions as usersActions, getUserList } from '../../redux/users'
import { Button, Switch, Modal, Input, Radio, Form } from 'antd'
import './Administer.css'

const ChangeInfo = ({
  visible,
  onCreate,
  onCancel,
  username,
  changeInfo,
  loginName
}) => {
  const [form] = Form.useForm()
  return (
    <Modal
      visible={visible}
      title="修改账户信息"
      okText="修改"
      cancelText="取消"
      onCancel={() => {
        onCancel()
        form.resetFields()
      }}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            form.resetFields()
            onCreate(values)
            changeInfo(values.username, values.password, values.function)
          })
          .catch(info => {
            console.log('Validate Failed:', info)
          })
      }}
    >
      <Form
        labelAlign="left"
        wrapperCol={{ span: 16, offset: 0 }}
        labelCol={{ span: 4, offset: 0 }}
        size="small"
        form={form}
        className="changeInfoForm"
        layout="horizontal"
        name="form_in_modal"
        initialValues={{
          username: username,
          password: '',
          function: 0
        }}
      >
        <Form.Item className="usernameLabel" name="username" label="用户名">
          <div>{username}</div>
        </Form.Item>

        <Form.Item
          name="password"
          className="passwordToSave"
          label="密码"
          rules={[
            {
              whitespace: true,
              required: true,
              pattern: '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$',
              message: '密码至少包含数字和英文，长度6-20'
            }
          ]}
        >
          <Input type="textarea" />
        </Form.Item>
        {loginName === '呆呆' ? (
          <Form.Item
            name="function"
            label="身份"
            className="functionSetter"
            rules={[
              {
                required: true
              }
            ]}
          >
            <Radio.Group>
              {username === '呆呆' ? (
                <Radio className="radio" value={0}>
                  总管理员
                </Radio>
              ) : (
                ''
              )}

              {username !== '呆呆' ? (
                <div>
                  <Radio className="radio" value={1}>
                    副管理员
                  </Radio>
                  <Radio className="radio" value={9}>
                    游客
                  </Radio>
                </div>
              ) : (
                ''
              )}
            </Radio.Group>
          </Form.Item>
        ) : (
          ''
        )}
      </Form>
    </Modal>
  )
}

const AddUserForm = ({ visible, onCreate, onCancel, addUser }) => {
  const [form] = Form.useForm()
  return (
    <Modal
      visible={visible}
      title="添加账号"
      okText="添加"
      cancelText="取消"
      onCancel={() => {
        onCancel()
        form.resetFields()
      }}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            form.resetFields()
            onCreate(values)
            addUser(values.username, values.password, values.function)
          })
          .catch(info => {
            console.log('Validate Failed:', info)
          })
      }}
    >
      <Form
        labelAlign="left"
        wrapperCol={{ span: 16, offset: 0 }}
        labelCol={{ span: 4, offset: 0 }}
        size="small"
        form={form}
        className="changeInfoForm"
        layout="horizontal"
        name="form_in_modal"
        initialValues={{
          username: '',
          password: '',
          function: 9
        }}
      >
        <Form.Item
          className="usernameLabel"
          name="username"
          label="用户名"
          rules={[
            {
              whitespace: true,
              required: true,
              message: '用户名不能为空'
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          className="passwordToSave"
          label="密码"
          rules={[
            {
              required: true,
              pattern: '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$',
              message: '密码至少包含数字和英文，长度6-20'
            }
          ]}
        >
          <Input type="textarea" />
        </Form.Item>
        <Form.Item
          name="function"
          label="身份"
          className="functionSetter"
          rules={[
            {
              required: true
            }
          ]}
        >
          <Radio.Group>
            <Radio className="radio" value={1}>
              副管理员
            </Radio>
            <Radio className="radio" value={9}>
              游客
            </Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

const AddNewUserButton = props => {
  const [visible, setVisible] = useState(false)

  const onCreate = values => {
    console.log('Received values of form: ', values)
    setVisible(false)
  }

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setVisible(true)
        }}
        className="addNewUser"
      >
        新增账户
      </Button>
      <AddUserForm
        {...props}
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false)
        }}
      />
    </div>
  )
}

const ChangeInfoButton = props => {
  const [visible, setVisible] = useState(false)

  const onCreate = values => {
    console.log('Received values of form: ', values)
    setVisible(false)
  }
  return (
    <div>
      <Button
        onClick={() => {
          setVisible(true)
        }}
        className="changeInfoButton"
      >
        修改信息
      </Button>
      <ChangeInfo
        {...props}
        username={props.username}
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false)
        }}
      />
    </div>
  )
}

class Administer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showPassword: false
    }
  }
  handleDelete(username) {
    console.log(username)
    this.props.deleteUser(username)
  }

  handleAddUser() {
    this.setState({
      createUservisible: true
    })
  }
  handleAddOk = e => {}

  handleAddCancel = e => {
    this.setState({
      addedFunction: '',
      addedPassword: '',
      addedUser: '',
      createUservisible: false
    })
  }
  handleChangeInfo() {}

  logout = () => {
    this.props.logout()
  }

  componentDidMount() {
    this.props.getUsers()
  }

  render() {
    const { loginName, userfunction, userList } = this.props
    const userListToMap = userList
    return userfunction === 0 || userfunction === 1 ? (
      <div className="administer">
        <div className="header-container">
          <div className="header">
            <h1>zhou_pp的管理员页面</h1>
            <div className="user">
              <span>用户：</span>
              <span>{loginName}</span>
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
          <h1>账号信息列表</h1>
          <div>
            {userListToMap.map((item, index, arr) => {
              let bgcontroller = index % 2 === 0 ? 'even' : 'odd'
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
                  {(loginName === item['user_name'] || userfunction === 0) && (
                    <div className={'infoItem' + ' ' + bgcontroller}>
                      <b className="userInfo" title={item['user_name']}>
                        {item['user_name']}
                      </b>
                      <Button
                        className="deleteButton"
                        onClick={e => {
                          this.handleDelete(e.target.getAttribute('loginName'))
                        }}
                        username={item['user_name']}
                        disabled={loginName === item['user_name']}
                      >
                        删除
                      </Button>
                      <ChangeInfoButton
                        {...this.props}
                        username={item['user_name']}
                      />
                      <b className="functionInfo">{user_function}</b>
                      {this.state.showPassword && (
                        <b
                          className="passwordInfo"
                          title={item['user_password']}
                        >
                          {item['user_password']}
                        </b>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          {userfunction === 0 && <AddNewUserButton {...this.props} />}
          <Switch
            className="switchPasswordShow"
            checkedChildren="隐藏密码"
            unCheckedChildren="显示密码"
            onChange={(checked, event) => {
              this.setState({ showPassword: checked })
            }}
          />
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
    loginName: getUsername(state.auth),
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
