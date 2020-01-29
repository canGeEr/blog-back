'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
  async index() {
    const { ctx, app } = this;
    const time = app.newStrTime();
    ctx.body = {
      time
    }
  }
}

module.exports = IndexController;
