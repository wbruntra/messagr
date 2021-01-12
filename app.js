var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieSession = require('cookie-session')
var logger = require('morgan')

var app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(
  cookieSession({
    name: 'session',
    keys: ['changeme'],
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  }),
)

const indexRouter = require('./routes')

app.use('/api', indexRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  console.log(err)
  res.send('error!')
})

module.exports = app
