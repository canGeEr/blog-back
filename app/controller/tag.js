'use strict';

const Controller = require('egg').Controller;

class TagController extends Controller {
  //front-show
  async getFrontTags() {
    const {ctx, app, service} = this;
    const tags = await service.tag.getTags({status: '1'}, {status: '1'});
    ctx.body = {
      success: true,
      tags
    } 
  }
  //back-manage
}

module.exports = TagController;
