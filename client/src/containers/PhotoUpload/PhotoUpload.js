import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Redirect, withRouter, Link } from 'react-router-dom'
import {
  actions as authActions,
  getUsername,
  getUserFunction
} from '../../redux/auth'
import { Form, DatePicker, Button, Input, Upload, message, Modal } from 'antd'
import './PhotoUpload.css'
import { UploadOutlined } from '@ant-design/icons'
import axios from '../../utils/axios'

const formItemLayout = {
  labelAlign: 'left',
  labelCol: {
    span: 5,
    offset: 3
  },
  wrapperCol: {
    offset: 1,
    span: 10
  }
}

const config = {
  rules: [
    {
      required: true,
      message: '不能为空'
    }
  ]
}

class UploadPicture extends Component {
  constructor(props) {
    super(props)
    this.state = {
      file: {}
    }
  }
  formRef = React.createRef()
  onReset = () => {
    this.formRef.current.resetFields()
  }
  render() {
    const uploadProps = {
      action: 'http://118.89.63.17:80/api/uploadPhoto',
      onChange: ({ fileList }) => {
        console.log(fileList)
        if (!fileList || fileList.length === 0) {
          this.setState({ file: {} })
          console.log(this.state.file)
        }
      },
      beforeUpload: file => {
        console.log(file)
        this.setState({ file: file })
        return false
      },
      multiple: false
    }
    const { file } = this.state
    const onFinish = fields => {
      console.log(fields, 'fileds')
      let {
        photoUpload: { file }
      } = fields

      if (file) {
        let formData = new FormData()
        formData.append('file', file)
        formData.append('picture_description', fields['picture_description'])
        formData.append('user_name', fields['user_name'])
        formData.set(
          'taken_time',
          fields['taken_time'].format('YYYY-MM-DD HH:mm:ss')
        )
        axios
          .post('http://118.89.63.17:80/api/uploadPhoto', formData)
          .then(res => {
            console.log(res)
            this.onReset()
            this.setState({ file: {} })
            message.success('照片上传成功！')
          })
          .catch(err => {
            console.log(err)
            message.error('照片上传失败！')
          })
      }
    }
    const onFieldsChange = field => {
      if (field['photoUpload'] && field['photoUpload'].fileList.length > 0) {
        console.log(field)
        const file = field.photoUpload.file
        console.log(file)
        //限制图片 格式、size、分辨率
        const isJPG = file.type === 'image/jpeg'
        const isGIF = file.type === 'image/gif'
        const isPNG = file.type === 'image/png'
        if (!(isJPG || isGIF || isPNG)) {
          Modal.error({
            title: '只能上传JPG、JPEG、GIF、PNG格式的图片'
          })
        }
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          Modal.error({
            title: '超过2M限制 不允许上传'
          })
        }
        if ((isJPG || isGIF || isPNG) && isLt2M) {
          file.fileList = []
        }
      } else {
        return
      }
    }

    return (
      <Form
        ref={this.formRef}
        id="uploadForm"
        enctype="multipart/form-data"
        name="upload-picture-form"
        initialValues={{
          user_name: this.props.loginName
        }}
        {...formItemLayout}
        onFinish={onFinish}
        onValuesChange={onFieldsChange}
      >
        <Form.Item name="user_name" label="上传用户" {...config}>
          <div>{this.props.loginName}</div>
        </Form.Item>
        <Form.Item name="picture_description" label="照片详情" {...config}>
          <Input.TextArea
            placeholder="请输入照片详情"
            rows={5}
            style={{ resize: 'none' }}
          />
        </Form.Item>
        <Form.Item
          name="photoUpload"
          label="照片文件"
          valuePropName="file"
          rules={[
            ({ getFieldValue }) => ({
              validator(rule, value) {
                console.log(value)
                if (!value || value.fileList.length === 0) {
                  return Promise.reject('请上传照片！')
                }
                return Promise.resolve()
              }
            })
          ]}
        >
          <Upload
            name="photoUpload"
            listType="picture"
            file={file}
            {...uploadProps}
          >
            {Object.keys(file).length > 0 ? null : (
              <Button>
                <UploadOutlined /> 点击上传照片
              </Button>
            )}
          </Upload>
        </Form.Item>

        <Form.Item name="taken_time" label="拍照时间" {...config}>
          <DatePicker
            showTime
            placeholder="请选择时间"
            format="YYYY-MM-DD HH:mm:ss"
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6 }}>
          <Button type="primary" htmlType="submit" className="submit-button">
            上传信息
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

class PhotoUpload extends Component {
  logout = () => {
    this.props.logout()
  }
  render() {
    const { loginName, userfunction } = this.props

    return userfunction === 2 || userfunction === 1 ? (
      <div className="photo-upload-container myclearfix">
        <div className="header-container">
          <div className="header">
            {userfunction === 2 || userfunction === 1 ? (
              <Link to="/administer">
                <Button type="normal" className="manage">
                  管理账号
                </Button>
              </Link>
            ) : (
              ''
            )}
            <h1>zhou_pp的上传照片页面</h1>
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

        <div className="photo-upload-body">
          <h1>上传图片</h1>
          <UploadPicture {...this.props} />
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
    loginName: getUsername(state.auth)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators(authActions, dispatch)
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PhotoUpload)
)
