'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  //传入姓名，并返回相应的信息
  async checkname(username) {
    const { app } = this;
    const userInFo = await app.mysql.get('blog_user', {username: username});
    return userInFo;
  }

  async getUsers(limit, offset) {
    const {app} = this;
    //这里减了admin的一条
    const recordsCount = (await app.mysql.query(' select count(*) as count from blog_user '))[0].count - 1;
    
    let pages = recordsCount / limit
    pages = recordsCount % limit ? Math.floor(pages) + 1 : pages

    const usersInFo = await app.mysql.query(`select id, username,grade, legal, status from
      blog_user where id != 1 limit ${limit} offset ${offset}
    `)

    return {
      usersInFo,
      pages
    }
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
