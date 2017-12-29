const express = require('express')
const router = express.Router()
const judgeRegist = require('../apis/judgeRegist')
const useMongoose = require('../apis/useMongoose')
const model = useMongoose.getModel()
const useCrypto = require('../apis/useCrypto')

router.get('/', (req, res, next) => {
  res.status(200)
  res.type('text/html')

  req.session.usernamePass = false
  req.session.passwordPass = false
  req.session.verifyPass = false
  req.session.idPass = false
  req.session.phonePass = false
  req.session.emailPass = false

  res.render('regist.ejs')
})

router.post('/judge', async (req, res, next) => {
  res.status(200)
  res.type('application/json')
  let result = judgeRegist.checkWhetherIsEmpty(req.body, req.session)
  if (!result.success) 
    return res.send(result)

  result = judgeRegist.checkWhetherIsFormatbale(req.body, req.session)
  if (!result.success) 
    return res.send(result)
    
  try {
    result = await judgeRegist.checkWhetherIsExist(req.body, model, req.session)
  } catch (err) {
    var err = new Error('查找数据库出错')
    err.status = 500
    next(err)
  }
  res.send(result)
})

router.post('/pass', async (req, res) => {
  res.status(200)
  res.type('application/json')

  if (!req.session.usernamePass || !req.session.passwordPass || !req.session.verifyPass 
    || !req.session.idPass || !req.session.phonePass || !req.session.emailPass) {
    res.send({'success': false})
    return 
  }

  let keyAndValue = useCrypto.encrypt(req.body.password)

  await model.create({
    'username': req.body.username,
    'password': keyAndValue.value,
    'key':      keyAndValue.key,
    'id':       req.body.id,
    'phone':    req.body.phone,    
    'email':    req.body.email
  })

  delete req.session.usernamePass
  delete req.session.passwordPass
  delete req.session.verifyPass
  delete req.session.idPass
  delete req.session.phonePass
  delete req.session.emailPass

  req.session.signin = true
  req.session.username = req.body.username
  res.send({'success': true}) 
})

router.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.locals.message = err.message
  res.locals.status = res.status
  res.render('error.ejs')
})

module.exports = router