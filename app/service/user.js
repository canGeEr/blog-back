'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  //传入姓名，并返回相应的信息
  async checkname(username) {
    const { app } = this;
    const userInFo = await app.mysql.get('blog_user', {username: username});
    return userInFo;
  }

  async getUsers() {
    const {app} = this;
    return await app.mysql.select('blog_user', {
      where: {status: '1'},
      columns: ['id', 'username', 'legal', 'grade', 'email', 'fans']
    });
  }

  //改
  async updateUser(newUserInFo){
    const { app } = this;
    //根据id查找
    return await app.mysql.update('blog_user',newUserInFo);
  }
  
  //增
  async register(registerInFo) {
    const { app } = this;
    return await app.mysql.insert('blog_user', registerInFo);
  }

  //删
  async delUserById(id) {
    const {app} = this;
    return await app.mysql.delete('blog_user', {
      id
    })
  }
}

module.exports = UserService;
