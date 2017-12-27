一: 目录介绍
* apis
  | 文件             | 作用                      |
  | -------------- | :---------------------- |
  | judgeRegist.js | 判断注册时输入的信息是否符合标准以及是否已存在 |
  | useCrypto.js   | 密码加密和密码验证               |
  | useMongoose.js | 使用Mongoose              |

* bin
  | 文件   | 作用   |
  | ---- | :--- |
  | www  | 启动项目 |

* public
  | 文件          | 作用               |
  | ----------- | :--------------- |
  | images      | 存放前端图片           |
  | javascripts | 存放前端javascript文件 |
  | stylese     | 存放前端css文件        |

* routes
  | 文件         | 作用            |
  | ---------- | :------------ |
  | details.js | /details路径的路由 |
  | regist.js  | /regist路径的路由  |
  | signin.js  | /signin路径的路由  |

* views
  | 文件          | 作用              |
  | ----------- | :-------------- |
  | details.hbs | /details路径的渲染模板 |
  | regist.hbs  | /regist路径的渲染模板  |
  | signin.hbs  | /signin路径的渲染模板  |
  | error.hbs   | 错误路径的渲染模板       |

* app.js: 中间件文件

二. 访问
```
npm start启动服务器监听8000端口
localhost:8000/为登录和注册系统的首页
```





