import express from 'express'
const router = express.Router()
var multer = require('multer')
const path = require('path')
let upload = multer({
  storage: multer.diskStorage({
    //设置文件存储位置
    destination: path.join(__dirname, '../public/images/'),
    //设置文件名称
    filename: function(req, file, cb) {
      let fileName =
        file.fieldname + '-' + Date.now() + path.extname(file.originalname)
      //fileName就是上传文件的文件名
      cb(null, fileName)
    }
  }),
  fileFilter: function(req, file, cb) {
    let ext = path.extname(file.originalname)
    let extArr = [
      '.jpg',
      '.jpeg',
      '.gif',
      '.png',
      '.BMP',
      '.JPG',
      '.JPEG',
      '.PNG',
      '.GIF'
    ]
    if (!extArr.includes(ext)) {
      //拒绝这个文件
      //cb(null, false);
      //当然我们还可以发送一个错误
      cb(new Error('扩展名不正确'))
    }

    //接受这个文件
    cb(null, true)
  }
})

//登录
router.post('/login', (req, res, next) => {
  //连接数据库
  let mysql = require('mysql')
  let connection = mysql.createConnection({
    host: 'cdb-0yzjn1q8.bj.tencentcdb.com',
    port: '10073',
    user: 'root',
    password: '5426416zdp10467',
    database: 'myWeb'
  })
  const { username, password } = req.body
  const sql = `SELECT * FROM users WHERE user_name = '${username}'`
  connection.query(sql, (err, result) => {
    if (err) {
      res.send(err)
      return
    }
    console.log(result)
    const passwordInput = result && result[0] && result[0]['user_password']
    if (passwordInput !== password) {
      res.send('500')
      return
    } else {
      req.session.userfunction = result[0]['user_function']
      req.session.username = result[0]['user_name']
      res.send(result)
      return
    }
  })
  connection.end()
})

//退出
router.get('/logout', (req, res, next) => {
  req.session.userfunction = null
  req.session.username = null
  res.send({ status: 0 })
})

//获取照片墙
router.get('/getPhotos', (req, res, next) => {
  if (req.session.username) {
    //连接数据库
    let mysql = require('mysql')
    let connection = mysql.createConnection({
      host: 'cdb-0yzjn1q8.bj.tencentcdb.com',
      port: '10073',
      user: 'root',
      password: '5426416zdp10467',
      database: 'myWeb'
    })
    const sql = `SELECT picture_Id,picture_content,picture_description FROM pictures ORDER BY taken_time DESC`
    connection.query(sql, (err, result) => {
      if (err) {
        res.send(err)
      } else {
        res.send(result)
      }
    })
    connection.end()
  } else {
    res.send(req.session)
  }
})

//获取照片详情
router.get('/photoDetail', (req, res, next) => {
  if (req.session.username) {
    //连接数据库
    let mysql = require('mysql')
    let connection = mysql.createConnection({
      host: 'cdb-0yzjn1q8.bj.tencentcdb.com',
      port: '10073',
      user: 'root',
      password: '5426416zdp10467',
      database: 'myWeb'
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

// 获取指定时间照片
router.post('/getPhotosByDate', (req, res, next) => {
  if (req.session.username) {
    //连接数据库
    let mysql = require('mysql')
    let connection = mysql.createConnection({
      host: 'cdb-0yzjn1q8.bj.tencentcdb.com',
      port: '10073',
      user: 'root',
      password: '5426416zdp10467',
      database: 'myWeb'
    })
    const startDate = req.body.dates[0]
    const endDate = req.body.dates[1]
    const sql = `SELECT picture_Id,picture_content,picture_description FROM pictures where taken_time >="${startDate}" and taken_time < "${endDate}" ORDER BY taken_time DESC`
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

//编辑照片详情
router.post('/editPhotoDetail', (req, res, next) => {
  if (
    req.session.function === 0 ||
    req.session.username === req.body.user_name
  ) {
    //连接数据库
    let mysql = require('mysql')
    let connection = mysql.createConnection({
      host: 'cdb-0yzjn1q8.bj.tencentcdb.com',
      port: '10073',
      user: 'root',
      password: '5426416zdp10467',
      database: 'myWeb'
    })
    let picture_Id = req.body.picture_Id
    let picture_description = req.body.picture_description
    const sql = `update pictures set picture_description = '${picture_description}' where picture_Id='${picture_Id}'`
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

// 上传照片及详情
router.post('/uploadPhoto', upload.single('photo'), (req, res, next) => {
  if (req.session.userfunction === 0 || req.session.userfunction === 1) {
    //连接数据库
    let mysql = require('mysql')
    let connection = mysql.createConnection({
      host: 'cdb-0yzjn1q8.bj.tencentcdb.com',
      port: '10073',
      user: 'root',
      password: '5426416zdp10467',
      database: 'myWeb'
    })
    console.log(req.file.path)
    let picture_Id = +new Date()
    let upload_time = req.body.upload_time
    let user_name = req.body.user_name
    let picture_size = req.body.picture_size
    let picture_description = req.body.picture_description
    let taken_time = req.body.taken_time
    const reg = /\\/g
    let picture_content = req.file.path.replace(reg, '/') + fileName
    const sql = `insert into pictures (picture_Id,upload_time,user_name,picture_size,picture_description,taken_time,picture_content) values ('${picture_Id}','${upload_time}','${user_name}','${picture_size}','${picture_description}','${taken_time}','${picture_content}')`
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

//获取评论
router.get('/comments', (req, res, next) => {
  if (req.session.username) {
    //连接数据库
    let mysql = require('mysql')
    let connection = mysql.createConnection({
      host: 'cdb-0yzjn1q8.bj.tencentcdb.com',
      port: '10073',
      user: 'root',
      password: '5426416zdp10467',
      database: 'myWeb'
    })
    const picture_Id = req.query.picture_Id
    const sql = `SELECT * FROM comments where picture_Id ="${picture_Id}"ORDER BY comment_date DESC`
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

// 创建评论
router.post('/createComment', (req, res, next) => {
  if (req.session.userfunction === 0 || req.session.userfunction === 1) {
    //连接数据库
    let mysql = require('mysql')
    let connection = mysql.createConnection({
      host: 'cdb-0yzjn1q8.bj.tencentcdb.com',
      port: '10073',
      user: 'root',
      password: '5426416zdp10467',
      database: 'myWeb'
    })
    let comment_Id = +new Date()
    let user_name = req.body.user_name
    let comment_content = req.body.comment_content
    let comment_date = req.body.comment_date
    let picture_Id = req.body.picture_Id
    const sql = `insert into comments (comment_Id,user_name,comment_content,comment_date,picture_Id) values ('${comment_Id}','${user_name}','${comment_content}','${comment_date}','${picture_Id}')`
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

// 删除评论
router.post('/deleteComment', (req, res, next) => {
  if (req.session.userfunction === 0) {
    //连接数据库
    let mysql = require('mysql')
    let connection = mysql.createConnection({
      host: 'cdb-0yzjn1q8.bj.tencentcdb.com',
      port: '10073',
      user: 'root',
      password: '5426416zdp10467',
      database: 'myWeb'
    })
    let comment_Id = req.body.comment_Id
    const sql = `delete from comments where comment_Id = '${comment_Id}'`
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

//删除照片
router.post('/deletePhoto', (req, res, next) => {
  if (req.session.userfunction === 0) {
    //连接数据库
    let mysql = require('mysql')
    let connection = mysql.createConnection({
      host: 'cdb-0yzjn1q8.bj.tencentcdb.com',
      port: '10073',
      user: 'root',
      password: '5426416zdp10467',
      database: 'myWeb'
    })
    let picture_Id = req.body.picture_Id
    const sql = `delete from pictures where picture_Id = '${picture_Id}'`
    connection.query(sql, (err, result) => {
      if (err) {
        res.sendStatus(500)
      } else {
        let data = result
        res.send(data)
      }
    })
    connection.end()
  } else {
    res.sendStatus(500)
  }
})

//获取用户列表
router.get('/users', (req, res, next) => {
  if (req.session.userfunction === 0 || req.session.userfunction === 1) {
    //连接数据库
    let mysql = require('mysql')
    let connection = mysql.createConnection({
      host: 'cdb-0yzjn1q8.bj.tencentcdb.com',
      port: '10073',
      user: 'root',
      password: '5426416zdp10467',
      database: 'myWeb'
    })
    const sql = `SELECT * FROM users`
    connection.query(sql, (err, result) => {
      if (err) {
        console.log('err')
        res.sendStatus(500)
      } else {
        res.send(result)
      }
    })
    connection.end()
  } else {
    res.sendStatus(500)
  }
})

// 创建账号
router.post('/createUser', (req, res, next) => {
  if (req.session.userfunction === 0) {
    //连接数据库
    let mysql = require('mysql')
    let connection = mysql.createConnection({
      host: 'cdb-0yzjn1q8.bj.tencentcdb.com',
      port: '10073',
      user: 'root',
      password: '5426416zdp10467',
      database: 'myWeb'
    })
    let username = req.body.username
    let password = req.body.password
    let user_function = req.body.user_function
    const sql = `insert into users (user_name,user_password,user_function) values ('${username}','${password}','${user_function}')`
    connection.query(sql, (err, result) => {
      if (err) {
        res.send(err)
      } else {
        res.send({
          user_name: username,
          user_password: password,
          user_function: user_function
        })
      }
    })
    connection.end()
  } else {
    res.send(500)
  }
})

//修改信息
router.post('/changeInfo', (req, res, next) => {
  if (req.session.userfunction === 0) {
    //连接数据库
    let mysql = require('mysql')
    let connection = mysql.createConnection({
      host: 'cdb-0yzjn1q8.bj.tencentcdb.com',
      port: '10073',
      user: 'root',
      password: '5426416zdp10467',
      database: 'myWeb'
    })
    let username = req.body.username
    let password = req.body.password
    let user_function = req.body.user_function
    const sql = `update users set user_password = '${password}',user_function = '${user_function}' where user_name='${username}'`
    connection.query(sql, (err, result) => {
      if (err) {
        res.send(err)
      } else {
        res.send({
          user_name: username,
          user_password: password,
          user_function: user_function
        })
      }
    })
    connection.end()
  } else {
    res.send(500)
  }
})

//删除账号
router.get('/deleteUser', (req, res, next) => {
  if (req.session.userfunction === 0) {
    //连接数据库
    let mysql = require('mysql')
    let connection = mysql.createConnection({
      host: 'cdb-0yzjn1q8.bj.tencentcdb.com',
      port: '10073',
      user: 'root',
      password: '5426416zdp10467',
      database: 'myWeb'
    })
    console.log(req.query)
    const sql = `DELETE FROM users WHERE user_name='${req.query.username}'`
    connection.query(sql, (err, result) => {
      if (err) {
        res.sendStatus(500)
      } else {
        console.log('deletedusername' + req.query.username)
        res.send(req.query.username)
      }
    })
    connection.end()
  } else {
    res.sendStatus(500)
  }
})

module.exports = router
