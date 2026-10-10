# pages.md

## 언어

사이트 전체가 한국어(`kr`)와 영어(`en`) 두 벌이다. 모든 페이지 주소는 언어 접두사로 시작한다 (`/kr/...`, `/en/...`). 아래 표의 `[locale]`은 `kr` 또는 `en`.

| locale | 주소 접두사 | `<html lang>` · hreflang | og:locale | 날짜 형식 |
| ------ | ----------- | ------------------------ | --------- | --------- |
| `kr`   | `/kr`       | `ko`                     | `ko_KR`   | `ko-KR`   |
| `en`   | `/en`       | `en`                     | `en_US`   | `en-US`   |

- 글은 언어별 폴더에 따로 둔다 (`data/blog/kr/...`, `data/blog/en/...`). 같은 글의 한/영 버전은 카테고리와 파일명(slug)이 같다.
- 메뉴·버튼 같은 화면 문구는 `data/i18n.ts` 사전에서 가져온다. 카테고리 표시 이름은 두 언어 모두 영어(`data/categories.ts`).
- `/`는 페이지가 아니라 리다이렉트다. `Accept-Language`에 `ko`가 있으면 `/kr`, 아니면 `/en`으로 보낸다 (307, 방문자마다 달라서 임시). `middleware.ts`.

## 페이지 목록

| 경로                                             | 페이지명                         | 설명                                                                                | 인증 필요 |
| ------------------------------------------------ | -------------------------------- | ----------------------------------------------------------------------------------- | --------- |
| `/[locale]`                                      | 랜딩 (전체 글 목록)              | 소개 문구 + 해당 언어 전체 포스트 목록(날짜순), 카테고리 사이드바                   | 아니오    |
| `/[locale]/page/[page]`                          | 전체 글 목록 (페이지네이션)      | 5개/페이지, 2페이지부터 (`/[locale]/page/1`은 `/[locale]`로 리다이렉트)             | 아니오    |
| `/[locale]/latest`                               | 최신 글                          | 최신 포스트 5개 + "All Posts" 링크(`/[locale]`)                                     | 아니오    |
| `/[locale]/blog/[category]/[slug]`               | 블로그 상세                      | MDX 포스트 렌더링, 목차, 같은 언어·카테고리 안 장 순서 prev/next, 댓글(Giscus)      | 아니오    |
| `/[locale]/blog/category`                        | 카테고리 목록                    | 해당 언어 카테고리 + 포스트 수 (`data/categories.ts` 순서)                          | 아니오    |
| `/[locale]/blog/category/[category]`             | 카테고리별 포스트                | 장 순서(파일명 자연 정렬)로 나열                                                    | 아니오    |
| `/[locale]/blog/category/[category]/page/[page]` | 카테고리별 포스트 (페이지네이션) | 5개/페이지                                                                          | 아니오    |
| `/[locale]/about`                                | 어바웃                           | 저자 프로필 (`kr`: `data/authors/kr/default.mdx`, `en`: `data/authors/default.mdx`) | 아니오    |
| `/[locale]/projects`                             | 프로젝트                         | 프로젝트 카드 갤러리 (projectsData.ts 기반)                                         | 아니오    |

> 현재 인증이 필요한 페이지 없음. 모든 콘텐츠 공개.

### 상단 바

Home(`/[locale]`) · Latest(`/[locale]/latest`) · Categories(`/[locale]/blog/category`) · Projects · About · 언어 토글(KR / EN) (`data/headerNavLinks.ts`, 문구는 `data/i18n.ts`)

- 언어 토글은 지금 주소의 언어 접두사만 바꾼 주소로 이동한다 (`/kr/blog/os/os-13-io` ↔ `/en/blog/os/os-13-io`).
- 글 상세에서 다른 언어 버전이 없으면 토글을 비활성화한다. 다른 페이지는 항상 두 언어가 있다.

### SEO

- 각 페이지에 canonical(자기 주소)과 hreflang alternates(`ko`, `en`, `x-default`=`/en`)를 넣는다. 다른 언어 버전이 없는 글은 자기 언어만 넣는다.
- sitemap은 두 언어 주소를 모두 싣고, 짝이 있는 주소끼리 alternates로 묶는다.
- RSS는 언어별: `/feed.xml`(kr), `/en/feed.xml`(en). 검색 인덱스도 언어별: `/search-kr.json`, `/search-en.json`.

### 리다이렉트 (`data/redirects.js`, 308)

- 언어 접두사 없는 예전 주소 → `/kr` 주소: `/blog/...` → `/kr/blog/...`, `/latest`·`/about`·`/projects`·`/page/[page]` → `/kr/...`
- `/blog` → `/kr`, `/blog/page/[page]` → `/kr/page/[page]`, `/[locale]/page/1` → `/[locale]`
- 예전 글 주소(카테고리 폴더 분리 전, slug 변경 전) → 현재 `/kr` 글 주소 (중간 단계 없이 바로)
- `/tags` → `/kr/blog/category`, `/tags/[tag]` → `/kr/blog/category/[tag]`

---

## 화면 흐름

```
랜딩(/[locale])
├─ 포스트 클릭 → /[locale]/blog/[category]/[slug]
├─ 카테고리 클릭 → /[locale]/blog/category/[category]
└─ 페이지네이션 → /[locale]/page/[page]

최신 글(/[locale]/latest)
├─ 포스트 클릭 → /[locale]/blog/[category]/[slug]
└─ "All Posts" 링크 → /[locale]

블로그 상세(/[locale]/blog/[category]/[slug])
├─ 카테고리 클릭 → /[locale]/blog/category/[category]
├─ 같은 언어·카테고리 안 Prev/Next (장 순서)
├─ 언어 토글 → 다른 언어의 같은 글 (없으면 비활성)
└─ 댓글 (Giscus, GitHub Discussions, 언어별 주소라 스레드도 따로)

카테고리 목록(/[locale]/blog/category)
└─ 카테고리 클릭 → /[locale]/blog/category/[category]

카테고리별 목록(/[locale]/blog/category/[category])
├─ 포스트 클릭 → /[locale]/blog/[category]/[slug]
└─ 페이지네이션 → /[locale]/blog/category/[category]/page/[page]
```

---

## 레이아웃 종류

포스트별로 frontmatter의 `layout` 필드로 선택.

| layout 값           | 파일                     | 특징                                       |
| ------------------- | ------------------------ | ------------------------------------------ |
| `PostLayout` (기본) | `layouts/PostLayout.tsx` | 저자 정보, prev/next, 카테고리, 목차, 댓글 |
| `PostSimple`        | `layouts/PostSimple.tsx` | 최소 레이아웃                              |
| `PostBanner`        | `layouts/PostBanner.tsx` | 상단 배너 이미지                           |
