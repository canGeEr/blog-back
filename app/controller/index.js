'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
  async index() {
    const { ctx, app } = this;
    const arr = [1,2,3,4]
    ctx.body = {}
  }
}

module.exports = IndexController;
