const express = require('express')
const app = express()
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

let db = mongoose.connect('mongodb://localhost:27017/users', {useMongoClient: true})  //  使用数据库users

db.on('error', (error) => {
    console.log('数据库连接失败：' + error)
})
db.on('open', () => {
    console.log('------数据库连接成功！------')
})

let usersSchema = new mongoose.Schema({
    username: {type: String},
    password: {type: String},
    key:      {type: String},
    id:       {type: String},
    phone:    {type: String},
    email:    {type: String}
}, {collection: 'col'})       //  使用集合col

let usersModel = mongoose.model('Model', usersSchema)

module.exports = {
  getDb: () => {
    return db
  },
  getSchema: () => {
    return usersSchema
  }, 
  getModel: () => {
    return usersModel
  }
}
