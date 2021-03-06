'use strict';

//将大部分复杂文件操作全部转给了APP对象去操作
const Controller = require('egg').Controller;
const path = require('path');
const icon = require('iconv-lite');

class ArticleController extends Controller {
    /**
     * 前台操作
     */

    //保存文章的图片
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
    //删除无用图片
    async delImage() {
        const {
            ctx,
            service,
            config,
            app
        } = this;
        const images = ctx.request.body.images;

        if(images) {
            images.forEach((image)=>{
                const filename = path.basename(image)
                app.delFile('article_images', filename)
            })
        }
        
        ctx.body = {
            success: true
        }

    }

    //保存文章
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
            const filename = app.saveMd('article_md', inFo.title, inFo.content);
            articleInFo['user_id'] = userInFo.id;
            articleInFo.title = inFo.title;
            articleInFo.tags = inFo.tags ? JSON.stringify(inFo.tags) : JSON.stringify([]);
            articleInFo.filename = filename;
            //处理图片逻辑
            // const imagesArr = inFo.images
            // if (imagesArr) {
            //     imagesArr.forEach(item => {
            //         const filename = path.basename(item.path)
            //         if (item.legal === 'false') {
            //             app.delFile('article_images', filename)
            //         } else {
            //             images.push(filename)
            //         }
            //     });
            // }
            let images =null;
            if(inFo.images) {
                images = inFo.images.map((image)=>{
                    return path.basename(image)
                })
            }
            articleInFo.images = images ? JSON.stringify(images) : JSON.stringify([]);
            await service.article.saveArticle(articleInFo);
            ctx.body = {
                success: true
            }
        } else {
            ctx.body = {
                success: false
            }
        }
    }

    //更新文章
    async updateArticle() {
        const {
            ctx,
            service,
            config,
            app
        } = this;
        const inFo = ctx.request.body;

        //通过id拿到对于的filename
        const filename = (await service.article.getArticleById(inFo.id)).filename
        //更新文件md
        app.updateFile('article_md', filename, inFo.content);


        let images =null;
        if(inFo.images) {
            images = inFo.images.map((image)=>{
                return path.basename(image)
            })
        }

        inFo.images = images ? JSON.stringify(images) : JSON.stringify([]);

        delete inFo.content
        
        //标签处理
        inFo.tags = inFo.tags ? JSON.stringify(inFo.tags) : JSON.stringify([]);

        await service.article.updateArticle(inFo);
        ctx.body = {
            success: true
        }
    }

    //前台获取全部文章信息展示
    async getArticlesInFo() {
        const {
            ctx,
            app,
            service
        } = this;
        const articles = await service.article.getArticles();
        ctx.body = {
            success: true,
            articles
        }
    }

    //查看单篇文章
    async getArticleById() {
        const {
            ctx,
            app,
            service
        } = this
        const query = ctx.query;
        const id = query.id
        const articleInFo = await service.article.getArticleById(id)
        const filename = articleInFo.filename
        const content = app.readFile('article_md', filename)

        const images = JSON.parse(articleInFo.images).map((image)=>{
            const filePath = path.join(app.getFilePath('article_images') ,image);
            return  path.relative('app', filePath).replace(/\\/g, '/'); 
        })
        ctx.body = {
            success: true,
            content,
            articleInFo: {
                images: images,
                title: articleInFo.title,
                tags: articleInFo.tags
            }
        }
    }

    // 前台根据用户uId和pId获取分页
    async getUserArticlesByPageId() {
        const {
            ctx,
            app,
            service
        } = this;
        const {
            pId,
            uId
        } = ctx.dataTypeChange(ctx.request.body, 'pId', 'uId');
        const limit = 5;
        const offset = (pId - 1) * limit;
        //如果我们只有两页，但是我们一直打算渲染5页
        const defaultPages = 5;
        const data = await service.article.getArticlesByPageId(limit, offset, {
            uId: `and U.id = ${uId}`,
            columns: [' ','A.look_times', 'A.hit_times']
        })
        const {
            pages,
            articleInFo
        } = data;
        const pagesArr = app.paging(pages, defaultPages, pId, 3)
        ctx.body = {
            success: true,
            articleInFo,
            pages,
            pagesArr
        }
    }


    /**
     *  后台操作
     */
    //分页展示文章
    async getArticlesByPageId() {
        const limit = 5;
        const {
            ctx,
            app,
            service
        } = this;
        const pId = ctx.dataTypeChange(ctx.request.body, 'pId').pId;
        const offset = (pId - 1) * limit;
        //如果我们只有两页，但是我们一直打算渲染5页
        const defaultPages = 5;
        const data = await service.article.getArticlesByPageId(limit, offset)
        const {
            pages,
            articleInFo
        } = data;
        const pagesArr = app.paging(pages, defaultPages, pId, 3)
        ctx.body = {
            success: true,
            articleInFo,
            pages,
            pagesArr
        }
    }

    //后台修改文章权限
    async editArticlePermission() {
        const {
            ctx,
            app,
            service
        } = this;
        const newArticleInFo = ctx.request.body;
        const result = await service.article.updateArticle(newArticleInFo);
        if (result.affectedRows) {
            ctx.body = {
                success: true,
            }
        } else {
            ctx.body = {
                success: false,
            }
        }
    }

    //根据文章id删除文章，注意一起删除文章文件和文章图片
    async delArticleById() {
        //先获取文章信息
        const {ctx, service, app} = this;
        const ids = ctx.request.body.ids;
        let flag = 1;

        for(let value of ids.values()) {
            const id = value;
            
            const articleInFo = await service.article.getArticleById(id);

            if(!articleInFo) {
                ctx.body = {
                    success:false,
                    msg: 'id is not exit'
                }
                return;
            }
    
            //删除
            app.delFile('article_md', articleInFo.filename);
    
            const images = JSON.parse(articleInFo.images);
            images.forEach((image)=>{
                app.delFile('article_images', image);
            })
    
            //删除数据库记录
            const result = await service.article.delArticleById(id);
            if(!result.affectedRows){
                flag = 0;
                break;
            }
        }

        if (flag) {
            ctx.body = {
                success: true,
            }
        } else {
            ctx.body = {
                success: false,
            }
        }
    }


}

module.exports = ArticleController;