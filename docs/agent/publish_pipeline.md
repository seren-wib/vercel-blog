# UNIV 노트 → 블로그 발행 파이프라인

iCloud `UNIV` 폴더의 강의 정리 문서를 블로그 글로 옮겨 배포하는 절차. 사용자가 "이거 블로그에 올려줘"라고 하면 이 순서를 따른다.

> 블로그 구조(카테고리·목차·장 순서)는 아래 "블로그 구조" 절 참고. 확정된 방침은 "결정 사항"에 있다.

---

## 원본 위치

| 항목           | 경로                                                                      |
| -------------- | ------------------------------------------------------------------------- |
| UNIV 루트      | `~/Library/Mobile Documents/com~apple~CloudDocs/UNIV`                     |
| 정리 문서      | `UNIV/<학기>/<과목>/docs/*.md` (예: `3-2/데이터베이스시스템/docs/ch2.md`) |
| 정리 문서 그림 | `UNIV/<학기>/<과목>/img/` (본문에서 `../img/<파일>`로 링크)               |
| 폴더 규칙      | `UNIV/CLAUDE.md` (파일명 규칙, AI 생성 태그 형식)                         |

- 링크(심볼릭 링크)는 걸지 않는다. Vercel 빌드 환경엔 iCloud 경로가 없으므로 **파일을 복사**해 온다.
- 원본은 수정하지 않는다. 변환은 레포 쪽 복사본에서만 한다.

### 가져오지 않는 것

- **문서 전체를 AI가 작성한 정리 문서.** 사용자가 나중에 직접 다시 쓸 예정이므로 블로그에 올리지 않는다. 첫 줄에 `> **AI 생성 문서.**` 태그가 있으면 AI 문서지만, 태그가 빠진 AI 문서도 있으므로 태그가 없다고 사용자 필기로 단정하지 않는다. 사용자가 직접 쓴 필기에 사용자 요청으로 AI가 표·예시 등을 덧붙인 문서는 올려도 된다.
- `_old/`, `tree/` 폴더
- 시험 대비 압축본·총정리·퀴즈 모음 (`*총결산*`, `*압축*`, `*exam*review*`, `final-test.md` 등) — 사용자가 지정한 경우만 예외
- 과제(`hw/`, `practice/`, `task N/`), 강의 PDF, 강의계획서 — 과제는 사용자가 지정하면 아래 "과제 보고서" 절대로 블로그 글로 다시 쓴다
- `haeul/` 전체 (단체 계정 정보 포함)

---

## 1. 가져오기

1. **사용자가 지정한 문서만** 가져온다. 과목 폴더를 통째로 훑어서 임의로 고르지 않는다. 지정한 문서에 AI 생성 태그가 있으면 가져오기 전에 사용자에게 알린다.
2. 중복 확인: `data/blog/` 전체에서 같은 장·같은 제목의 글이 이미 있는지 찾는다. 있으면 덮어쓰기인지 사용자에게 묻는다.
3. 파일을 `data/blog/<category>/`로 복사한다. 카테고리는 과목 단위이고, 새 과목이면 폴더를 만들고 `data/categories.ts`에 영어 표시 이름을 추가한다 (예: `'computer-systems': 'Computer Systems'`).

## 2. 변환

### 파일명

- 확장자는 반드시 `.mdx` (`contentlayer.config.ts`의 `filePathPattern: 'blog/**/*.mdx'` — `.md`는 사이트에 안 뜬다).
- kebab-case, 공백 금지. **파일명이 카테고리 안 장 순서를 정한다** (숫자는 수치로 비교: `ch2` < `ch10`). 장 번호를 앞에 둔다: `ch1-big-picture.mdx`, `ch2-data-representation.mdx`.
- 같은 장의 부록처럼 본문 뒤에 와야 하면 장 번호 뒤에 글자를 붙인다: `ch4-transmission-media` 다음 `ch4a-appendix-antenna-propagation`.
- 파일명(slug)이 URL이 되므로 한 번 발행한 글의 파일명을 바꾸면 `data/redirects.js`에 예전 주소를 추가한다.

### frontmatter

```yaml
---
title: 'CH9. Switched Network (1)'
date: 'YYYY-MM-DD' # 발행하는 날(오늘). 원본 작성일이 아님
tags: ['Network']
draft: false
summary: '본문 핵심 키워드를 쉼표로 나열'
---
```

- **`date`는 쓰기 직전에 `date +%F`로 오늘 날짜를 확인해서 넣는다.** 대화 앞부분이나 다른 글 frontmatter, 원본 파일의 날짜를 가져다 쓰지 않는다.
- 제목 형식은 `CH<n>. <장 제목>`. 장 제목은 강의 PDF 제목을 따른다.
- `tags`는 카테고리 표시 이름과 같게 한다 (`['Computer Systems']`). 화면에는 태그가 안 보이고 카테고리만 보이지만, RSS 카테고리별 피드가 태그로 만들어지므로 비우지 않는다.
- `summary`는 본문을 읽고 다룬 개념을 나열한다.

### 본문

- 원문 헤딩(`#`~`####`)은 그대로 둔다. 글 목차가 `#`~`####` 헤딩에서 자동으로 만들어진다.
- MDX 파싱 깨짐 방지: 코드 블록·인라인 코드 밖의 `{`, `}`, `<`는 `\{`, `\}`, `&lt;`로 이스케이프한다 (예: `논리게이트<논리회로` → `논리게이트 &lt; 논리회로`).
- 리스트 항목 같은 줄에 붙은 표(`3. UNICODE| 구분 |`)는 줄을 나눠야 표로 렌더링된다.
- 비어 있는 섹션(제목만 있는 헤딩)이 있으면 발행 전에 사용자에게 알린다.

### 이미지

1. 본문의 이미지 링크(`![...](../img/x.svg)`, `<img src=...>`)를 전부 찾는다.
2. 원본 파일을 `public/static/images/<category>/`로 복사한다. 파일명은 `<장>-<내용>.<ext>` (예: `ch2-logic-gates.svg`).
3. 본문 경로를 `/static/images/<category>/<파일명>`으로 바꾼다.
4. HEIC는 `sips -s format jpeg <in> --out <out>.jpg`로 변환한다.
5. 링크는 있는데 원본 파일이 없으면 발행 전에 사용자에게 알린다.

### 과제 보고서 (PDF·docx → 블로그 글)

원본(`UNIV/<학기>/<과목>/hw/hwN/`)은 그대로 두고, 블로그 글(mdx)과 이미지는 이 레포에만 둔다. 레포 쪽 결과물을 UNIV에 다시 쓰지 않는다.

- **파일명**: 장이 아니라 과제 번호로 `hwN-<내용>.mdx` (예: `hw2-kvm-vm-cluster.mdx`). 제목은 `HWN. <내용>`.
- **본문 읽기**: `pdftotext -layout`으로 뽑아 **모든 페이지를 끝까지** 읽는다. 과제 안내 PDF(`2026-F-*-HWN.pdf`)도 같이 읽어 항목을 확인한다.
- **다시 쓰기**: 보고서 형식을 블로그 글로 바꾼다. 빼는 것: 표지·학번·이름, `답:` 표시, 목차, "Reading Assignment" 같은 제출용 항목, 교수님께 드리는 말(승인·피드백 감사 등). 남기는 것: 실습 과정, 명령어(코드 블록), 문제 해결 과정, 연습문제 답(질문을 헤딩으로).
- **이미지 추출**:
  - docx가 있으면 `unzip`해서 `word/media/`의 원본을 쓴다. 본문 순서는 `word/document.xml`의 `r:embed` 순서와 `word/_rels/document.xml.rels`로 확인한다.
  - PDF만 있으면 `pdfimages -list`로 확인하고 `pdfimages -png`로 뽑는다. smask(투명도 마스크)가 짝으로 있으면 `magick <img> <mask> -alpha off -compose CopyOpacity -composite -background white -alpha remove`로 합친다.
  - 표지 로고(첫 페이지 204×204 같은 작은 이미지)는 뺀다.
  - `cwebp -q 82`로 webp 변환해 `public/static/images/<category>/hwN-01.webp`처럼 그림 번호순으로 저장한다.
  - 몇 장은 직접 열어 그림 번호와 맞는지, 학번 같은 개인정보가 찍혔는지 확인한다.
- **캡션**: 이미지 아래 기울임 한 줄 (prettier가 `_캡션_`으로 맞춘다).
- **코드 블록**: 언어가 없으면 `text`를 붙인다 (기본값이 js라 색이 잘못 칠해진다). 파일 이름은 ` ```bash:date.sh ` 형식.

## 3. 검증·배포

1. `main` 최신화 후 브랜치 생성: `docs/<category>-<내용>` (예: `docs/network-ch9`).
2. `npm run build` — 통과하고 `.next/server/app/blog/`에 해당 slug 페이지가 생성됐는지 확인한다. 빌드가 `app/tag-data.json`을 갱신하면 같이 커밋한다.
3. 커밋 메시지: `docs: add <category> <chapter> notes` (Conventional Commits, `.claude/commands/git-flow.md` 규칙).
4. 푸시 → PR 생성 → CI 대기 → 머지. 머지되면 Vercel이 `main`을 자동 배포한다.
   - CI(`.github/workflows/ci.yml`)는 `main` 대상 PR에서 돈다. **CI가 성공해야 머지한다**: `gh pr checks <number> --watch`로 끝까지 기다리고, 실패하면 고쳐서 다시 푸시한다.
   - 원격 저장소 이름이 바뀐 뒤로 `gh`가 레포를 못 찾을 수 있으므로 `--repo seren-wib/vercel-blog`를 붙인다.
   - auto mode에서 `gh pr create` / `gh pr merge`가 막히면, 사용자에게 명령어를 넘기고 멈춘다.
5. 배포 확인: `https://kibotos.dev/blog/<category>/<file>/`가 200인지 `curl`로 확인한다.

---

## 블로그 구조

- **카테고리**: `data/blog/<category>/` 폴더 = 카테고리. `category` 필드는 `contentlayer.config.ts`에서 폴더 이름으로 계산하고, 글 수는 빌드 때 `app/category-data.json`에 기록된다. 표시 이름과 사이드바 순서는 `data/categories.ts`.
- **URL**: 글 `/blog/<category>/<file>/`, 카테고리 목록 `/blog/category/<category>/`. 폴더 분리 전 주소와 예전 태그 페이지(`/tags/...`)는 `data/redirects.js`에서 308 리다이렉트.
- **태그 없음**: 화면 분류는 카테고리 하나만 쓴다. 태그 페이지·사이드바 태그 목록·헤더 Tags 메뉴는 없앴다.
- **장 순서**: 카테고리 페이지와 글 하단 이전/다음 링크는 `sortByChapter`(파일명 자연 정렬). 블로그 전체 목록은 날짜순.
- **목차**: `components/TableOfContents.tsx`. 데스크톱은 왼쪽 사이드바에 고정 + 현재 섹션 강조, 모바일은 본문 위 접이식. `#`~`####` 헤딩 대상.

---

## 결정 사항

- 카테고리 이름은 영어. 과목이 아닌 글은 주제별(`unity`, `git`, `sql`).
- 목차와 카테고리 장 순서는 필수.
- `date`는 발행하는 날.
- URL은 `/blog/<category>/<slug>`로 바꾼다 (기존 URL은 리다이렉트).
- 카테고리는 과목 단위로 나눈다.
- 문서 전체를 AI가 작성한 정리 문서는 블로그에 올리지 않는다. 사용자 필기에 일부 AI 보충이 들어간 건 괜찮다.
- 가져오기 범위는 사용자가 지정한 문서만.
