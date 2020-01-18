'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  //传入姓名，并返回相应的信息
  async checkname(username) {
    const { app } = this;
    const userInFo = await app.mysql.get('blog_user', {username: username});
    return userInFo;
  }

  //登入更新登入时间
  async updateLoginTime(id){
    const { app } = this;
    //根据id查找
    return await app.mysql.update('blog_user',{id, 'login_time': app.getTime()});
  }
  
  //传入姓名和密码并保存
  async register(registerInFo) {
    const { app } = this;
    return await app.mysql.insert('blog_user', {
      username: registerInFo.username,
      password: registerInFo.password,
      email: registerInFo.email,
      'register_time': app.getTime() ,
      //默认等级为0
      grade: '0',
      //默认可以登入,用户可用
      status: '1'
    })
  }

  //传入姓名查询更新 =》 密码，status
  async registerSoft(id, password, email){
    const { app } = this;
    //根据id查找
    return await app.mysql.update('blog_user',{id, status: '1', password, email});
  }
}

module.exports = UserService;
