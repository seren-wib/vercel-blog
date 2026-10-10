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
  const rest = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
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

const dictionaries = {
  kr: {
    description:
      '개발자의 공부 노트. 네트워크, 운영체제, 클라우드 컴퓨팅, 소프트웨어 공학까지 컴퓨터공학 수업 내용을 깊이 있게 정리하고, 실제 프로젝트와 디버깅, 직접 만든 도구에서 얻은 기록을 함께 남깁니다.',
    nav: {
      home: '홈',
      latest: '최신 글',
      categories: '카테고리',
      projects: '프로젝트',
      about: '소개',
    },
    allPosts: '전체 글',
    latest: '최신 글',
    categories: '카테고리',
    category: '카테고리',
    readMore: '더 읽기',
    noPosts: '글이 없습니다.',
    noCategories: '카테고리가 없습니다.',
    previous: '이전',
    next: '다음',
    pageOf: (current: number, total: number) => `${current} / ${total}`,
    publishedOn: '작성일',
    previousArticle: '이전 글',
    nextArticle: '다음 글',
    backToBlog: '블로그로 돌아가기',
    contents: '목차',
    loadComments: '댓글 불러오기',
    discussOnTwitter: '트위터에서 이야기하기',
    viewOnGitHub: 'GitHub에서 보기',
    viewCategoryPosts: (label: string) => `${label} 글 보기`,
    categoryPosts: (label: string) => `${label} 글 목록`,
    notFoundTitle: '페이지를 찾을 수 없습니다.',
    notFoundBody: '주소가 바뀌었거나 없는 페이지입니다. 홈에서 다른 글을 찾아보세요.',
    backToHome: '홈으로',
    projectsIntro: '만들었거나 만들고 있는 프로젝트들.',
    switchLanguage: '언어 전환',
    translationMissing: '이 글은 아직 영어 번역이 없습니다.',
    scrollToTop: '맨 위로',
    scrollToComment: '댓글로 이동',
    toggleMenu: '메뉴 열기/닫기',
  },
  en: {
    description:
      "A developer's notebook — deep dives into computer science coursework, from networks and operating systems to cloud computing and software engineering, alongside hands-on notes from real projects, debugging sessions and tools I build along the way.",
    nav: {
      home: 'Home',
      latest: 'Latest',
      categories: 'Categories',
      projects: 'Projects',
      about: 'About',
    },
    allPosts: 'All Posts',
    latest: 'Latest',
    categories: 'Categories',
    category: 'Category',
    readMore: 'Read more',
    noPosts: 'No posts found.',
    noCategories: 'No categories found.',
    previous: 'Previous',
    next: 'Next',
    pageOf: (current: number, total: number) => `${current} of ${total}`,
    publishedOn: 'Published on',
    previousArticle: 'Previous Article',
    nextArticle: 'Next Article',
    backToBlog: 'Back to the blog',
    contents: 'Contents',
    loadComments: 'Load Comments',
    discussOnTwitter: 'Discuss on Twitter',
    viewOnGitHub: 'View on GitHub',
    viewCategoryPosts: (label: string) => `View ${label} posts`,
    categoryPosts: (label: string) => `${label} posts`,
    notFoundTitle: "Sorry, we couldn't find this page.",
    notFoundBody:
      'It may have moved or never existed. You can find plenty of other posts on the homepage.',
    backToHome: 'Back to homepage',
    projectsIntro: "Things I've built or am building.",
    switchLanguage: 'Switch language',
    translationMissing: 'This post has no Korean version yet.',
    scrollToTop: 'Scroll to top',
    scrollToComment: 'Scroll to comments',
    toggleMenu: 'Toggle menu',
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
