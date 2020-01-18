'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async login() {
    const { ctx, service, config } = this;
    const userInFo = ctx.request.body;
    const sqlUserInFo = await service.user.checkname(userInFo.username);
    if (!sqlUserInFo || sqlUserInFo.status === '0') {
      //用户不存在
      ctx.body = {
        success: false,
        msg: '用户不存在',
      }
    } else if (sqlUserInFo.password === userInFo.password) {
      await service.user.updateLoginTime(sqlUserInFo.id)
      ctx.body = {
        success: true,
        msg: '登入成功',
        userInFo: {
          username: sqlUserInFo.username,
          grade: sqlUserInFo.grade,
          id: sqlUserInFo.id
        }
      }
    }
  }


  async register() {
    //没有进行长度验证，和密码重复验证,移交给前端完成
    const { ctx, service } = this;
    const userInFo = ctx.request.body;
    const sqlUserInFo = await service.user.checkname(userInFo.username);

    if (sqlUserInFo) {
      //用户名已经存在，但是不可用，重新更新
      if (sqlUserInFo.status === '0')
        await service.user.registerSoft(sqlUserInFo.id, userInFo.password, userInFo.email);
    } else {
      await service.user.register({
        username: userInFo.username,
        password: userInFo.password,
        email: userInFo.email
      });
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
}

module.exports = UserController;