import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Login from '../Login'
import './App.css'
import Photos from '../Photos'
// import PhotoUpload from './PhotoUpload'
// import Administer from './Administer'
// import PhotoDetail from './PhotoDetail'

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/photos" component={Photos} />
            {/* <Route path="/photoupload" component={PhotoUpload} /> */}
            {/* <Route path="/administer" component={Administer} /> */}
            {/* <Route path="/photodetail" component={PhotoDetail} /> */}
            {/* <Redirect from="/*" to="/" /> */}
          </Switch>
        </Router>
      </div>
    )
  }
}

export default connect()(App)
