'use strict';

const Service = require('egg').Service;
const path = require('path')
const fs = require('fs');
class ArticleService extends Service {
    //*前端方法
    //**保存为草稿,一旦点击编写文章
    async saveArticle(articleInFo) {
        const {
            app
        } = this;
        articleInFo['create_time'] = app.newStrTime();
        articleInFo['edit_time'] = app.newStrTime();
        return await app.mysql.insert('blog_article', articleInFo);
    }

    //前台获取可用文章信息
    async getArticles() {
        const {
            app
        } = this;
        return await app.mysql.query(`
            select A.id , U.username as author, tags, look_times, hit_times, title, create_time 
            from blog_article A inner join blog_user U 
            on A.user_id = U.id and A.status = '1' and U.status = '1' `)
    }

    //根据文章id拿文章信息
    async getArticleById(id) {
        const {
            app
        } = this;
        return await app.mysql.get('blog_article', {
            id: id
        })
    }


    //文章分页
    async getArticlesByPageId(limit, offset, where) {
        const {
            app
        } = this;


        const DEFAULT_WHERE = {
            uId: ``,
            columns: []
        }

        app.extendForce(DEFAULT_WHERE, where)

        //获取总页数
        const recordsCount = (await app.mysql.query(`
                select count(*) as count
                from blog_article A inner join blog_user U
                on A.user_id = U.id  ${DEFAULT_WHERE.uId}
            `))[0].count;

        //得出分页
        const pages = Math.ceil(recordsCount / limit);

        //根据信息获取=数据
        const articleInFo = await app.mysql.query(`
                select A.id, title, U.username as author, A.status ${DEFAULT_WHERE.columns.join(",")}
                from blog_article A inner join blog_user U
                on A.user_id = U.id ${DEFAULT_WHERE.uId} 
                limit ${limit} offset ${offset}
            `)

        return {
            articleInFo,
            pages
        }
    }

    //更改
    async updateArticle(newArticleInFo) {
        const {
            app
        } = this;
        //根据id查找
        return await app.mysql.update('blog_article', newArticleInFo);
    }

    //删
    async delArticleById(id) {
        const {
            app
        } = this;
        return await app.mysql.delete('blog_article', {
            id
        })
    }
}

module.exports = ArticleService;