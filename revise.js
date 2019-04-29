const AV = require('leancloud-storage')
const { getPostsByDir, getPostsByReptile } = require('./posts')

AV.init({
  appId: 'GxfYzf5roQxLdedcwOheEnWE-gzGzoHsz',
  appKey: 'MomkTz6Tq1aBGWvzNDSv8o31'
})

// 通过本地目录获取 设置成 hexo目录的 public/posts 地址
// const postDir = '/Users/tyb/workspace/blog/public/posts'
// const postList = getPostsByDir(postDir)

// 通过爬虫获取文章标题和链接
// hexo站点链接 本地可以用 hexo server 启动 设置成 http://localhost:4000
const domain = 'https://leotian.cn'
const postList = getPostsByReptile(domain)

Promise.resolve(postList).then(result => {
  result.forEach((post) => {
    // 查询同一标题下的所有记录
    const query = new AV.Query('Counter')
    query.equalTo('title', post.postTitle)

    // 留下times最多的一个 修改url 并修改其他脏数据url
    query.find().then((results) => {
      let maxResult = results[0]
      results.forEach((result) => {
        if(result.attributes.time > maxResult.attributes.time) maxResult = result
      })
      maxResult.set('url', `/posts/${post.abbrLink}/`)
      maxResult.save()

      console.log(maxResult)

      // 更改短链后有一些新的访问 属于脏数据 把他们的链接修改错误来解除关联关系
      results.forEach((result) => {
        if(result.attributes.url === maxResult.attributes.url && result.id !== maxResult.id) {
          result.set('url', `/posts/${post.abbrLink}`)
          result.save()
        }
      })
    })
  })
})
