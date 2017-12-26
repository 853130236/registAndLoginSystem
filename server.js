const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs')
const bodyParser = require('body-parser')
const useMongoose = require('./useMongoose')
const model = useMongoose.getModel()
const db = useMongoose.getDb()
const session = require('express-session')
const cookieParser = require('cookie-parser')
const crypto = require('crypto')
const judgeRegist = require('./judgeRegist')
const useCrypto = require('./useCrypto')
const MongoStore = require('connect-mongo')(session)

app.set('port', process.env.PORT || 8000)


app.set('views', path.join(__dirname + '/public'))
app.use(express.static(__dirname + '/public'))

app.set('view engine', 'html')
app.engine('html', hbs.__express)

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

app.get('/', (req, res) => {
  if (req.session.signin) {
    model.findOne({'username': req.session.username}, (err, docs) => {
      if (docs) {
        if (req.query.username != req.session.username && req.query.username) {
          req.session.msg = 'You can just access your details!'
          res.redirect('/details?username=' + docs.username + '&id=' + docs.id + '&phone=' + docs.phone + '&email=' + docs.email)
        }
        else res.redirect('/details?username=' + docs.username + '&id=' + docs.id + '&phone=' + docs.phone + '&email=' + docs.email)
      }
    }) 
  }
  else {
    res.status(200)
    res.type('text/html')
    res.render('hbs/signin.hbs')
  }
})

app.post('/signin', async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  let result = {} 

  try {
    let docs = await model.findOne({'username': username})

    if (!docs) {
      result.success = false
      result.msg = 'Couldn\'t find this username'
    }
    else {
      result.success = true
      result.key = docs.key
      docs = await model.findOne({'username': username, 'password': useCrypto.check(password, result.key)})
      if (docs) {
        result.msg = '/details?username=' + username + '&id=' + docs.id + '&phone=' + docs.phone + '&email=' + docs.email
        req.session.signin = true
        req.session.username = username
      }
      else {
        result.success = false
        result.msg = 'The password isn\'t correct!'
      }
    }
  } catch (err) {}
  
  res.status(200)
  res.type('application/json')
  res.send(result)
})

app.get('/details', (req, res) => {
  res.status(200)
  res.type('text/html')
  res.render('hbs/details.hbs', {'username': req.query.username, 'id': req.query.id, 'email': req.query.email, 'phone': req.query.phone, 'msg': req.session.msg})
})

app.post('/details/exit', (req, res) => {
  req.session.signin = false
  req.session.username = ''
  req.session.msg = ''
  req.session.password = ''
  req.session.usernamePass = req.session.passwordPass = req.session.verifyPass 
    = req.session.idPass = req.session.phonePass = req.session.emailPass

  res.status(200)
  res.send()
})

app.get('/regist', (req, res) => {
  res.status(200)
  res.type('text/html')
  req.session.password = ''
  res.render('hbs/regist.hbs')
})

app.post('/regist/judge', async (req, res) => {
  res.status(200)
  res.type('application/json')
  let result = judgeRegist.checkWhetherIsEmpty(req.body, req.session)
  if (!result.success) {
    res.send(result)
    return
  }

  result = judgeRegist.checkWhetherIsFormatbale(req.body, req.session)
  if (!result.success) {
    res.send(result)
    return
  }

  try {
    result = await judgeRegist.checkWhetherIsExist(req.body, model, req.session)
  } catch (err) {
    console.log(err)
  }
  res.send(result)
})

app.post('/regist/pass', async (req, res) => {
  res.status(200)
  res.type('application/json')
  if (req.session.usernamePass && req.session.passwordPass && req.session.verifyPass 
    && req.session.idPass && req.session.phonePass && req.session.emailPass) {
    await model.create({
      'username': req.body.username,
      'password': req.body.password,
      'id':       req.body.id,
      'phone':    req.body.phone,    
      'email':    req.body.email
    })
    req.session.signin = true
    req.session.username = req.body.username
    res.send({'success': true}) 
    return 
  } 
    
  res.send({'success': false, 'msg': 'You should provide correct information'})
})

let server = app.listen(app.get('port'), () => {   
  let port = server.address().port
  console.log('访问的端口号是: %s', port)
})