import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class PhotoUpload extends Component {
  render() {
    if (RedirectToLogin) {
      return <Redirect to="/" />
    }
    return <div></div>
  }
}

const mapStateToProps = state => {
  return
}

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoUpload)
