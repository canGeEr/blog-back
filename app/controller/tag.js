'use strict';

const Controller = require('egg').Controller;

class TagController extends Controller {
  async getFrontTags() {
    const {ctx, app, service} = this;
    const data = await service.tag.getTags('front');
    ctx.body = data
  }
}

module.exports = TagController;
