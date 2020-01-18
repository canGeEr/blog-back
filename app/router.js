'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  //加载首页
  router.get('/', controller.index.index);
  //博文图片上传
  router.post('/article/saveImage', controller.article.saveImage);
  //博文上传
  router.post('/article/saveArticle', controller.article.saveArticle);
  //注册
  router.post('/user/register', controller.user.register);
  //登入
  router.post('/user/login', controller.user.login);
};
