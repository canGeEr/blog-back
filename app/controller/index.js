'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
  async index() {
    const { ctx, app } = this;
    await ctx.render('register.html')
  }
}

module.exports = IndexController;
