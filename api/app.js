// var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var session = require('express-session')

var cors = require('cors')

var indexRouter = require('./routes/index')
var bodyParser = require('body-parser')

var app = express()
app.use(
  cors({
    origin: [
      'http://zhoudapeng467.com',
      'http://118.89.63.17:80',
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 3600,
    credentials: true
  })
)
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(
  session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  })
)

app.use('/api', indexRouter)

app.use(express.static(path.join(__dirname, 'public')))
app.use('/root/api/public/', express.static(path.join(__dirname, 'public')))
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404))
// })

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message
//   res.locals.error = req.app.get('env') === 'development' ? err : {}

// render the error page
//   res.status(err.status || 500)
//   res.render('error')
// })

module.exports = app
