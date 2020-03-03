import React, { Component } from 'react'
import { errImg } from '../images/index'
import { connect } from 'react-redux'

class Waterfall extends Component {
  constructor(props) {
    super(props)
    this.state = {
      col1: [],
      col2: [],
      col3: [],
      col4: [],
      data: this.props.data || []
    }
    this.createHTML = this.createHTML.bind(this)
    this.dataChange = this.dataChange.bind(this)
    this.clickItemHandle = this.clickItemHandle.bind(this)
  }

  clickItemHandle(id) {
    console.log(id)
  } //发送请求跳转到照片详情

  createHTML(arr) {
    return (
      <div>
        {arr.map((item, index, array) => (
          <img
            alt="err"
            src={item['picture_content']}
            onError={e => {
              e.target.src = errImg
              e.target.onerror = null
            }}
            key={item['picture_Id']}
            title={item['picture_description']}
            onClick={this.clickItemHandle(item['picture_Id'])}
          />
        ))}
      </div>
    )
  }

  dataChange(data) {
    data.forEach((item, index, arr) => {
      const image = new Image()
      image.src = item['picture_content']
      const originalWidth = image.width || 287
      const originalHeight = image.height
      const height = (287 * originalHeight) / originalWidth
      item['height'] = height || 190
      let shortOne = (function(state) {
        let col1Length = 0,
          col2Length = 0,
          col3Length = 0,
          col4Length = 0
        for (let i = 0; i < state.col1.length; i++) {
          col1Length += state.col1[i]['height']
        }
        for (let i = 0; i < state.col2.length; i++) {
          col2Length += state.col2[i]['height']
        }
        for (let i = 0; i < state.col3.length; i++) {
          col3Length += state.col3[i]['height']
        }
        for (let i = 0; i < state.col4.length; i++) {
          col4Length += state.col4[i]['height']
        }

        if (
          col1Length <= col2Length &&
          col1Length <= col3Length &&
          col1Length <= col4Length
        ) {
          return 'col1'
        }
        if (
          col2Length < col1Length &&
          col2Length <= col3Length &&
          col2Length <= col4Length
        ) {
          return 'col2'
        }
        if (
          col3Length < col1Length &&
          col3Length < col2Length &&
          col3Length <= col4Length
        ) {
          return 'col3'
        }
        if (
          col4Length < col1Length &&
          col4Length < col2Length &&
          col4Length < col3Length
        ) {
          return 'col4'
        }
      })(this.state)

      switch (shortOne) {
        case 'col1':
          this.state.col1.push(item)
          break
        case 'col2':
          this.state.col2.push(item)
          break
        case 'col3':
          this.state.col3.push(item)
          break
        case 'col4':
          this.state.col4.push(item)
          break
        default:
          break
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    this.setState({
      col1: [],
      col2: [],
      col3: [],
      col4: [],
      data: nextProps.data || []
    })
  }
  render() {
    this.dataChange(this.state.data)
    return (
      <div className="myclearfix">
        <div className="col1 myclearfix">
          {!!this.state.col1.length && this.createHTML(this.state.col1)}
        </div>
        <div className="col2 myclearfix">
          {!!this.state.col2.length && this.createHTML(this.state.col2)}
        </div>
        <div className="col3 myclearfix">
          {!!this.state.col3.length && this.createHTML(this.state.col3)}
        </div>
        <div className="col4 myclearfix">
          {!!this.state.col4.length && this.createHTML(this.state.col4)}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {}
}
const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Waterfall)
