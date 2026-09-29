# dev-blog

seren-wib의 개인 개발 블로그. Next.js 15 + Contentlayer2 기반으로 MDX 포스트를 작성합니다.

**사이트:** https://kibotos.dev  
**저장소:** https://github.com/seren-wib/vercel-blog

---

## 스택

| 항목          | 버전    |
| ------------- | ------- |
| Node.js       | 22.x    |
| Next.js       | 15.5.12 |
| React         | 19.2.4  |
| TypeScript    | 5.9.x   |
| Contentlayer2 | 0.5.8   |
| Tailwind CSS  | 4.x     |
| 패키지 매니저 | npm     |

---

## 폴더 구조

```
├── app/                  # Next.js App Router
├── components/           # 공통 UI 컴포넌트
├── layouts/              # 포스트/목록 레이아웃
├── data/
│   ├── blog/             # MDX 블로그 포스트
│   ├── authors/          # 저자 정보
│   ├── siteMetadata.js   # 전역 사이트 설정
│   └── projectsData.ts   # 프로젝트 목록
├── public/static/        # 이미지 등 정적 파일
├── contentlayer.config.ts
└── docs/                 # 에이전트용 프로젝트 문서
```

---

## 개발

```bash
npm install    # 의존성 설치
npm run dev    # 개발 서버 (http://localhost:3000)
```

---

## 검증

```bash
npm run lint       # ESLint
npx tsc --noEmit   # 타입 체크
npm run build      # 빌드
```

---

## 포스트 작성

`data/blog/` 에 `.mdx` 파일 추가. 필수 frontmatter:

```yaml
---
title: '제목'
date: '2025-01-01'
tags: ['tag1', 'tag2']
summary: '요약'
---
```

---

## 라이선스

[MIT](LICENSE)
