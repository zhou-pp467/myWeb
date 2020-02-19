import express from 'express'
const router = express.Router()

//登录接口 0:fail; 1:success
router.post('/login', (req, res, next) => {
  //连接数据库
  let mysql = require('mysql')
  let connection = mysql.createConnection({
    host: '156.67.222.213',
    user: 'u247080489_zhou_pp467',
    password: '542641',
    database: 'u247080489_myWeb'
  })
  const { username, password } = req.body
  const sql = `SELECT user_password FROM users WHERE user_name = '${username}'`
  connection.query(sql, (err, result) => {
    if (err) {
      res.send({ status: 0 })
      return
    }
    const passwordInput = result[0]['user_password']
    if (passwordInput !== password) {
      res.send({ status: 0 })
      return
    } else {
      req.session.username = username
      res.send({ status: 1 })
      return
    }
  })
  connection.end()
})

//退出接口
router.get('/logout', (req, res, next) => {
  req.session.username = null
  res.send({ status: 0 })
})

// //获取照片墙
router.get('/getPhotos', (req, res, next) => {
  if (req.session.username) {
    //连接数据库
    let mysql = require('mysql')
    let connection = mysql.createConnection({
      host: '156.67.222.213',
      user: 'u247080489_zhou_pp467',
      password: '542641',
      database: 'u247080489_myWeb'
    })
    const sql = `SELECT picture_Id,picture_content,picture_description FROM pictures ORDER BY taken_time DESC`
    connection.query(sql, (err, result) => {
      if (err) {
        res.send({ status: 0 })
      } else {
        let data = result
        res.send(data)
      }
    })
    connection.end()
  } else {
    res.send({ status: 0 })
  }
})

//获取照片详情
router.get('/photoDetail', (req, res, next) => {
  if (req.session.username) {
    //连接数据库
    let mysql = require('mysql')
    let connection = mysql.createConnection({
      host: '156.67.222.213',
      user: 'u247080489_zhou_pp467',
      password: '542641',
      database: 'u247080489_myWeb'
    })
    const id = req.query.pictureId
    const sql = `SELECT * FROM pictures WHERE picture_Id = '${id}'`
    connection.query(sql, (err, result) => {
      if (err) {
        res.send({ status: 0 })
      } else {
        let data = result
        res.send(data)
      }
    })
    connection.end()
  } else {
    res.send({ status: 0 })
  }
})

// //编辑照片详情
// router.post('/editPhotoDetail', (req, res, next) => {})

// //获取评论
// router.get('/comments', (req, res, next) => {})

// // 创建评论
// router.post('/createComment', (req, res, next) => {})

// //删除照片
// router.get('/deletePhoto', (req, res, next) => {})

// //获取账号信息
// router.get('/user', (req, res, next) => {})

// // 创建账号
// router.post('/createUser', (req, res, next) => {})

module.exports = router
