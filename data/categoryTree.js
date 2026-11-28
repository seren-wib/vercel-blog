/**
 * Category tree, shared by data/categories.ts (labels, sidebar order) and data/redirects.js (old URLs).
 *
 * Posts live under data/blog/<locale>/<parent>/<category>/<file>.mdx, or data/blog/<locale>/<category>/<file>.mdx
 * for a category that has no parent yet. The folder path decides where a post belongs; this file only
 * gives labels and order. A folder that is missing here still works and is shown by its folder name.
 *
 * - parents: parent key (folder and URL segment) -> labels per locale and child categories in sidebar order.
 *   Every child listed here once lived at /<locale>/blog/<child>/ and is redirected from there.
 * - topLevel: categories without a parent, shown after the parents in this order.
 * - labels: display name of each category (English on both sites).
 */
const parents = {
  dev: {
    label: { kr: '개발', en: 'Dev' },
    children: ['unity', 'git', 'sql', 'web', 'auth', 'payments', 'devops', 'cloudflare'],
  },
  'cs-fundamentals': {
    label: { kr: 'CS 기초', en: 'CS Fundamentals' },
    children: [
      'computer-systems',
      'data-structures',
      'software-engineering',
      'database-systems',
      'information-retrieval',
      'network',
      'os',
      'ai',
    ],
  },
  'side-projects': {
    label: { kr: '사이드 프로젝트', en: 'Side Projects' },
    children: ['stairno', 'devblog', 'project-docs', 'coffee-shop'],
  },
  hackathon: {
    label: { kr: '해커톤', en: 'Hackathon' },
    children: ['woowangthon', 'grokbot'],
  },
}

const topLevel = ['hardware', 'cloud-computing', 'side-projects']

const labels = {
  stairno: 'Stairno',
  devblog: 'DevBlog',
  'project-docs': 'Project Docs',
  'side-projects': 'Side Projects',
  woowangthon: 'Woowangthon',
  grokbot: 'Grokbot',
  'coffee-shop': 'Coffee Shop',
  hardware: 'Hardware',
  'computer-systems': 'Computer Systems',
  'data-structures': 'Data Structures',
  'software-engineering': 'Software Engineering',
  'database-systems': 'Database Systems',
  'information-retrieval': 'Information Retrieval',
  'cloud-computing': 'Cloud Computing',
  network: 'Network',
  os: 'OS',
  ai: 'AI',
  unity: 'Unity',
  git: 'Git',
  sql: 'SQL',
  web: 'Web',
  auth: 'Auth',
  payments: 'Payments',
  devops: 'DevOps',
  cloudflare: 'Cloudflare',
}

module.exports = { parents, topLevel, labels }
