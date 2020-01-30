'use strict';

const Service = require('egg').Service;

class TagService extends Service {
    //初始化标签列表 前台
   async getTags(bool) {
    const {app} = this
    let flag = null;
    switch(bool) {
        case 'front' : flag = true;
            break;
        case 'back' : flag =  false ;
            break;
        default : throw new Error('传入的参数要是 front 或者 back ');
            break;
    }

    const tagClassesWhere= {

    }
    flag ? tagClassesWhere.status = '1' : null;
    const tagClasses = await app.mysql.select('blog_tagclass',{
        where: tagClassesWhere
    });

    const tagRoot = {}
    const tagClassesLength = tagClasses.length;
    for(let i=0; i<tagClassesLength; i++) {
        const tagclass = tagClasses[i];
        const tagRootWhere = {
            'class_id': tagclass.id,
        }
        flag ? tagRootWhere.status = '1' : null;
        tagRoot[tagclass.name] =  await app.mysql.select('blog_tag', {
            where: tagRootWhere
        })
    }
    return tagRoot
   }
}

module.exports = TagService;
