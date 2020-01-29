'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async login() {
    const { ctx, service, app } = this;
    const userInFo = ctx.request.body;
    const sqlUserInFo = await service.user.checkname(userInFo.username);
    if (!sqlUserInFo || sqlUserInFo.status === '0') {
      //用户不存在
      ctx.body = {
        success: false,
        msg: '用户不存在',
      }
    } else if (sqlUserInFo.password === userInFo.password) {
      const newUserInFo = {id: sqlUserInFo.id , 'login_time': app.newStrTime()}
      await service.user.updateUser(newUserInFo)
      ctx.body = {
        success: true,
        msg: '登入成功',
        userInFo: {
          username: sqlUserInFo.username,
          grade: sqlUserInFo.grade,
          id: sqlUserInFo.id,
          legal: sqlUserInFo.legal
        }
      }
    }else {
      ctx.body = {
        success: false,
        msg: '密码错误'
      }
    }
  }


  async register() {
    //没有进行长度验证，和密码重复验证,移交给前端完成
    const { ctx, service, app } = this;
    const userInFo = ctx.request.body;
    const sqlUserInFo = await service.user.checkname(userInFo.username);

    if (sqlUserInFo) {
      //用户名已经存在，但是不可用，重新更新
      if (sqlUserInFo.status === '0') {
        const newUserInFo = {
          id: sqlUserInFo.id,
          password: userInFo.password,
          email: userInFo.email,
          status: '1'
        }
        await service.user.updateUser(newUserInFo);
      }
    } else {
      // username, password, email, register_time, legal, grade, status
      const registerInFo = {
        username: userInFo.username,
        password: userInFo.password,
        email: userInFo.email,
        grade: userInFo.grade
      }
      const legal = registerInFo.grade === '1' ? 'N' : 'Y';
      registerInFo['register_time'] = app.newStrTime();
      registerInFo.legal = legal;
      registerInFo.status = '1';
      await service.user.register(registerInFo);
    }
    
    if (sqlUserInFo && sqlUserInFo.status === '1')
      ctx.body = {
        success: false,
        msg: '用户已经存在'
      }
    else
      ctx.body = {
        success: true,
        msg: '注册成功'
      }
  }


  //前台首页渲染数据
  // async getUsers() {
  //   const {ctx, app, service} = this;
  //   let usersInFo = await service.user.getUsers();
  //   usersInFo = usersInFo.filter((item) => {
  //     return item.grade !== '2'
  //   });
  //   ctx.body = {
  //     success: true,
  //     usersInFo
  //   }
  // }

  //后台删除成员
  async delUserById() {
    const {ctx, app, service} = this;
    const ids = ctx.request.body.ids;
    const idsLength = ids.length
    for(let i=0; i<idsLength; i++) {
      await service.user.delUserById(ids[i])
    }
    ctx.body = {
      success: true,
    }
  }

  //后台修改成员信息
  async editUserPermission() {
    const {ctx, app, service} = this;
    const newUserInFo = ctx.request.body;
    const result = await service.user.updateUser(newUserInFo);
    if(result.affectedRows) {
      ctx.body = {
        success: true,
      }
    }else {
      ctx.body = {
        success: false,
      }
    }
  }

  //后台分页
  async getUsersByPageId() {
    const limit = 5;
    const {ctx, app, service} = this;
    const p_id = ctx.dataTypeChange(ctx.request.body, 'id').id; 
    const offset = (p_id - 1) * limit;
    //如果我们只有两页，但是我们一直打算渲染5页
    const defaultPages = 5;
    const data = await service.user.getUsers(limit, offset)
    const {pages, usersInFo} = data;
    const pagesArr = app.paging(pages, defaultPages, p_id, 3)
    ctx.body = {
      success: true,
      usersInFo,
      pages,
      pagesArr
    }
  }
}

module.exports = UserController;