'use strict';

const Service = require('egg').Service;



class TagService extends Service {

    //获取标签树
    async getTags(tagClassWhere, tagWhere) {
        const {
            app
        } = this
        //设置默认标签类的条件
        const TAG_CLASS_DEFAULT_WHERE = {};
        app.extendForce(TAG_CLASS_DEFAULT_WHERE, tagClassWhere);
        // 查询标签类
        const tagClasses = await app.mysql.select('blog_tagclass', {
            where: TAG_CLASS_DEFAULT_WHERE
        });
        //组合成标签树
        const tagRoot = {}
        for (let [key, value] of tagClasses.entries()) {
            const tagclass = value;

            const TAG_DEFAULT_WHERE = {
                'class_id': tagclass.id,
            }
            app.extendForce(TAG_DEFAULT_WHERE, tagWhere)

            tagRoot[tagclass.name] = await app.mysql.select('blog_tag', {
                where: TAG_DEFAULT_WHERE
            })
        }
        return tagRoot
    }
}

module.exports = TagService;