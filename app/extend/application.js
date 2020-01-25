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
  readFile(savePath, filename) {
    const fillPath = path.join(this.getFilePath(savePath), filename); 
    const content = fs.readFileSync(fillPath, 'utf8');
    return content
  }
  // sessionStore: {
  //   async get(key) {
  //     const res = await app.redis.get(key);
  //     if (!res) return null;
  //     return JSON.parse(res);
  //   },

  //   async set(key, value, maxAge) {
  //     // maxAge not present means session cookies
  //     // we can't exactly know the maxAge and just set an appropriate value like one day
  //     if (!maxAge) maxAge = 24 * 60 * 60 * 1000;
  //     value = JSON.stringify(value);
  //     await app.redis.set(key, value, 'PX', maxAge);
  //   },

  //   async destroy(key) {
  //     await app.redis.del(key);
  //   },
  // }
};