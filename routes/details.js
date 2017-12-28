const express = require('express')
const router = express.Router()
const useMongoose = require('../apis/useMongoose')
const model = useMongoose.getModel()

router.get('/', async (req, res, next) => {
  res.status(200)
  res.type('text/html')
  if (req.session.signin) {
    try {
      let docs = await model.findOne({'username': req.session.username})
      res.render('details.ejs', {'username': docs.username, 'id': docs.id, 'email': docs.email, 'phone': docs.phone, 'msg': docs.msg})
      return
    } catch (err) {}
  }
  res.render('details.ejs')
})

router.post('/exit', (req, res, next) => {
  delete req.session.signin 
  delete req.session.username 
  res.status(200)
  res.send()
})

module.exports = router
