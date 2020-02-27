// var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var session = require('express-session')
import bodyParser from 'body-parser'
var cors = require('cors')

var indexRouter = require('./routes/index')

var app = express()

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST'],
    alloweHeaders: ['Conten-Type', 'Authorization'],
    credentials: true
  })
)
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(
  session({
    secret: 'keyboard cat',
    esave: true,
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
