'use strict';

const Controller = require('egg').Controller;
const fs = require('mz/fs');
const path = require('path');
const icon = require('iconv-lite');

class ArticleController extends Controller {
    async saveImage() {
        const {
            ctx,
            service,
            config,
            app
        } = this;
        const fileInFo = ctx.request.files[0];
        if (fileInFo) {
            const filePath = app.uploadOne('article_images', fileInFo, ctx);
            const relativesPath = path.relative('app', filePath).replace(/\\/g, '/');
            ctx.body = {
                success: true,
                path: relativesPath
            }
        } else {
            ctx.body = {
                success: false,
            }
        }

    }

    async saveArticle() {
        const {
            ctx,
            service,
            config,
            app
        } = this;
        const inFo = ctx.request.body;
        const userInFo = await service.user.checkname(inFo.username);
        if (userInFo) {
            const articleInFo = {};
            const filename = app.saveMd('article_md',  inFo.title, inFo.content);
            console.log(filename) 
            articleInFo['author_id'] = userInFo.id;
            articleInFo.title = inFo.title;
            articleInFo.tags = inFo.tags ? JSON.stringify(inFo.tags) : JSON.stringify([]);
            articleInFo.filename = filename;
            articleInFo.images = inFo.images ? JSON.stringify(inFo.images) : JSON.stringify([]);
            await service.article.saveArticle(articleInFo);
            ctx.body = {
                success: true
            }
        }else {
            ctx.body = {
                success: false
            }
        }


    }
}

module.exports = ArticleController;