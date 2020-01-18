'use strict';

const Service = require('egg').Service;
const path = require('path')
const fs = require('fs');
class ArticleService extends Service {
    //保存为草稿,一旦点击编写文章
    async saveArticle(articleInFo) {
        const { app } = this;
        articleInFo['create_time'] = app.getTime();
        articleInFo['edit_time'] = app.getTime();
        return await app.mysql.insert('blog_article', articleInFo);
    }
    async joinArticleUser(userInFO) {
        const { app } = this;
        const username = userInFO.name;
        return  await app.mysql.query('select * from blog_article');
    }
}

module.exports = ArticleService;