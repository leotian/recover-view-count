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

  // 留下times最多的一个 修改url 并修改其他脏数据url
  query.find().then((results) => {
    let maxResult = results[0]
    results.forEach((result) => {
      if(result.attributes.time > maxResult.attributes.time) maxResult = result
    })
    maxResult.set('url', `/posts/${filename}/`)
    maxResult.save()
    console.log(maxResult)
    results.forEach((result) => {
      if(result.attributes.url === maxResult.attributes.url && result.id !== maxResult.id) {
        result.set('url', `/posts/${filename}`)
        result.save()
      }
    })
  });
})
