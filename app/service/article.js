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
            on A.user_id = U.id and A.status = '1' and U.status = '1'  ` 
        )
    }

    async getArticleById(id) {
        const {app} = this;
        return await app.mysql.get('blog_article', {
            id: id
        })
    }

    async getArticlesByPageId(limit, offset) {
        const {app} = this;
        const recordsCount = (await app.mysql.query(' select count(*) as count from blog_article '))[0].count;
        let pages = recordsCount / limit
        pages = recordsCount % limit ? Math.floor(pages) + 1 : pages
    
        const articleInFo = await app.mysql.query(`select A.id, title, U.username as author ,  A.status 
            from blog_article A inner join blog_user U 
            on A.user_id = U.id  limit ${limit} offset ${offset}
        `)
        
        return {
            articleInFo,
            pages
        }
    }

    //更改
    async updateArticle(newArticleInFo){
        const { app } = this;
        //根据id查找
        return await app.mysql.update('blog_article',newArticleInFo);
    }
      
      //删
    async delArticleById(id) {
        const {app} = this;
        return await app.mysql.delete('blog_article', {
            id
        })
    }
}

module.exports = ArticleService;