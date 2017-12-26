const crypto = require('crypto')

module.exports = {
  encrypt: (content) => {  
    let key = crypto.randomBytes(16).toString('hex')
    let sha1 = crypto.createHmac('sha1', key)
    sha1.update(content)
    let result = sha1.digest().toString('base64') 
    return {'key': key, 'result': result}
  }, 
  check: (content, key) => {
    let sha1 = crypto.createHmac('sha1', key)
    sha1.update(content)
    let result = sha1.digest().toString('base64') 
    return result
  }
}