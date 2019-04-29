const fs = require('fs')
const axios = require('axios/index')
const cheerio = require('cheerio')

const getPostList = ($) => {
  const postList = []
  // 获取首页标题
  $(".post-title-link").each((i, elem) => {
    postList.push({
      abbrLink: $(elem).attr('href').replace('posts', '').replace(/\//g, ''),
      postTitle: $(elem).text(),
    })
  })
  return postList
}

async function getPostsByReptile(domain) {
  let postList = []
  // 获取总页数
  const homePage = await axios.get(domain)
  const postPages = cheerio.load(homePage.data)(".page-number").last().text()
  // 获取每页的文章标题和链接
  for (let i = 1; i <= postPages; i++) {
    const url = i > 2 ? `${domain}/page/${i}/` : domain
    const html = await axios.get(url)
    const $ = cheerio.load(html.data)
    postList = postList.concat(getPostList($))
  }
  return postList
}

function getPostsByDir(postDir) {
  const htmlList = fs.readdirSync(postDir)

  const postList = htmlList.map((abbrLink) => {
    // 从本地文件获取html
    const html = fs.readFileSync(`${postDir}/${abbrLink}/index.html`).toString()
    // 加载html 获取title
    const $ = cheerio.load(html)
    const postTitle = $(".post-title").text()
    return {
      abbrLink,
      postTitle,
    }
  })
  return postList
}

// getPostsByReptile('https://leotian.cn')
// getPostsByDir('/Users/tyb/workspace/blog/public/posts')

module.exports = {
  getPostsByReptile,
  getPostsByDir,
}
