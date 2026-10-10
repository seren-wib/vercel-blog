import { writeFileSync, mkdirSync } from 'fs'
import path from 'path'
import { slug } from 'github-slugger'
import { escape } from 'pliny/utils/htmlEscaper.js'
import siteMetadata from '../data/siteMetadata.js'
import tagData from '../app/tag-data.json' with { type: 'json' }
import { allBlogs } from '../.contentlayer/generated/index.mjs'
import { sortPosts } from 'pliny/utils/contentlayer.js'

const outputFolder = process.env.EXPORT ? 'out' : 'public'

const generateRssItem = (config, post) => `
  <item>
    <guid>${config.siteUrl}/${post.path}/</guid>
    <title>${escape(post.title)}</title>
    <link>${config.siteUrl}/${post.path}/</link>
    ${post.summary && `<description>${escape(post.summary)}</description>`}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${config.email} (${config.author})</author>
    ${post.tags && post.tags.map((t) => `<category>${t}</category>`).join('')}
  </item>
`

const generateRss = (config, posts, page = 'feed.xml', locale = 'kr') => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(config.title)}</title>
      <link>${config.siteUrl}/${locale}/</link>
      <description>${escape(config.description)}</description>
      <language>${locale === 'kr' ? 'ko' : locale}</language>
      <managingEditor>${config.email} (${config.author})</managingEditor>
      <webMaster>${config.email} (${config.author})</webMaster>
      <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
      <atom:link href="${config.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map((post) => generateRssItem(config, post)).join('')}
    </channel>
  </rss>
`

// kr keeps the original feed locations (/feed.xml, /tags/<tag>/feed.xml); other locales live under /<locale>/
const localeDir = (locale) => (locale === 'kr' ? '' : locale)

async function generateRSS(config, allBlogs, locale, page = 'feed.xml') {
  const publishPosts = allBlogs.filter((post) => post.draft !== true && post.locale === locale)
  if (publishPosts.length === 0) return
  const dir = path.join(outputFolder, localeDir(locale))
  mkdirSync(dir, { recursive: true })
  writeFileSync(
    path.join(dir, page),
    generateRss(config, sortPosts(publishPosts), path.join(localeDir(locale), page), locale)
  )

  for (const tag of Object.keys(tagData)) {
    const filteredPosts = publishPosts.filter((post) => post.tags.map((t) => slug(t)).includes(tag))
    if (filteredPosts.length === 0) continue
    const rssPath = path.join(dir, 'tags', tag)
    mkdirSync(rssPath, { recursive: true })
    writeFileSync(
      path.join(rssPath, page),
      generateRss(
        config,
        sortPosts(filteredPosts),
        path.join(localeDir(locale), 'tags', tag, page),
        locale
      )
    )
  }
}

const rss = () => {
  for (const locale of ['kr', 'en']) {
    generateRSS(siteMetadata, allBlogs, locale)
  }
  console.log('RSS feed generated...')
}
export default rss
