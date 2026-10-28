/**
 * Site languages. Every page lives under /<locale>/ (see docs/shared/pages.md).
 * Posts live under data/blog/<locale>/<category>/<slug>.mdx; a post and its translation share the slug.
 */
export const locales = ['kr', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'kr'

export const localeInfo: Record<
  Locale,
  { htmlLang: string; hreflang: string; ogLocale: string; dateLocale: string; label: string }
> = {
  kr: { htmlLang: 'ko', hreflang: 'ko', ogLocale: 'ko_KR', dateLocale: 'ko-KR', label: 'KR' },
  en: { htmlLang: 'en', hreflang: 'en', ogLocale: 'en_US', dateLocale: 'en-US', label: 'EN' },
}

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale)
}

/** Prefix a site path with the locale: localePath('kr', '/latest') -> '/kr/latest' */
export function localePath(locale: Locale, path = '/') {
  const rest = path === '/' ? '/' : path.startsWith('/') ? path : `/${path}`
  return `/${locale}${rest}`
}

/** The locale segment of a pathname, if any: '/en/blog/...' -> 'en' */
export function localeFromPathname(pathname: string): Locale {
  const first = pathname.split('/')[1]
  return isLocale(first) ? first : defaultLocale
}

/** The same page in another locale: '/kr/blog/os/x/' -> '/en/blog/os/x/' */
export function switchLocalePath(pathname: string, target: Locale) {
  const parts = pathname.split('/')
  if (isLocale(parts[1])) {
    parts[1] = target
    return parts.join('/')
  }
  return localePath(target, pathname)
}

/**
 * Navigation and button labels. English on both sites: the Korean versions read awkwardly,
 * so only sentences (intro, notices, screen reader text) are translated below.
 */
const labels = {
  nav: {
    blog: 'Blog',
    projects: 'Projects',
    about: 'About',
    playground: 'Playground',
  },
  allPosts: 'All Posts',
  categories: 'Categories',
  category: 'Category',
  previous: 'Previous',
  next: 'Next',
  pageOf: (current: number, total: number) => `${current} of ${total}`,
  previousArticle: 'Previous Article',
  nextArticle: 'Next Article',
  backToBlog: 'Back to the blog',
  contents: 'Contents',
  backToHome: 'Back to homepage',
  projectsIntro: "Things I've built or am building.",
  building: 'Building',
  shipped: 'Shipped',
  featuredProject: 'Featured',
  privateRepo: 'Private',
  techStack: 'Tech stack',
  run: 'Run',
  stop: 'Stop',
  reset: 'Reset',
  output: 'Output',
  stdin: 'stdin',
  preview: 'Preview',
  console: 'Console',
  inBrowser: 'In browser',
  compilerExplorer: 'Compiler Explorer',
}

const dictionaries = {
  kr: {
    ...labels,
    description:
      '개발자의 공부 노트. 네트워크, 운영체제, 클라우드 컴퓨팅, 소프트웨어 공학까지 컴퓨터공학 수업 내용을 깊이 있게 정리하고, 실제 프로젝트와 디버깅, 직접 만든 도구에서 얻은 기록을 함께 남깁니다.',
    noPosts: '글이 없습니다.',
    publishedOn: '작성일',
    aiGenerated: 'AI 생성',
    viewCategoryPosts: (label: string) => `${label} 글 보기`,
    categoryPosts: (label: string) => `${label} 글 목록`,
    notFoundTitle: '페이지를 찾을 수 없습니다.',
    notFoundBody: '주소가 바뀌었거나 없는 페이지입니다. 홈에서 다른 글을 찾아보세요.',
    switchLanguage: '언어 전환',
    translationMissing: '이 글은 아직 영어 번역이 없습니다.',
    scrollToTop: '맨 위로',
    scrollToComment: '댓글로 이동',
    toggleMenu: '메뉴 열기/닫기',
    pg: {
      intro:
        '브라우저에서 바로 코드를 써 보고 실행하는 연습장입니다. 쓴 코드는 이 브라우저에 저장됩니다.',
      privacy:
        'C와 C++ 코드는 컴파일과 실행을 위해 Compiler Explorer(godbolt.org)로 전송됩니다. 나머지 언어는 이 브라우저 안에서만 실행됩니다.',
      shortcut: 'Ctrl+Enter(⌘+Enter)로 실행',
      stdinHint: '프로그램이 읽을 입력을 미리 적어 두세요.',
      idle: '실행 결과가 여기에 표시됩니다.',
      noOutput: '출력이 없습니다.',
      running: '실행 중…',
      loadingPython: 'Python 런타임을 불러오는 중입니다… (처음 한 번 약 10MB)',
      compiling: 'Compiler Explorer에서 컴파일하는 중입니다…',
      buildFailed: '컴파일에 실패했습니다.',
      timedOut: '실행 시간 제한을 넘어 중단됐습니다.',
      network: 'Compiler Explorer에 연결하지 못했습니다.',
      stopped: '실행을 멈췄습니다.',
      timeLimit: (s: number) => `${s}초 안에 끝나지 않아 멈췄습니다.`,
      exitCode: (code: number) => `종료 코드 ${code}`,
      htmlNote: '입력하면 미리보기가 바로 바뀝니다. 외부 스크립트는 불러오지 않습니다.',
      sqlNote: '교재(Elmasri·Navathe)의 COMPANY 스키마가 미리 들어 있습니다.',
      sqlPost: 'SQL 문법 정리는 데이터베이스시스템 3장 글에 있습니다.',
      resetConfirm: '예제 코드로 되돌릴까요? 지금 코드는 사라집니다.',
    },
  },
  en: {
    ...labels,
    description:
      "A developer's notebook — deep dives into computer science coursework, from networks and operating systems to cloud computing and software engineering, alongside hands-on notes from real projects, debugging sessions and tools I build along the way.",
    noPosts: 'No posts found.',
    publishedOn: 'Published on',
    aiGenerated: 'AI-generated',
    viewCategoryPosts: (label: string) => `View ${label} posts`,
    categoryPosts: (label: string) => `${label} posts`,
    notFoundTitle: "Sorry, we couldn't find this page.",
    notFoundBody:
      'It may have moved or never existed. You can find plenty of other posts on the homepage.',
    switchLanguage: 'Switch language',
    translationMissing: 'This post has no Korean version yet.',
    scrollToTop: 'Scroll to top',
    scrollToComment: 'Scroll to comments',
    toggleMenu: 'Toggle menu',
    pg: {
      intro: 'Write and run code right in the browser. Your code is saved in this browser.',
      privacy:
        'C and C++ code is sent to Compiler Explorer (godbolt.org) to compile and run. Everything else runs inside your browser.',
      shortcut: 'Ctrl+Enter (⌘+Enter) to run',
      stdinHint: 'Type the input your program will read.',
      idle: 'Output shows up here.',
      noOutput: 'No output.',
      running: 'Running…',
      loadingPython: 'Loading the Python runtime… (about 10 MB, first time only)',
      compiling: 'Compiling on Compiler Explorer…',
      buildFailed: 'Build failed.',
      timedOut: 'Stopped: the time limit was exceeded.',
      network: 'Could not reach Compiler Explorer.',
      stopped: 'Stopped.',
      timeLimit: (s: number) => `Stopped: did not finish within ${s} s.`,
      exitCode: (code: number) => `Exit code ${code}`,
      htmlNote: 'The preview updates as you type. External scripts are not loaded.',
      sqlNote: 'The COMPANY schema from the textbook (Elmasri & Navathe) is preloaded.',
      sqlPost: 'The SQL notes are in Database Systems chapter 3.',
      resetConfirm: 'Go back to the example code? Your current code will be lost.',
    },
  },
}

export type Dictionary = (typeof dictionaries)['en']

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}

/** Route params arrive as plain strings; the [locale] layout already 404s anything else */
export function asLocale(value: string): Locale {
  return isLocale(value) ? value : defaultLocale
}
