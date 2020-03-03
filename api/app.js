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
      'http://116.237.119.145:3000',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://172.16.0.11'
    ],
    methods: ['GET', 'POST'],
    alloweHeaders: ['Conten-Type', 'Authorization'],
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
