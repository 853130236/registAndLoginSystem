const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.status(200)
  res.type('text/html')
  res.render('details.hbs', {'username': req.query.username, 'id': req.query.id, 'email': req.query.email, 'phone': req.query.phone, 'msg': req.session.msg})
})

router.post('/exit', (req, res, next) => {
  req.session.signin = false
  req.session.username = ''
  req.session.msg = ''

  res.status(200)
  res.send()
})

module.exports = router
