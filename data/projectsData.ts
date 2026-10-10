import type { Locale } from './i18n'

type Localized<T = string> = Record<Locale, T>

export interface Project {
  title: string
  /** building = still being worked on, shipped = finished or handed off */
  status: 'building' | 'shipped'
  /** featured = full card with every highlight, standard = card, brief = one line */
  size: 'featured' | 'standard' | 'brief'
  period: Localized
  role?: Localized
  summary: Localized
  highlights?: Localized<string[]>
  stack?: string[]
  href?: string
  /** Private repos are listed without a link */
  private?: boolean
}

const projectsData: Project[] = [
  // Building
  {
    title: 'Atlas Odyssey',
    status: 'building',
    size: 'standard',
    period: { kr: '2026.09 –', en: 'Sep 2026 –' },
    role: {
      kr: '개인 출품작 · 2026 CUVIC 바이브 코딩 대회',
      en: 'Solo entry · CBNU CUVIC Vibe Coding Contest 2026',
    },
    summary: {
      kr: '배운 것을 지도처럼 펼쳐 두고, 한 것을 기록하고, 남은 것을 지도에서 확인하는 개인 학습 아틀라스. my-status를 새 레포와 새 규칙으로 다시 설계하는 프로젝트입니다.',
      en: "A personal learning atlas: lay out everything worth learning as a map, record what's done, and see what's left. A redesign of my-status on a fresh repo with stricter rules.",
    },
    highlights: {
      kr: [
        '코드보다 먼저 AI 에이전트가 일하는 방식부터 설계: 이슈 → 브랜치 → PR → 리뷰 → 머지를 단계별 skill로 쪼개고, PR마다 작업 리포트를 남김',
        '`develop`/`main` 보호 룰셋과 PR 전용 머지, 테스트 우선 흐름으로 레포를 구성',
        '11월 중간 발표, 12월 최종 발표 예정',
      ],
      en: [
        'Designed how the AI agent works before writing app code: issue → branch → PR → review → merge split into per-step skills, with a work report on every PR',
        'Protected `develop`/`main` rulesets, PR-only merges and a test-first flow',
        'Midterm demo in November, final in December',
      ],
    },
    stack: ['Claude Code', 'GitHub Rulesets', 'Agent Skills'],
    href: 'https://github.com/seren-wib/atlas-odyssey',
  },
  {
    title: 'kibotos.dev',
    status: 'building',
    size: 'standard',
    period: { kr: '2026.05 –', en: 'May 2026 –' },
    role: { kr: '개인 프로젝트 · 이 블로그', en: 'Personal · this blog' },
    summary: {
      kr: '컴퓨터공학 수업 노트와 프로젝트 기록을 올리는 한국어·영어 블로그. Tailwind Next.js 스타터에서 시작해 구조 대부분을 다시 짰습니다.',
      en: 'A Korean/English blog for CS course notes and project write-ups. Started from the Tailwind Next.js starter and reworked most of its structure.',
    },
    highlights: {
      kr: [
        '`/kr`·`/en` 두 언어 라우팅: 같은 파일명으로 번역 글을 짝짓는 언어 토글, hreflang, 언어별 RSS·검색 인덱스, 브라우저 언어로 첫 화면 결정',
        '강의 노트(iCloud 마크다운) → MDX 발행 파이프라인을 문서로 정의해 AI 에이전트가 이미지 복사, MDX 이스케이프, 영어 번역까지 같은 규칙으로 처리',
        '과목별 카테고리 폴더, 파일명 자연 정렬로 장 순서, 고정 목차 사이드바. URL을 바꿀 때마다 308 리다이렉트로 옛 주소 유지',
        '모든 변경은 PR로 올리고 CI(lint, 타입 검사, 빌드)를 통과해야 머지 → Vercel 자동 배포',
      ],
      en: [
        'Two-locale routing under `/kr` and `/en`: a language toggle that pairs translations by file name, hreflang, per-locale RSS and search indexes, and a landing redirect by browser language',
        'A documented lecture-notes (iCloud Markdown) → MDX pipeline, so an AI agent copies images, escapes MDX and writes the English translation by the same rules every time',
        'Per-course category folders, chapter order from natural file-name sorting, and a sticky table of contents. Every URL change keeps the old address alive with a 308 redirect',
        'Every change goes through a PR and must pass CI (lint, type check, build) before merge, then deploys to Vercel',
      ],
    },
    stack: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Contentlayer', 'Vercel', 'GitHub Actions'],
    href: 'https://github.com/seren-wib/vercel-blog',
  },
  {
    title: 'Coffee Shop',
    status: 'building',
    size: 'standard',
    period: { kr: '2026.09 –', en: 'Sep 2026 –' },
    role: {
      kr: '팀장 · 프론트엔드 · 소프트웨어공학 텀 프로젝트 (3인)',
      en: 'Team lead · Front-end · Software Engineering term project (team of 3)',
    },
    summary: {
      kr: '커피 원두를 파는 온라인 쇼핑몰. 요구사항 분석부터 설계 명세, 구현까지 소프트웨어공학 수업 단계를 그대로 밟습니다.',
      en: 'An online shop for coffee beans, built through the full Software Engineering course cycle: requirements, design specs, then code.',
    },
    highlights: {
      kr: [
        '레포 초기 구성, 이슈 → 브랜치 → PR 기여 흐름, "확정본은 `docs/`" 문서 규칙과 언어 규칙을 정함',
        '요구사항 정의서와 유스케이스 다이어그램 작성. 회원 주문 취소는 관리자 승인을 거치는 상태 전이로 설계',
        'Django 백엔드 위 React + Vite 프론트엔드 담당. 11월 구현, 12월 최종 보고',
      ],
      en: [
        'Set up the repo, the issue → branch → PR workflow, and the rules for documents (`docs/` is the source of truth) and languages',
        'Wrote the requirements definition and use case diagrams; order cancellation goes through an admin-approved state transition',
        'Owns the React + Vite front-end on top of a Django back-end. Implementation in November, final report in December',
      ],
    },
    stack: ['React', 'Vite', 'Django', 'SQLite'],
    href: 'https://github.com/seren-wib/coffee-shop',
  },
  {
    title: 'dotfiles',
    status: 'building',
    size: 'standard',
    period: { kr: '2026.10 –', en: 'Oct 2026 –' },
    role: { kr: '개인 도구', en: 'Personal tooling' },
    summary: {
      kr: 'Claude Code, Codex, Gemini(Antigravity), VS Code 설정을 한 레포에 모아 Windows와 macOS에서 같이 쓰는 개발 환경.',
      en: 'One repo for Claude Code, Codex, Gemini (Antigravity) and VS Code config, shared between Windows and macOS.',
    },
    highlights: {
      kr: [
        '링크 목록 `links.txt` 하나를 `install.ps1`·`install.sh`가 같이 읽어 두 OS에 심볼릭 링크로 설치. 기존 파일은 시간별 백업 폴더로 옮김',
        '세 에이전트가 같은 훅을 공유하고, 전역 메모리를 레포로 동기화해 어느 기기에서 열어도 같은 맥락으로 시작',
        '앱이 머신별 경로를 써넣는 Codex `config.toml`은 링크하지 않고 MCP 서버 목록만 병합. Unity MCP 설정 skill과 로컬 VS Code 확장도 포함',
      ],
      en: [
        'A single `links.txt` read by both `install.ps1` and `install.sh` symlinks everything on either OS, moving existing files to a timestamped backup',
        'Three agents share the same hooks, and global memory syncs through the repo, so every machine starts with the same context',
        "Codex's `config.toml` holds machine-specific paths, so only the MCP server list is merged into it instead of linking. Also ships a Unity MCP setup skill and a local VS Code extension",
      ],
    },
    stack: ['PowerShell', 'Bash', 'Node.js', 'Claude Code', 'Codex'],
    private: true,
  },
  {
    title: 'Vane',
    status: 'building',
    size: 'brief',
    period: { kr: '2026.08 –', en: 'Aug 2026 –' },
    summary: {
      kr: 'Unity 2D 탑다운 스토리 어드벤처. 프로토타입 단계.',
      en: 'A 2D top-down story adventure in Unity. Prototype stage.',
    },
    private: true,
  },

  // Shipped
  {
    title: 'my-status',
    status: 'shipped',
    size: 'featured',
    period: { kr: '2026.08 – 2026.09', en: 'Aug – Sep 2026' },
    role: { kr: '개인 프로젝트 · 커밋 136개', en: 'Personal · 136 commits' },
    summary: {
      kr: '배우고 싶은 모든 것을 로드맵으로 쪼개고, 학습 기록을 쌓으면 RPG 상태창처럼 능력치가 다시 계산되는 개인 상태창. 2주 동안 데이터 모델, 도구, 프론트까지 혼자 만들었습니다.',
      en: 'An RPG-style status board for myself: everything I want to learn is broken into roadmaps, and logging what I study regenerates my stats. Built solo in two weeks, from data model to tooling to front-end.',
    },
    highlights: {
      kr: [
        '9개 분야 로드맵 348개. 소프트웨어 분야만 로드맵 181개, 항목 18,623개',
        '파이썬 표준 라이브러리만 쓰는 도구 7종: md → json 파서, 스탯 빌더, 항목·고아 로드맵·배치 정합성 검사기',
        '스탯 모델 설계: 항목마다 수준 `lv` 1–4와 진행중 플래그 `doing`을 따로 두고, 숙련도는 가중치 0.05 / 0.2 / 0.6 / 1.0의 볼록한 곡선으로 계산해 "이름만 앎"이 쌓여도 실전 실증이 목표로 남게 함',
        '로그(JSONL)가 유일한 원본이고 진행도와 스탯은 매번 로그에서 재생성. 바닐라 JS 프론트에서 카드를 누르면 로컬 서버(`POST /api/log`)가 같은 로그에 기록하고 스탯을 다시 빌드',
        '로드맵 261개는 AI로 작성하고 `AI 생성` 태그로 표시. 설명 문구 배치 작업은 배치당 비용을 실측해 기록하고 검사기로 드리프트를 잡음',
        '공개용 사본은 개인 기록과, 라이선스상 재배포가 안 되는 roadmap.sh 유래 로드맵 87개를 걷어내고 구조와 도구만 공개',
      ],
      en: [
        '348 roadmaps across 9 domains; software alone has 181 roadmaps and 18,623 items',
        'Seven tools on the Python standard library only: an md → json parser, a stat builder, and consistency checkers for items, orphan roadmaps and batches',
        'Stat model: each item carries a level `lv` 1–4 and a separate `doing` flag; proficiency uses convex weights 0.05 / 0.2 / 0.6 / 1.0 so knowing names never outweighs demonstrated practice',
        'The JSONL log is the only source of truth; progress and stats are rebuilt from it every time. Clicking a card in the vanilla JS front-end writes to the same log through a local server (`POST /api/log`) and rebuilds the stats',
        '261 roadmaps were written with AI and tagged as such. Description batches were run with measured per-batch cost, and checkers caught drift',
        'The public snapshot drops personal logs and the 87 roadmap.sh-derived roadmaps whose license forbids redistribution, keeping the structure and tools',
      ],
    },
    stack: ['Python', 'JavaScript', 'HTML/CSS', 'JSONL', 'Claude Code'],
    href: 'https://github.com/seren-wib/my-status-public',
  },
  {
    title: 'SCPC 2026 AI Agent Harness',
    status: 'shipped',
    size: 'standard',
    period: { kr: '2026.07', en: 'Jul 2026' },
    role: { kr: '개인 · SCPC 2026 예선 (DACON)', en: 'Solo · SCPC 2026 qualifier (DACON)' },
    summary: {
      kr: '개인 기기 에이전트가 요청을 받았을 때 대상, 진행 여부, 계획, 공개 범위, 위험 플래그를 판단하는 규칙 기반 하네스. 답안 생성에 외부 LLM을 쓸 수 없는 대회였습니다.',
      en: 'A rule-based harness that decides, for an on-device agent request, the referent, whether to proceed, the plan, disclosure scope and risk flags. External LLMs were not allowed for answers.',
    },
    highlights: {
      kr: [
        '공개 점수 **0.8408** (baseline 0.5206). 상위 100 커트라인 0.8788에는 못 미쳐 예선 탈락. 로컬 dev 정확도 0.9416',
        '정답 공개된 연습 과제 120개와 하루 3회 서버 점수만으로 채점 구조를 역추론. 축별 정확도를 역산하는 프로브 생성기를 따로 만듦',
        '파이썬 표준 라이브러리만 쓰는 단일 파일 984행, 연속 실행 md5가 같은 결정론적 출력',
        '입력이 완전히 같은데 정답이 다른 과제를 찾아 정확도 상한이 1.0이 아님을 문서로 남김',
      ],
      en: [
        'Public score **0.8408** (baseline 0.5206); missed the top-100 cutoff of 0.8788. Local dev accuracy 0.9416',
        'Reverse-engineered the grader from 120 solved practice tasks and three server submissions a day, with a probe generator to back out per-axis accuracy',
        'One 984-line file on the Python standard library, deterministic down to identical md5 across runs',
        'Documented tasks with identical inputs but different answers, showing the accuracy ceiling is below 1.0',
      ],
    },
    stack: ['Python 3.12'],
    href: 'https://github.com/seren-wib/scpc-2026-agent-harness',
  },
  {
    title: 'Online Code Editor',
    status: 'shipped',
    size: 'standard',
    period: { kr: '2026.03 – 2026.06', en: 'Mar – Jun 2026' },
    role: {
      kr: '프론트엔드 · 인증 · CI · 오픈소스 웹 수업 팀 프로젝트 (4인, 커밋 168개 중 94개)',
      en: 'Front-end · Auth · CI · Open-source web course team project (team of 4, 94 of 168 commits)',
    },
    summary: {
      kr: '브라우저에서 코드를 작성하고 실행하고 저장하는 온라인 코드 에디터.',
      en: 'A browser-based editor to write, run and save code.',
    },
    highlights: {
      kr: [
        'React 19 + Vite + Monaco Editor 프론트엔드 대부분: 라우팅과 인증 가드, 공용 컴포넌트, 라이트·다크 디자인 토큰',
        'bcrypt + JWT 로그인·회원가입 API',
        'GitHub Actions CI(클라이언트·서버 각각 lint, 테스트, 빌드)를 세우고 `main` 보호 규칙으로 CI 통과 시에만 머지. Jest·Supertest, Vitest·React Testing Library',
      ],
      en: [
        'Most of the React 19 + Vite + Monaco Editor front-end: routing and auth guards, shared components, light/dark design tokens',
        'Login and registration API with bcrypt + JWT',
        'Set up GitHub Actions CI (lint, test, build for both client and server) and protected `main` so only green PRs merge. Jest, Supertest, Vitest, React Testing Library',
      ],
    },
    stack: ['React', 'Vite', 'Monaco Editor', 'Express', 'MySQL', 'JWT', 'GitHub Actions'],
    href: 'https://github.com/seren-wib/opensource-web-azas',
  },
  {
    title: 'usb-kit',
    status: 'shipped',
    size: 'standard',
    period: { kr: '2026.09', en: 'Sep 2026' },
    role: { kr: '개인 도구', en: 'Personal tooling' },
    summary: {
      kr: '학교 실습실 Ubuntu에 USB를 꽂고 명령 하나로 GitHub와 Claude Code에 로그인하고, 나올 때 흔적을 전부 지우는 휴대용 개발 키트. sudo 없이 동작합니다.',
      en: 'A portable kit for school lab Ubuntu PCs: plug in a USB stick, log into GitHub and Claude Code with one command, and leave no trace on exit. No sudo required.',
    },
    highlights: {
      kr: [
        '토큰은 USB 안 gocryptfs 암호화 볼륨에만 두고, 세션 중 gh 토큰은 tmpfs에만. 세션에서 갱신된 Claude 토큰은 종료 때 볼륨에 되써넣음',
        'bash 스크립트 하나(462행)에 init / up / down / status / fetch. 호스트에 git이 없으면 USB에 풀어둔 git으로 대체, 로그인 브라우저는 사생활 창으로',
        'Ubuntu 26.04 VM에서 설치 → 로그인 → 정리 → 재부팅 후 재로그인까지 전 과정 검증',
      ],
      en: [
        'Tokens live only in a gocryptfs-encrypted vault on the stick, gh tokens only in tmpfs during a session, and refreshed Claude tokens are written back on exit',
        'One 462-line bash script with init / up / down / status / fetch; falls back to a bundled git when the host has none, and opens logins in a private window',
        'Verified end to end on an Ubuntu 26.04 VM: setup, login, cleanup, and re-login after reboot',
      ],
    },
    stack: ['Bash', 'gocryptfs', 'GitHub CLI', 'Claude Code'],
    private: true,
  },
  {
    title: 'Amazon Price Scraper',
    status: 'shipped',
    size: 'standard',
    period: { kr: '2026.01', en: 'Jan 2026' },
    role: { kr: '개인 · 프리랜스 포트폴리오', en: 'Solo · freelance portfolio piece' },
    summary: {
      kr: '아마존 검색 결과를 수집해 SQLite와 CSV로 저장하고 Streamlit 대시보드로 가격을 보여 주는 스크래퍼.',
      en: 'Scrapes Amazon search results into SQLite and CSV and shows prices on a Streamlit dashboard.',
    },
    highlights: {
      kr: [
        'ScraperAPI로 프록시 순환과 CAPTCHA 처리, 로컬 브라우저 없이 `requests`만 사용',
        'BeautifulSoup 파싱에 일시 오류 재시도·백오프, 마지막 페이지에서 멈추는 페이지네이션',
      ],
      en: [
        'ScraperAPI for proxy rotation and CAPTCHA solving, plain `requests` with no local browser',
        'BeautifulSoup parsing with retry and backoff on transient errors, pagination that stops at the last page',
      ],
    },
    stack: ['Python', 'BeautifulSoup', 'SQLite', 'Streamlit'],
    href: 'https://github.com/seren-wib/amazon-price-scraper',
  },
  {
    title: 'Uncapped Construction',
    status: 'shipped',
    size: 'brief',
    period: { kr: '2026.09', en: 'Sep 2026' },
    summary: {
      kr: '건물당 주간 건설 상한을 없애는 Victoria 3 모드.',
      en: 'A Victoria 3 mod that removes the per-building weekly construction cap.',
    },
    href: 'https://github.com/seren-wib/vic3-mod-construction-cap',
  },
]

export default projectsData
