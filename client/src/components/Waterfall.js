import React, { Component } from 'react'
import { errImg, loadingGif } from '../images/index'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as photoDetailActions } from '../redux/photoDetail'
import { actions as photosActions } from '../redux/photos'
import { Redirect, withRouter, Link } from 'react-router-dom'

const io = new IntersectionObserver(
  entries => {
    entries.forEach(item => {
      if (item.intersectionRatio <= 0) {
        return
      }
      const { target } = item
      target.src = target.dataset.src
      io.unobserve(target)
    })
  },
  { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }
)
const myrefs = React.createRef()
class WaterfallInner extends Component {
  constructor(props) {
    super(props)
    this.state = {
      col1: [],
      col2: [],
      col3: [],
      col4: []
    }

    this.dataChange = this.dataChange.bind(this)
    this.clickItemHandle = this.clickItemHandle.bind(this)
  }

  //发送请求跳转到照片详情
  clickItemHandle(id) {
    console.log(id)
    this.props.history.push('/photodetail/' + id)
  }

  //把data处理成待渲染的形式
  dataChange(data) {
    let col1 = []
    let col2 = []
    let col3 = []
    let col4 = []
    data.forEach((item, index, arr) => {
      let shortOne
      let col1Length = 0,
        col2Length = 0,
        col3Length = 0,
        col4Length = 0
      for (let i = 0; i < col1.length; i++) {
        col1Length += col1[i]['height']
      }
      for (let i = 0; i < col2.length; i++) {
        col2Length += col2[i]['height']
      }
      for (let i = 0; i < col3.length; i++) {
        col3Length += col3[i]['height']
      }
      for (let i = 0; i < col4.length; i++) {
        col4Length += col4[i]['height']
      }

      if (
        col1Length <= col2Length &&
        col1Length <= col3Length &&
        col1Length <= col4Length
      ) {
        shortOne = 'col1'
      }
      if (
        col2Length < col1Length &&
        col2Length <= col3Length &&
        col2Length <= col4Length
      ) {
        shortOne = 'col2'
      }
      if (
        col3Length < col1Length &&
        col3Length < col2Length &&
        col3Length <= col4Length
      ) {
        shortOne = 'col3'
      }
      if (
        col4Length < col1Length &&
        col4Length < col2Length &&
        col4Length < col3Length
      ) {
        shortOne = 'col4'
      }

      switch (shortOne) {
        case 'col1':
          col1.push(item)
          break
        case 'col2':
          col2.push(item)
          break
        case 'col3':
          col3.push(item)
          break
        case 'col4':
          col4.push(item)
          break
        default:
          break
      }
    })

    this.setState({ col1, col2, col3, col4 })
  }

  componentWillMount() {
    this.dataChange(this.props.data)
  }
  componentWillReceiveProps(nextprops) {
    if (JSON.stringify(this.props.data) !== JSON.stringify(nextprops.data)) {
      this.dataChange(nextprops.data)
    }
  }

  render() {
    return (
      <div className="myclearfix waterfall" ref={myrefs}>
        <div className="col1 myclearfix">
          {!!this.state.col1.length &&
            this.state.col1.map((item, index, arr) => {
              return (
                <img
                  data-src={item['picture_content']}
                  src={loadingGif}
                  onError={e => {
                    e.target.src = loadingGif
                    e.target.onerror = null
                    e.target.key = item['picture_Id']
                  }}
                  width={287}
                  height={item['height']}
                  key={item['picture_Id']}
                  title={item['picture_description']}
                  onClick={e => {
                    this.clickItemHandle(item.picture_Id)
                  }}
                />
              )
            })}
        </div>
        <div className="col2 myclearfix">
          {!!this.state.col2.length &&
            this.state.col2.map((item, index, arr) => {
              return (
                <img
                  data-src={item['picture_content']}
                  src={loadingGif}
                  onError={e => {
                    e.target.src = loadingGif
                    e.target.onerror = null
                    e.target.key = item['picture_Id']
                  }}
                  width={287}
                  height={item['height']}
                  key={item['picture_Id']}
                  title={item['picture_description']}
                  onClick={e => {
                    this.clickItemHandle(item.picture_Id)
                  }}
                />
              )
            })}
        </div>
        <div className="col3 myclearfix">
          {!!this.state.col3.length &&
            this.state.col3.map((item, index, arr) => {
              return (
                <img
                  data-src={item['picture_content']}
                  src={loadingGif}
                  onError={e => {
                    e.target.src = loadingGif
                    e.target.onerror = null
                    e.target.key = item['picture_Id']
                  }}
                  width={287}
                  height={item['height']}
                  key={item['picture_Id']}
                  title={item['picture_description']}
                  onClick={e => {
                    this.clickItemHandle(item.picture_Id)
                  }}
                />
              )
            })}
        </div>
        <div className="col4 myclearfix">
          {!!this.state.col4.length &&
            this.state.col4.map((item, index, arr) => {
              return (
                <img
                  data-src={item['picture_content']}
                  src={loadingGif}
                  onError={e => {
                    e.target.src = loadingGif
                    e.target.onerror = null
                    e.target.key = item['picture_Id']
                  }}
                  width={287}
                  height={item['height']}
                  key={item['picture_Id']}
                  title={item['picture_description']}
                  onClick={e => {
                    this.clickItemHandle(item.picture_Id)
                  }}
                />
              )
            })}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {}
}
const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators(photoDetailActions, dispatch),
    ...bindActionCreators(photosActions, dispatch)
  }
}

const onload = () => {
  const box = myrefs.current
  const imgs = box.querySelectorAll('img')
  imgs.forEach(item => {
    io.observe(item)
  })
}

WaterfallInner = withRouter(WaterfallInner)

const Waterfall = props => {
  return (
    <div>
      <WaterfallInner data={props.data}></WaterfallInner>
      <img src={+new Date()} onError={onload} alt="" />
    </div>
  )
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Waterfall)
)
