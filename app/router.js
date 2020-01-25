'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  /**
   * 
   * 渲染数据
   */
  //博文获取
  router.get('/article/getArticleById', controller.article.getArticleById);
  //加载首页
  router.get('/', controller.index.index);

  //首页加载博文列表
  router.post('/article/getArticlesInFo', controller.article.getArticlesInFo);

  /**
   * 博客内容处理
   */
  //博文图片上传
  router.post('/article/saveImage', controller.article.saveImage);
  //博文保存
  router.post('/article/saveArticle', controller.article.saveArticle);
  
  

  /*
   * 登入 注册
   */
  //注册
  router.post('/user/register', controller.user.register);
  //登入
  router.post('/user/login', controller.user.login);

  /* 
   * 用户
   */
  //获取用户全表
  router.post('/user/getUsers', controller.user.getUsers);
  //删除用户
  router.post('/user/delUserById', controller.user.delUserById);
  //许可用户权限
  router.post('/user/editUserGrade', controller.user.editUserGrade);
  //修改用户权限
};
