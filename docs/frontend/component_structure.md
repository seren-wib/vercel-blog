# component_structure.md

## 컴포넌트 트리

```
app/layout.tsx (RootLayout)
├── ThemeProviders          ← next-themes 래퍼
└── LayoutWrapper
    ├── Header
    │   ├── Link (CustomLink)
    │   ├── MobileNav
    │   ├── SearchButton    ← kbar 검색 트리거
    │   └── ThemeSwitch
    ├── <페이지 컴포넌트>
    │   ├── [홈·카테고리] ListLayoutWithCategories
    │   ├── [블로그 목록] ListLayout / ListLayoutWithTags
    │   │   ├── Tag
    │   │   └── Pagination
    │   ├── [블로그 상세] PostLayout / PostSimple / PostBanner
    │   │   ├── PageTitle
    │   │   ├── Tag
    │   │   ├── MDXLayoutRenderer → MDXComponents
    │   │   │   ├── Image (Next.js + BASE_PATH)
    │   │   │   ├── Link (CustomLink)
    │   │   │   ├── TableWrapper
    │   │   │   └── TOCInline
    │   │   ├── Comments (Giscus, 지연 로드)
    │   │   └── ScrollTopAndComment
    │   ├── [어바웃] AuthorLayout
    │   │   └── SocialIcon
    │   └── [프로젝트] Card
    └── Footer
        └── SocialIcon
```

---

## 컴포넌트 상세

### Header

- 위치: `components/Header.tsx`
- 역할: 전역 네비게이션 (로고, 링크, 테마 토글, 검색)
- Props: 없음 (데이터는 `data/headerNavLinks.ts`에서 직접 import)

### Footer

- 위치: `components/Footer.tsx`
- 역할: 소셜 링크, 저작권 표시
- Props: 없음 (`siteMetadata.js`에서 직접 import)

### Link (CustomLink)

- 위치: `components/Link.tsx`
- 역할: 내부 링크는 Next.js `<Link>`, 외부 링크는 `<a target="_blank">` 자동 처리

| prop      | 타입                   | 필수 | 설명           |
| --------- | ---------------------- | ---- | -------------- |
| `href`    | `string`               | ✅   | 링크 URL       |
| `...rest` | `AnchorHTMLAttributes` |      | 기타 HTML 속성 |

### MobileNav

- 위치: `components/MobileNav.tsx`
- 역할: 모바일 햄버거 메뉴 (side drawer)
- Props: 없음

### ThemeSwitch

- 위치: `components/ThemeSwitch.tsx`
- 역할: 라이트 / 다크 / 시스템 테마 토글
- Props: 없음

### SearchButton

- 위치: `components/SearchButton.tsx`
- 역할: kbar 또는 Algolia 검색 팔레트 트리거
- Props: 없음

### Tag

- 위치: `components/Tag.tsx`
- 역할: 태그 링크 (`/tags/[tag]`로 이동)

| prop   | 타입     | 필수 | 설명   |
| ------ | -------- | ---- | ------ |
| `text` | `string` | ✅   | 태그명 |

### Card

- 위치: `components/Card.tsx`
- 역할: 프로젝트 카드 (이미지 + 제목 + 설명 + 링크)

| prop          | 타입     | 필수 | 설명          |
| ------------- | -------- | ---- | ------------- |
| `title`       | `string` | ✅   | 프로젝트명    |
| `description` | `string` | ✅   | 설명          |
| `imgSrc`      | `string` |      | 썸네일 이미지 |
| `href`        | `string` |      | 프로젝트 링크 |

### Image

- 위치: `components/Image.tsx`
- 역할: Next.js `<Image>` 래퍼, `BASE_PATH` 자동 처리

| prop      | 타입         | 필수 | 설명                |
| --------- | ------------ | ---- | ------------------- |
| `src`     | `string`     | ✅   | 이미지 경로         |
| `...rest` | `ImageProps` |      | Next.js Image props |

### Comments

- 위치: `components/Comments.tsx`
- 역할: Giscus 댓글 컴포넌트 (동적 import로 지연 로드)

| prop   | 타입     | 필수 | 설명                        |
| ------ | -------- | ---- | --------------------------- |
| `slug` | `string` | ✅   | 포스트 슬러그 (Giscus term) |

### ScrollTopAndComment

- 위치: `components/ScrollTopAndComment.tsx`
- 역할: 화면 우하단 고정 버튼 (맨 위로 + 댓글로 이동)
- Props: 없음

### SocialIcon

- 위치: `components/social-icons/index.tsx`
- 역할: 소셜 플랫폼 아이콘 렌더링

| prop   | 타입     | 필수 | 설명                                                  |
| ------ | -------- | ---- | ----------------------------------------------------- |
| `kind` | `string` | ✅   | `mail`, `github`, `linkedin`, `twitter`, `bluesky` 등 |
| `href` | `string` | ✅   | 링크 URL                                              |
| `size` | `number` |      | 아이콘 크기 (px)                                      |

### PageTitle

- 위치: `components/PageTitle.tsx`
- 역할: 페이지 `<h1>` 타이틀

| prop       | 타입        | 필수 | 설명      |
| ---------- | ----------- | ---- | --------- |
| `children` | `ReactNode` | ✅   | 제목 내용 |

### MDXComponents

- 위치: `components/MDXComponents.tsx`
- 역할: MDX 렌더링 시 커스텀 컴포넌트 매핑 (Image, Link, Table, TOCInline, Pre, BlogNewsletterForm)
- Props: 없음 (export default `components` 객체)

---

## 레이아웃 컴포넌트

### PostLayout

- 위치: `layouts/PostLayout.tsx`

| prop            | 타입        | 필수 | 설명                   |
| --------------- | ----------- | ---- | ---------------------- |
| `content`       | `Blog`      | ✅   | Contentlayer Blog 객체 |
| `authorDetails` | `Authors[]` | ✅   | 저자 정보 배열         |
| `next`          | `Blog`      |      | 다음 포스트            |
| `prev`          | `Blog`      |      | 이전 포스트            |
| `children`      | `ReactNode` | ✅   | MDX 렌더링 결과        |

### PostSimple

- 위치: `layouts/PostSimple.tsx`

| prop       | 타입        | 필수 | 설명                   |
| ---------- | ----------- | ---- | ---------------------- |
| `content`  | `Blog`      | ✅   | Contentlayer Blog 객체 |
| `next`     | `Blog`      |      | 다음 포스트            |
| `prev`     | `Blog`      |      | 이전 포스트            |
| `children` | `ReactNode` | ✅   | MDX 렌더링 결과        |

### PostBanner

- 위치: `layouts/PostBanner.tsx`

| prop       | 타입        | 필수 | 설명                   |
| ---------- | ----------- | ---- | ---------------------- |
| `content`  | `Blog`      | ✅   | Contentlayer Blog 객체 |
| `next`     | `Blog`      |      | 다음 포스트            |
| `prev`     | `Blog`      |      | 이전 포스트            |
| `children` | `ReactNode` | ✅   | MDX 렌더링 결과        |

### ListLayout

- 위치: `layouts/ListLayout.tsx`

| prop                  | 타입                          | 필수 | 설명              |
| --------------------- | ----------------------------- | ---- | ----------------- |
| `posts`               | `Blog[]`                      | ✅   | 전체 포스트 배열  |
| `title`               | `string`                      | ✅   | 목록 제목         |
| `initialDisplayPosts` | `Blog[]`                      |      | 초기 표시 포스트  |
| `pagination`          | `{ currentPage, totalPages }` |      | 페이지네이션 정보 |

### ListLayoutWithTags

- 위치: `layouts/ListLayoutWithTags.tsx`
- Props: ListLayout과 동일, 태그 사이드바 포함

### AuthorLayout

- 위치: `layouts/AuthorLayout.tsx`

| prop       | 타입        | 필수 | 설명                      |
| ---------- | ----------- | ---- | ------------------------- |
| `children` | `ReactNode` | ✅   | MDX 렌더링 결과           |
| `content`  | `Authors`   | ✅   | Contentlayer Authors 객체 |
