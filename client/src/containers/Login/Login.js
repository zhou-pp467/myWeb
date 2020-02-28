import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as authActions } from '../../redux/auth'
import { withRouter, Redirect } from 'react-router-dom'
import './Login.css'
import LoginContent from '../../components/LoginContent'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return !this.props.username ? (
      <div className="login-container">
        <div className="login-form">
          <h1>zhou_pp的个人空间</h1>
          <LoginContent {...this.props} />
        </div>
      </div>
    ) : (
      <Redirect to="/photos" />
    )
  }
}

const mapStateToProps = state => {
  return {
    username: state.auth.username
  }
}

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators(authActions, dispatch)
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))
