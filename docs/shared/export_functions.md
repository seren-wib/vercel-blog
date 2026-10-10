# export_functions.md

## 페이지 컴포넌트

모든 페이지는 `app/[locale]/` 아래에 있다 (`[locale]` = `kr` | `en`). `app/[locale]/layout.tsx`가 루트 레이아웃이다 (`<html lang>`이 언어마다 달라서).

| 파일                                                         | export명                                       | URL                                           | 설명                                 |
| ------------------------------------------------------------ | ---------------------------------------------- | --------------------------------------------- | ------------------------------------ |
| `app/[locale]/layout.tsx`                                    | `RootLayout` (default), `generateStaticParams` | —                                             | 언어별 루트 레이아웃, 헤더·푸터·검색 |
| `app/[locale]/page.tsx`                                      | `Page` (default)                               | `/[locale]`                                   | 랜딩 (소개 + 전체 글 목록)           |
| `app/[locale]/page/[page]/page.tsx`                          | `Page` (default)                               | `/[locale]/page/[n]`                          | 전체 글 목록 페이지네이션            |
| `app/[locale]/latest/page.tsx`                               | `Page` (default)                               | `/[locale]/latest`                            | 최신 글 5개                          |
| `app/[locale]/blog/[...slug]/page.tsx`                       | `Page` (default)                               | `/[locale]/blog/[category]/[slug]`            | 포스트 상세                          |
| `app/[locale]/blog/category/page.tsx`                        | `Page` (default)                               | `/[locale]/blog/category`                     | 카테고리 목록                        |
| `app/[locale]/blog/category/[category]/page.tsx`             | `CategoryPage` (default)                       | `/[locale]/blog/category/[category]`          | 카테고리별 포스트                    |
| `app/[locale]/blog/category/[category]/page/[page]/page.tsx` | `CategoryPage` (default)                       | `/[locale]/blog/category/[category]/page/[n]` | 카테고리별 페이지네이션              |
| `app/[locale]/about/page.tsx`                                | `Page` (default)                               | `/[locale]/about`                             | 어바웃                               |
| `app/[locale]/projects/page.tsx`                             | `Projects` (default)                           | `/[locale]/projects`                          | 프로젝트                             |
| `app/[locale]/not-found.tsx`                                 | `NotFound` (default)                           | —                                             | 404                                  |

------|----------|-----|------|
| `app/page.tsx` | `HomePage` (default) | `/` | 홈 (최신 5개 포스트) |
| `app/blog/page.tsx` | `BlogPage` (default) | `/blog` | 블로그 목록 |
| `app/blog/[...slug]/page.tsx` | `Page` (default) | `/blog/[slug]` | 포스트 상세 |
| `app/blog/page/[page]/page.tsx` | `Page` (default) | `/blog/page/[n]` | 블로그 페이지네이션 |
| `app/about/page.tsx` | `Page` (default) | `/about` | 어바웃 |
| `app/projects/page.tsx` | `Page` (default) | `/projects` | 프로젝트 |
| `app/tags/page.tsx` | `Page` (default) | `/tags` | 태그 목록 |
| `app/tags/[tag]/page.tsx` | `Page` (default) | `/tags/[tag]` | 태그별 포스트 |
| `app/tags/[tag]/page/[page]/page.tsx` | `Page` (default) | `/tags/[tag]/page/[n]` | 태그별 페이지네이션 |

---

## API Route Handlers

| 파일                          | export명            | HTTP | URL               |
| ----------------------------- | ------------------- | ---- | ----------------- |
| `app/api/newsletter/route.ts` | `POST` (named)      | POST | `/api/newsletter` |
| `app/robots.ts`               | `robots` (default)  | GET  | `/robots.txt`     |
| `app/sitemap.ts`              | `sitemap` (default) | GET  | `/sitemap.xml`    |

---

## 레이아웃 컴포넌트

| 파일                                   | export명                             | 타입    | 설명                            |
| -------------------------------------- | ------------------------------------ | ------- | ------------------------------- |
| `layouts/PostLayout.tsx`               | `PostLayout` (default)               | default | 포스트 기본 레이아웃            |
| `layouts/PostSimple.tsx`               | `PostSimple` (default)               | default | 포스트 심플 레이아웃            |
| `layouts/PostBanner.tsx`               | `PostBanner` (default)               | default | 포스트 배너 레이아웃            |
| `layouts/ListLayoutWithCategories.tsx` | `ListLayoutWithCategories` (default) | default | 포스트 목록 + 카테고리 사이드바 |
| `layouts/AuthorLayout.tsx`             | `AuthorLayout` (default)             | default | 저자 프로필 레이아웃            |

---

## 공유 컴포넌트

| 파일                                 | export명                        | 타입    | 설명                      |
| ------------------------------------ | ------------------------------- | ------- | ------------------------- |
| `components/Header.tsx`              | `Header` (default)              | default | 전역 헤더                 |
| `components/Footer.tsx`              | `Footer` (default)              | default | 전역 푸터                 |
| `components/Link.tsx`                | `Link` (default)                | default | 내/외부 링크 핸들러       |
| `components/MobileNav.tsx`           | `MobileNav` (default)           | default | 모바일 메뉴               |
| `components/ThemeSwitch.tsx`         | `ThemeSwitch` (default)         | default | 테마 토글                 |
| `components/SearchButton.tsx`        | `SearchButton` (default)        | default | 검색 버튼                 |
| `components/Category.tsx`            | `Category` (default)            | default | 카테고리 링크             |
| `components/LanguageSwitch.tsx`      | `LanguageSwitch` (default)      | default | 상단 바 KR/EN 토글        |
| `components/Card.tsx`                | `Card` (default)                | default | 프로젝트 카드             |
| `components/Image.tsx`               | `Image` (default)               | default | Next.js Image 래퍼        |
| `components/PageTitle.tsx`           | `PageTitle` (default)           | default | 페이지 h1 제목            |
| `components/Comments.tsx`            | `Comments` (default)            | default | Giscus 댓글               |
| `components/ScrollTopAndComment.tsx` | `ScrollTopAndComment` (default) | default | 스크롤 상단/댓글 버튼     |
| `components/TableWrapper.tsx`        | `TableWrapper` (default)        | default | 스크롤 가능한 테이블 래퍼 |
| `components/LayoutWrapper.tsx`       | `LayoutWrapper` (default)       | default | Header + Footer 래퍼      |
| `components/SectionContainer.tsx`    | `SectionContainer` (default)    | default | 최대 너비 컨테이너        |
| `components/MDXComponents.tsx`       | `components` (default)          | default | MDX 커스텀 컴포넌트 맵    |
| `components/social-icons/index.tsx`  | `SocialIcon` (default)          | default | 소셜 아이콘               |

---

## 유틸리티 / 설정

| 파일                      | export명                                              | 타입    | 설명                                             |
| ------------------------- | ----------------------------------------------------- | ------- | ------------------------------------------------ |
| `app/seo.tsx`             | `genPageMetadata`                                     | named   | 페이지별 metadata 생성                           |
| `app/theme-providers.tsx` | `ThemeProviders` (default)                            | default | next-themes Provider                             |
| `data/siteMetadata.js`    | `siteMetadata` (default)                              | default | 사이트 전역 설정                                 |
| `data/headerNavLinks.ts`  | `headerNavLinks` (default)                            | default | 네비게이션 링크 배열                             |
| `data/i18n.ts`            | `locales`, `getDictionary`, `localePath`              | named   | 언어 목록, 화면 문구 사전, 언어 접두사 붙인 경로 |
| `data/categories.ts`      | `getCategoryLabel`, `sortCategories`, `sortByChapter` | named   | 카테고리 표시 이름·순서, 장 순서 정렬            |
| `data/projectsData.ts`    | `projectsData` (default)                              | default | 프로젝트 데이터 배열                             |

> - **default**: `import X from '...'`
> - **named**: `import { X } from '...'`
>
> 컴포넌트·함수 추가 시 이 문서를 함께 업데이트할 것.
