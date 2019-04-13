const cheerio = require('cheerio');
const fs = require('fs');
const AV = require('leancloud-storage');

AV.init({
  appId: 'GxfYzf5roQxLdedcwOheEnWE-gzGzoHsz', 
  appKey: 'MomkTz6Tq1aBGWvzNDSv8o31'
});

const postDir = '/Users/tyb/workspace/blog/public/posts'

const list = fs.readdirSync(postDir)

list.forEach((filename) => {
  // 从本地文件获取html
  const html = fs.readFileSync(`${postDir}/${filename}/index.html`).toString()

  // 加载html 获取title
  const $ = cheerio.load(html)
  const postTitle = $(".post-title").text()

  // 查询同一标题下的所有记录
  const query = new AV.Query('Counter');
  query.equalTo('title', postTitle)

  // 留下times最多的一个 修改url 并删除其他脏数据
  query.find().then((result) => {
    console.log(results)
    // result.set('url', `/posts/${filename}/`)
    // result.save()
  });
})
