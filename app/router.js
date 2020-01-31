'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.index.index)
  

  //博主操作
  //博主获取自己文章
  router.post('/blogger/article', controller.article.getUserArticlesByPageId);


  /**
   * 
   * 渲染数据
   */
  //博文获取
  router.get('/article/getArticleById', controller.article.getArticleById);
  
  //标签页获取
  router.post('/tags', controller.tag.getFrontTags);

  //首页加载博文列表
  router.post('/article/getArticlesInFo', controller.article.getArticlesInFo);

  /**
   * 博客内容处理
   */
  //博文图片上传
  router.post('/article/saveImage', controller.article.saveImage);
  //博文保存
  router.post('/article/saveArticle', controller.article.saveArticle);
  //修改文章权限
  router.post('/user/editArticlePermission', controller.article.editArticlePermission);
  //分页获取文章信息
  router.post('/article/getArticlesByPageId', controller.article.getArticlesByPageId);
  

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
  //获取用户全表 ,暂时移除 router.post('/user/getUsers', controller.user.getUsers);
  //删除用户
  router.post('/user/delUserById', controller.user.delUserById);
  //修改用户权限
  router.post('/user/editUserPermission', controller.user.editUserPermission);
  //分页获取用户信息
  router.post('/user/getUsersByPageId', controller.user.getUsersByPageId);
};
