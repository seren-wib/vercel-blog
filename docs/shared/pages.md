# pages.md

## 페이지 목록

| 경로                                    | 페이지명                         | 설명                                                                                | 인증 필요 |
| --------------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------- | --------- |
| `/`                                     | 랜딩 (전체 글 목록)              | 소개 문구(`siteMetadata.description`) + 전체 포스트 목록(날짜순), 카테고리 사이드바 | 아니오    |
| `/page/[page]`                          | 전체 글 목록 (페이지네이션)      | 5개/페이지, 2페이지부터 (`/page/1`은 `/`로 리다이렉트)                              | 아니오    |
| `/latest`                               | 최신 글                          | 최신 포스트 5개 + "All Posts" 링크(`/`)                                             | 아니오    |
| `/blog/[category]/[slug]`               | 블로그 상세                      | MDX 포스트 렌더링, 목차, 장 순서 prev/next, 댓글(Giscus)                            | 아니오    |
| `/blog/category`                        | 카테고리 목록                    | 전체 카테고리 + 포스트 수 (`data/categories.ts` 순서)                               | 아니오    |
| `/blog/category/[category]`             | 카테고리별 포스트                | 장 순서(파일명 자연 정렬)로 나열                                                    | 아니오    |
| `/blog/category/[category]/page/[page]` | 카테고리별 포스트 (페이지네이션) | 5개/페이지                                                                          | 아니오    |
| `/about`                                | 어바웃                           | 저자 프로필 (authors/default.mdx 렌더링)                                            | 아니오    |
| `/projects`                             | 프로젝트                         | 프로젝트 카드 갤러리 (projectsData.ts 기반)                                         | 아니오    |

> 현재 인증이 필요한 페이지 없음. 모든 콘텐츠 공개.

### 상단 바

Home(`/`) · Latest(`/latest`) · Categories(`/blog/category`) · Projects · About (`data/headerNavLinks.ts`)

### 리다이렉트 (`data/redirects.js`, 308)

- `/blog` → `/`, `/blog/page/[page]` → `/page/[page]`
- 예전 글 주소(카테고리 폴더 분리 전, slug 변경 전) → 현재 글 주소
- `/tags` → `/blog/category`, `/tags/[tag]` → `/blog/category/[tag]`

---

## 화면 흐름

```
랜딩(/)
├─ 포스트 클릭 → /blog/[category]/[slug]
├─ 카테고리 클릭 → /blog/category/[category]
└─ 페이지네이션 → /page/[page]

최신 글(/latest)
├─ 포스트 클릭 → /blog/[category]/[slug]
└─ "All Posts" 링크 → /

블로그 상세(/blog/[category]/[slug])
├─ 카테고리 클릭 → /blog/category/[category]
├─ 같은 카테고리 안 Prev/Next (장 순서)
└─ 댓글 (Giscus, GitHub Discussions)

카테고리 목록(/blog/category)
└─ 카테고리 클릭 → /blog/category/[category]

카테고리별 목록(/blog/category/[category])
├─ 포스트 클릭 → /blog/[category]/[slug]
└─ 페이지네이션 → /blog/category/[category]/page/[page]
```

---

## 레이아웃 종류

포스트별로 frontmatter의 `layout` 필드로 선택.

| layout 값           | 파일                     | 특징                                       |
| ------------------- | ------------------------ | ------------------------------------------ |
| `PostLayout` (기본) | `layouts/PostLayout.tsx` | 저자 정보, prev/next, 카테고리, 목차, 댓글 |
| `PostSimple`        | `layouts/PostSimple.tsx` | 최소 레이아웃                              |
| `PostBanner`        | `layouts/PostBanner.tsx` | 상단 배너 이미지                           |
