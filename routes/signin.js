const express = require('express')
const router = express.Router()
const useMongoose = require('../apis/useMongoose')
const model = useMongoose.getModel()
const useCrypto = require('../apis/useCrypto')

router.get('/', (req, res, next) => {
  if (req.session.signin) res.redirect('/details')
  else {
    res.status(200)
    res.type('text/html')
    res.render('signin.ejs')
  }
})

router.post('/signin', async (req, res, next) => {
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
        result.msg = '/details'
        req.session.signin = true
        req.session.username = username
      }
      else {
        result.success = false
        result.msg = 'The password isn\'t correct!'
      }
    }
  } catch (err) {
    var err = new Error('查找数据库出错')
    err.status = 500
    next(err)
  }
  
  res.status(200)
  res.type('application/json')
  res.send(result)
})

router.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.locals.message = err.message
  res.locals.status = res.status
  res.render('error.ejs')
})

module.exports = router
