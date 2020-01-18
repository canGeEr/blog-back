/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
const path = require('path')
const os = require('os')
const mysql = require('./config/database');
const session = require('./config/session');
const middleware = require('./config/middleware');
const whitelist = require('./config/whitelist ');
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '1234567890';

  //cookies存储一天 单位是毫秒
  config.maxAge = 600 * 600 * 24;

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  const security = {
    // 关闭csrf验证
    csrf: {
      enable: false,
    },
    // 白名单
    domainWhiteList: ['*']
  };


  //配置渲染模板
  const view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.html': 'nunjucks',
    },
  }

  const filePath = {
    'article_md': 'app/public/upload/article/md',
    'article_images': 'app/public/upload/article/images',
    'head_portrait': 'app/public/upload/head_portrait'
  }

  

  //文件上传
  const multipart = {
    mode: 'file',
    //白名单
    whitelist
  };

  return {
    ...config,
    ...userConfig,
    mysql,
    session,
    middleware,
    security,
    view,
    multipart,
    filePath
  };
};
