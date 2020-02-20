import React, { Component } from 'react'
import { connect } from 'react-redux'

class App extends Component {
  render() {
    return <h1>{this.props.num}</h1>
  }
}

const mapStateToProps = state => {
  return { num: state.a }
}

export default connect(mapStateToProps)(App)
