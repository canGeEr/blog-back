'use strict';

const Service = require('egg').Service;
const path = require('path')
const fs = require('fs');
class ArticleService extends Service {
    //保存为草稿,一旦点击编写文章
    async saveArticle(articleInFo) {
        const { app } = this;
        articleInFo['create_time'] = app.newStrTime();
        articleInFo['edit_time'] = app.newStrTime();
        return await app.mysql.insert('blog_article', articleInFo);
    }
    async getArticles() {
        const { app } = this;
        return await app.mysql.query(`
            select A.id , U.username as author, tags, look_times, hit_times, title, create_time 
            from blog_article A inner join blog_user U 
            on A.user_id = U.id `
        )
    }
    async getArticleById(id) {
        const {app} = this;
        return await app.mysql.get('blog_article', {
            id: id
        })
    }
}

module.exports = ArticleService;