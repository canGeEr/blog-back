const path = require('path')
const fs = require('fs')
module.exports = {
  // set redis session store
  // session store must have 3 methods
  // define sessionStore in `app.js` so you can access `app.redis`
  newStrTime() {
    return (new Date()).valueOf() + '';
  },
  
  random(round, end) {
    return  Math.floor(Math.random() * round + end);
  },

  getFilePath(pro) {
    return path.resolve(this.config.filePath[pro])
  },

  uploadOne(uploadpath, fileInFo, ctx) {
    const fullname = this.random(100, 1) + this.newStrTime() + fileInFo.filename;
    const fullPath = path.join(this.getFilePath(uploadpath), fullname);
    const file = fs.readFileSync(fileInFo.filepath);
    fs.writeFileSync(fullPath, file)
    ctx.cleanupRequestFiles()
    return fullPath
  },

  uploadMulti(uploadpath, filesInFo, ctx) {
    const filesPath = []
    filesInFo.forEach(fileInFo => {
      const fullPath = this.uploadOne(uploadpath, fileInFo, ctx)
      filesPath.push(fullPath)
    });
    return filesPath
  },

  /* @params savePath 存储路径, filename文件名,  content内容*/
  saveMd(savePath, title, content) {
    const filename = this.random(100, 1) + this.newStrTime() + title + '.md';
    const fillPath = path.join(this.getFilePath(savePath), filename);
    fs.writeFileSync(fillPath, content);
    return filename;
  },

  updateFile(savePath, filename, content) {
    const fillPath = path.join(this.getFilePath(savePath), filename);
    fs.writeFileSync(fillPath, content);
  },

  readFile(savePath, filename) {
    const fillPath = path.join(this.getFilePath(savePath), filename); 
    const content = fs.readFileSync(fillPath, 'utf8');
    return content
  },

  delFile(savePath, filename) {
    const fillPath = path.join(this.getFilePath(savePath), filename);
    try {
      return fs.unlinkSync(fillPath)
    }catch(e) {
      console.log('你要删除的文件不存在');
    }
  },

  //专门为了给分页写的方法  offset 第 位
  paging(pages, defaultPages, p_id, offset) {
    let pagesArr = []; 
    if(offset > defaultPages) throw error('offset 不能超过 defaultPages');
    const rightOffset = defaultPages - offset;
    if(pages <= defaultPages) {
      for(let i=1; i<=pages; i++) {
        pagesArr.push(i)
      }
    }else if(p_id <= offset) {
      for(let i=1; i<=defaultPages; i++) {
        pagesArr.push(i)
      }
    }else if(pages - p_id <= rightOffset -1) {
      for(let i=pages-defaultPages + 1; i<=pages; i++) {
        pagesArr.push(i)
      }
    }else {
      for(let i= p_id - offset + 1; i<= p_id + rightOffset ; i++) {
        pagesArr.push(i)
      }
    }

    return pagesArr
  },


  //暴力传递
  extendForce(targetObj, resourceObj) {
    if(typeof resourceObj !== 'object') return;
    Object.getOwnPropertyNames(resourceObj).forEach((proname, index)=>{
      targetObj[proname] = resourceObj[proname]
    })
  },

  //传递
  extend(targetObj, resourceObj) {
    if(typeof resourceObj !== 'object') return;
    const names = Object.getOwnPropertyNames(resourceObj);
    const namesLength = names.length;
    for(let i=0; i<namesLength; i++ ) {
      const name = names[i];
      if(name in targetObj) continue;
      else targetObj[name] = resourceObj[name]
    }
  }
};