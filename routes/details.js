const express = require('express')
const router = express.Router()
const useMongoose = require('../apis/useMongoose')
const model = useMongoose.getModel()

router.get('/', async (req, res, next) => {
  res.status(200)
  res.type('text/html')
  if (typeof req.session.signin == 'undefined') 
    req.session.signin = false
  if (req.session.signin) {
    try {
      let docs = await model.findOne({'username': req.session.username})
      res.render('details.hbs', {'username': docs.username, 'id': docs.id, 'email': docs.email, 'phone': docs.phone, 'msg': docs.msg})
      return
    } catch (err) {}
  }
  res.render('details.hbs')
})

router.post('/exit', (req, res, next) => {
  req.session.signin = false
  req.session.username = ''
  req.session.msg = ''
  res.status(200)
  res.send()
})

module.exports = router
