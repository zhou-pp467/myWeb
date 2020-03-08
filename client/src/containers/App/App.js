import React, { Component } from 'react'
import { connect } from 'react-redux'
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Login from '../Login/Login'
import Photos from '../Photos/Photos'
import PhotoUpload from '../PhotoUpload/PhotoUpload'
import Administer from '../Administer/Administer'
import PhotoDetails from '../PhotoDetail/PhotoDetail'

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/photos" component={Photos} />
          <Route path="/photoupload" component={PhotoUpload} />
          <Route path="/administer" component={Administer} />
          <Route path="/photodetail/:id" component={PhotoDetails} />
          {/* <Redirect from="/*" to="/" /> */}
        </Switch>
      </Router>
    )
  }
}

export default connect()(App)
