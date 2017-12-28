const express = require('express')
const app = express()
const path = require('path')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const useMongoose = require('./apis/useMongoose')
const db = useMongoose.getDb()
const session = require('express-session')
const cookieParser = require('cookie-parser')
const crypto = require('crypto')
const MongoStore = require('connect-mongo')(session)
const details = require('./routes/details')
const regist = require('./routes/regist')
const signin = require('./routes/signin')


app.set('views', path.join(__dirname, '/views'))
app.use(express.static(__dirname + '/public'))

app.set('view engine', 'html')
app.engine('html', ejs.__express)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(cookieParser())

app.use(session({
  secret: crypto.randomBytes(16).toString('hex'),
  cookie: {maxAge: 60 * 1000 * 30},
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({   
      mongooseConnection: db
  })
}))

app.use('/', signin)
app.use('/regist', regist)
app.use('/details', details)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('error.ejs', {"message": err.message, "status": err.status})
})

module.exports = app
