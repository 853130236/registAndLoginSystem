const async = require('async')

let checkWhichProperty = (obj) => {
  if (obj.hasOwnProperty('username')) return 'username'
  if (obj.hasOwnProperty('password')) return 'password'
  if (obj.hasOwnProperty('verify'))   return 'verify'
  if (obj.hasOwnProperty('id'))       return 'id'
  if (obj.hasOwnProperty('phone'))    return 'phone'
  if (obj.hasOwnProperty('email'))    return 'email'
}

let checkWhichFormat = (obj) => {
  if (obj.hasOwnProperty('username')) return /^[a-zA-Z][a-zA-Z0-9_]{5,17}$/
  if (obj.hasOwnProperty('password')) return /^[a-zA-Z0-9_-]{6,12}$/
  if (obj.hasOwnProperty('id'))       return /^[1-9][0-9]{7}$/
  if (obj.hasOwnProperty('phone'))    return /^[1-9][0-9]{10}$/
  if (obj.hasOwnProperty('email'))    return /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
}

module.exports = {
  checkWhetherIsEmpty: (obj) => {
    if (obj[checkWhichProperty(obj)] == '') {
      session[checkWhichProperty(obj) + 'Pass'] = false
      return {
        'success': false,
        'msg': checkWhichProperty(obj) + ' can\'t be empty',
        'property': checkWhichProperty(obj)
      }
    }
    return {'success': true, 'property': checkWhichProperty(obj)}
  },
  checkWhetherIsFormatbale: (obj, session) => {
    if (checkWhichProperty(obj) == 'verify') {
      if (session.password != obj.verify) {
        session[checkWhichProperty(obj) + 'Pass'] = false
        return {
          'success': false,
          'msg': 'verify should be same with the password',
          'property': checkWhichProperty(obj)
        }
      }
    } else {
      if (!checkWhichFormat(obj).test(obj[checkWhichProperty(obj)])) {
        session[checkWhichProperty(obj) + 'Pass'] = false
        return {
          'success': false,
          'msg': 'The format of ' + checkWhichProperty(obj) + ' is not satisfiable',
          'property': checkWhichProperty(obj)
        }
      }
    }

    if (checkWhichProperty(obj) == 'password') session.password = obj.password
    return {'success': true, 'property': checkWhichProperty(obj)}
  },
  checkWhetherIsExist: async (obj, model, session) => {
    if (checkWhichProperty(obj) != 'password' && checkWhichProperty(obj) != 'verify' ) {
      try {
        let property = checkWhichProperty(obj)
        let tempData = {}
        tempData[property] = obj[checkWhichProperty(obj)]
        let docs = await model.findOne(tempData)
        if (docs) {
          session[checkWhichProperty(obj) + 'Pass'] = false
          return ({
            'success': false,
            'msg': checkWhichProperty(obj) + ' already exists',
            'property': checkWhichProperty(obj)
          })
        }
      } catch (err) {
        console.log(err)
      }
    }
    session[checkWhichProperty(obj) + 'Pass'] = true
    return {'success': true, 'property': checkWhichProperty(obj)}
  }
}