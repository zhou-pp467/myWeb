import express from 'express'
const router = express.Router()

//登录 0:fail; 1:success
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
  const sql = `SELECT * FROM users WHERE user_name = '${username}'`
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
      res.send(result)
      return
    }
  })
  connection.end()
})

//退出
router.get('/logout', (req, res, next) => {
  req.session.username = null
  res.send({ status: 0 })
})

//获取照片墙
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

// 获取指定月份照片
// router.post('/getPhotosByMonth', (req, res, next) => {})

// //编辑照片详情
// router.post('/editPhotoDetail', (req, res, next) => {})

// 上传照片
// router.post('/uploadPhoto', (req, res, next) => {})

// //获取评论
// router.get('/comments', (req, res, next) => {})

// // 创建评论
// router.post('/createComment', (req, res, next) => {})

// // 删除评论
// router.get('/deleteComment', (req, res, next) => {})

// //删除照片
// router.get('/deletePhoto', (req, res, next) => {})

// 创建账号
router.post('/createUser', (req, res, next) => {
  if (req.session.username === 'daidai') {
    //连接数据库
    let mysql = require('mysql')
    let connection = mysql.createConnection({
      host: '156.67.222.213',
      user: 'u247080489_zhou_pp467',
      password: '542641',
      database: 'u247080489_myWeb'
    })
    let username = req.body.username
    let password = req.body.password
    let user_function = req.body.user_function
    const sql = `insert into users (user_name,user_password,user_function) values ('${username}','${password}','${user_function}')`
    connection.query(sql, (err, result) => {
      if (err) {
        res.send(err)
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

//删除账号
router.get('/deleteUser', (req, res, next) => {
  if (req.session.username === 'daidai') {
    //连接数据库
    let mysql = require('mysql')
    let connection = mysql.createConnection({
      host: '156.67.222.213',
      user: 'u247080489_zhou_pp467',
      password: '542641',
      database: 'u247080489_myWeb'
    })
    let username = req.query.username
    const sql = `DELETE FROM users WHERE user_name='${username}'`
    connection.query(sql, (err, result) => {
      if (err) {
        res.send(err)
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

module.exports = router
