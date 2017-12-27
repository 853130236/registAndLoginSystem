const express = require('express')
const router = express.Router()
const useMongoose = require('../apis/useMongoose')
const model = useMongoose.getModel()
const useCrypto = require('../apis/useCrypto')


router.get('/', (req, res, next) => {
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
    res.render('signin.hbs')
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

module.exports = router
