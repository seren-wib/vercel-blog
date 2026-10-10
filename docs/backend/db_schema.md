# db_schema.md

> 이 프로젝트는 **DB가 없는 정적 사이트**입니다.
> 모든 콘텐츠는 MDX 파일 기반이며, Contentlayer2가 빌드 타임에 타입 안전 객체로 변환합니다.

---

## 콘텐츠 스키마 (Contentlayer Document Types)

### Blog

파일 위치: `data/blog/<locale>/<category>/<slug>.mdx` (`locale`은 `kr` 또는 `en`)

| 필드명         | 타입       | 필수 | 설명                           |
| -------------- | ---------- | ---- | ------------------------------ |
| `title`        | `string`   | ✅   | 포스트 제목                    |
| `date`         | `date`     | ✅   | 작성일                         |
| `tags`         | `string[]` |      | 태그 목록                      |
| `lastmod`      | `date`     |      | 마지막 수정일                  |
| `draft`        | `boolean`  |      | true면 빌드에서 제외           |
| `summary`      | `string`   |      | 포스트 요약 (목록 페이지 표시) |
| `images`       | `string[]` |      | OG 이미지 등                   |
| `authors`      | `string[]` |      | 저자 (authors/ 파일명 참조)    |
| `layout`       | `string`   |      | 사용할 레이아웃 컴포넌트명     |
| `bibliography` | `string`   |      | BibTeX 참고문헌 파일 경로      |
| `canonicalUrl` | `string`   |      | 원문 URL (크로스포스팅용)      |

**Computed Fields (빌드 시 자동 생성)**

| 필드명           | 타입     | 설명                                                                   |
| ---------------- | -------- | ---------------------------------------------------------------------- |
| `readingTime`    | `json`   | 읽기 시간 (`reading-time` 라이브러리)                                  |
| `locale`         | `string` | 언어 (`kr`, `en`). `data/blog/` 바로 아래 폴더 이름                    |
| `category`       | `string` | 카테고리. 언어 폴더 아래 폴더 이름                                     |
| `slug`           | `string` | `<category>/<파일명>`. 두 언어 버전이 같은 값을 가진다                 |
| `path`           | `string` | 라우트 경로, 앞 `/` 없음 (예: `kr/blog/network/network-ch7-data-link`) |
| `filePath`       | `string` | 실제 파일 경로                                                         |
| `toc`            | `json`   | 목차 (헤딩 구조)                                                       |
| `structuredData` | `json`   | JSON-LD structured data                                                |

---

### Authors

파일 위치: `data/authors/default.mdx`(영어), `data/authors/kr/default.mdx`(한국어)

| 필드명       | 타입     | 필수 | 설명                       |
| ------------ | -------- | ---- | -------------------------- |
| `name`       | `string` | ✅   | 저자 이름                  |
| `avatar`     | `string` |      | 프로필 이미지 URL          |
| `occupation` | `string` |      | 직업/직함                  |
| `company`    | `string` |      | 소속                       |
| `email`      | `string` |      | 이메일                     |
| `twitter`    | `string` |      | Twitter URL                |
| `bluesky`    | `string` |      | Bluesky URL                |
| `linkedin`   | `string` |      | LinkedIn URL               |
| `github`     | `string` |      | GitHub URL                 |
| `layout`     | `string` |      | 사용할 레이아웃 컴포넌트명 |

---

## 빌드 타임 생성 파일

| 파일                                             | 생성 함수                  | 내용                                                                         |
| ------------------------------------------------ | -------------------------- | ---------------------------------------------------------------------------- |
| `app/tag-data.json`                              | `createTagCount()`         | `{ "태그명": 포스트수 }`                                                     |
| `app/category-data.json`                         | `createCategoryCount()`    | `{ "kr": { "카테고리": 포스트수 }, "en": { ... } }`                          |
| `app/translation-data.json`                      | `createTranslationIndex()` | `{ "kr": [slug...], "en": [slug...] }` — 언어 토글이 짝 있는 글을 찾을 때 씀 |
| `public/search-kr.json`, `public/search-en.json` | `createSearchIndex()`      | 언어별 kbar 검색 인덱스                                                      |
| `public/feed.xml`, `public/en/feed.xml`          | `postbuild.mjs`            | 언어별 RSS 피드                                                              |
| `public/sitemap.xml`                             | `app/sitemap.ts`           | 사이트맵                                                                     |
