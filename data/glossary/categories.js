/**
 * Glossary categories: the only values allowed in a glossary row's `categories`.
 * Blog subcategory names (see data/categoryTree.js) plus programming languages and formats.
 * Add a key here before using it in data/glossary/<letter>.jsonl; the build rejects unknown ones.
 * Value = display label (English on both sites).
 */
const glossaryCategories = {
  // Dev
  unity: 'Unity',
  git: 'Git',
  sql: 'SQL',
  web: 'Web',
  auth: 'Auth',
  payments: 'Payments',
  devops: 'DevOps',
  cloudflare: 'Cloudflare',
  hardware: 'Hardware',
  // CS Fundamentals
  'computer-systems': 'Computer Systems',
  'data-structures': 'Data Structures',
  'software-engineering': 'Software Engineering',
  'database-systems': 'Database Systems',
  'information-retrieval': 'Information Retrieval',
  network: 'Network',
  os: 'OS',
  ai: 'AI',
  'cloud-computing': 'Cloud Computing',
  // Side projects and hackathons
  stairno: 'Stairno',
  devblog: 'DevBlog',
  'project-docs': 'Project Docs',
  'coffee-shop': 'Coffee Shop',
  skills: 'Skills',
  woowangthon: 'Woowangthon',
  grokbot: 'Grokbot',
  // Languages and formats
  c: 'C',
  cpp: 'C++',
  csharp: 'C#',
  java: 'Java',
  python: 'Python',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  html: 'HTML',
  css: 'CSS',
  shell: 'Shell',
}

module.exports = { glossaryCategories }
