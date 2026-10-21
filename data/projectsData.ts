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
    title: 'Stairno Account',
    status: 'shipped',
    size: 'featured',
    period: { kr: '2026.10 –', en: 'Oct 2026 –' },
    role: {
      kr: '개인 프로젝트 · 기획부터 운영까지 · PR 107개 · 테스트 775개',
      en: 'Personal · from planning to production · 107 PRs · 775 tests',
    },
    summary: {
      kr: 'Stairno 계정 하나로 모든 Stairno 사이트와 제품에 로그인하고, 카드는 한 번만 등록하고, 결제·구독·권한은 API 한 곳에서 처리하는 계정 센터(account.stairno.com)와 공용 API(api.stairno.com). 사이트는 로그인과 결제를 직접 만들지 않고 이 둘을 부릅니다. 기획 문서, 설계, 구현, 배포 파이프라인, 운영 결제 리허설까지 혼자 했고, 결제는 지금 테스트 모드로 운영 중입니다.',
      en: 'The account center (account.stairno.com) and shared API (api.stairno.com) behind every Stairno site: one Stairno account signs in everywhere, a card is saved once, and payments, subscriptions and entitlements live in one API. Sites call these two instead of building sign-in and checkout themselves. I did all of it solo, from planning documents and design through implementation, the deploy pipeline and a production payment rehearsal. Payments run in test mode in production today.',
    },
    highlights: {
      kr: [
        '**문서가 먼저**: 계획서, 요구사항 명세서(요구사항 115개), 설계 명세서, 테스트·배포 문서를 먼저 쓰고 그대로 구현. 테스트 이름과 PR 본문에 요구사항 ID를 달고, 문서와 코드가 어긋나면 같은 PR에서 맞춤',
        '**OIDC 공급자**: 사이트는 OIDC 클라이언트로 붙어 로그인 화면을 따로 두지 않음. PKCE 인가 코드, JWT 액세스 토큰과 JWKS, 리프레시 토큰, 사이트 서버용 `client_credentials` 토큰. 도메인이 다른 사이트의 로그인은 실험 13단계로 먼저 검증한 뒤 설계',
        '**계정**: 가입과 이메일 인증, 비밀번호 재설정·변경, 이메일 변경, 로그인 기기 목록과 모든 기기 로그아웃, 프로필 사진, 계정 삭제, 약관 동의 기록. 허브·계정 센터·사이트가 공용 UI 패키지(`@stairno/ui`)의 계정 메뉴 하나를 같이 씀',
        '**결제**: 토스페이먼츠(원화)와 PayPal(달러)을 어댑터 인터페이스 하나 뒤에 격리. 결제 금액은 서버가 결제사에 다시 조회해 확인하고, 금액은 정수 최소 단위와 통화 쌍으로만 다룸. 카드 번호는 받지 않고 결제사 창이 받음',
        '**구독**: 카드 한 번 등록(빌링키)으로 정기결제. 매일 도는 Cron이 갱신하고, 실패하면 사흘 간격으로 세 번 재시도한 뒤 만료. 기간 말 해지와 재개',
        '**주문과 웹훅**: 주문 상태 기계, 웹훅 서명 검증과 이벤트 ID 멱등 처리, 환불 요청과 운영자 승인, 10분짜리 서명된 다운로드 링크. 결제 스위치 하나로 장애 때 로그인은 살리고 결제만 막음',
        '**메일**: Resend, SPF·DKIM·DMARC 인증. 인증·재설정·영수증·환불·갱신 실패 메일을 한국어·영어로 보냄. 화면과 메일 문구는 두 언어 사전에 같은 키로 넣고, 한쪽이 빠지면 타입 오류',
        '**보안과 개인정보**: CSP와 보안 헤더, HSTS, Origin 검사, 로그인·가입·재설정 속도 제한, 시크릿은 Wrangler 시크릿에만. 개인정보처리방침은 개인정보 보호법 조항과 작성 지침에 맞춰 직접 씀',
        '**TDD로 테스트 775개**: 단위, PGlite 통합, Astro 컴포넌트, workerd 종단 간(e2e). 결제 흐름은 가짜 결제사로 돌림. Lighthouse 접근성 100',
        '**Git Flow와 배포**: `develop`에 기능 PR, `main`에는 release·hotfix만 룰셋으로 허용. CI를 통과해야 머지되고, 머지하면 테스트 → DB 마이그레이션 → API → 계정 센터 순서로 Cloudflare Workers에 배포. 마이그레이션이 실패하면 배포하지 않음. 장애 대응 절차도 문서로 둠',
        '**운영 결제 리허설**: 운영 API에 리허설 전용 사이트를 붙여 결제 시나리오 10개(결제, 금액 조작, 환불, 카드 등록, 구독 갱신 실패 세 번, PayPal, 웹훅 재전송, 결제 스위치, 메일 두 언어)를 테스트 키로 돌려 인수. 그 과정에서 찾은 로그인 404와 메일 링크는 hotfix로 고침',
        '**응답 속도**: 한국 요청이 미국 서부로 들어가는 무료 플랜 안에서 API Worker를 싱가포르 근처에 배치해 JWKS 응답을 816ms → 418ms로 줄임',
        '과정은 블로그 Stairno 시리즈(0편 로드맵부터 4a편 결제 리허설까지)에 결정과 실수까지 그대로 적음',
      ],
      en: [
        '**Documents first**: a project plan, a requirements specification (115 requirements), a design specification and a test-and-deploy document came first, and the code follows them. Tests and PRs cite requirement IDs, and when documents and code disagree, the same PR fixes one of them',
        '**OIDC provider**: sites connect as OIDC clients and never build their own sign-in screens. PKCE authorization code flow, JWT access tokens with JWKS, refresh tokens, and `client_credentials` tokens for site servers. Sign-in across different domains was proven with a 13-step experiment before the design',
        '**Accounts**: sign-up with email verification, password reset and change, email change, a signed-in devices list with sign-out everywhere, profile photos, account deletion and recorded consent to the terms. The hub, the account center and the sites share one account menu from a shared UI package (`@stairno/ui`)',
        '**Payments**: Toss Payments (KRW) and PayPal (USD) isolated behind one adapter interface. The server re-checks every amount with the provider, and money is only ever an integer minor unit paired with a currency. Card numbers never touch the code; the provider window takes them',
        '**Subscriptions**: recurring billing on a card saved once (billing key). A daily cron renews them; a failed renewal is retried three times, three days apart, then the subscription expires. Cancel at period end, and resume',
        '**Orders and webhooks**: an order state machine, webhook signature checks and idempotency by event ID, refund requests with operator approval, and signed download links valid for 10 minutes. One payments switch keeps sign-in up and stops only payments during an outage',
        '**Mail**: Resend with SPF, DKIM and DMARC. Verification, reset, receipt, refund and renewal-failure mail in Korean and English. Screen and mail text live in two dictionaries with the same keys, and a missing key is a type error',
        '**Security and privacy**: CSP and security headers, HSTS, origin checks, rate limits on sign-in, sign-up and reset, and secrets only in Wrangler secrets. I wrote the privacy policy myself against the articles of the Korean Personal Information Protection Act and its drafting guide',
        '**775 tests, test-first**: unit, PGlite integration, Astro component and workerd end-to-end tests. Payment flows run against a fake provider. Lighthouse accessibility 100',
        '**Git Flow and deploys**: feature PRs go into `develop`; rulesets let only release and hotfix branches into `main`. Merges need CI, and a merge deploys to Cloudflare Workers in order: tests → DB migration → API → account center. A failed migration stops the deploy. The incident response procedure is written down too',
        '**Production payment rehearsal**: a rehearsal-only site attached to the production API ran 10 payment scenarios with test keys (payment, tampered amount, refund, card registration, three failed renewals, PayPal, webhook resends, the payments switch, mail in both languages) as the acceptance test. The sign-in 404 and mail link it found were fixed in a hotfix',
        '**Latency**: on the free plan, Korean requests enter Cloudflare on the US west coast. Placing the API Worker near Singapore cut the JWKS response from 816 ms to 418 ms',
        'The whole story, decisions and mistakes included, is in the Stairno series on this blog, from part 0 (roadmap) to part 4a (payment rehearsal)',
      ],
    },
    stack: [
      'Hono',
      'Astro',
      'Better Auth',
      'OIDC',
      'Drizzle',
      'PostgreSQL (Neon)',
      'Cloudflare Workers',
      'Toss Payments',
      'PayPal',
      'Resend',
      'Vitest',
      'GitHub Actions',
    ],
    href: 'https://github.com/seren-wib/account.stairno.com',
  },
  {
    title: 'Stairno',
    status: 'shipped',
    size: 'standard',
    period: { kr: '2026.10', en: 'Oct 2026' },
    role: { kr: '개인 브랜드 · 허브 사이트', en: 'Personal brand · hub site' },
    summary: {
      kr: '제가 만드는 게임과 도구를 묶는 브랜드 Stairno의 허브 사이트. 소개와 Works·Games·Labs 세 프로젝트로 가는 링크만 두고, 판매나 접수는 각 프로젝트 사이트에 맡겼습니다.',
      en: 'The hub site for Stairno, the brand my games and tools ship under. It only introduces the brand and links to the three projects (Works, Games, Labs); sales and intake live on their own sites.',
    },
    highlights: {
      kr: [
        '히어로 전체를 하프톤 점 캔버스로 그림. 첫 접속 때 워드마크가 감긴 지구가 돌다가 점이 흩어지며 계단과 글자로 다시 조립되고, 클릭하면 점이 물결처럼 퍼짐',
        '섹션 단위 풀페이지 스크롤, 섹션 제목도 점 글자, 헤더는 현재 섹션을 따라가는 스크롤스파이',
        '한국어·영어, 다크·라이트 모드. 외부 스크립트와 추적 도구, 쿠키 없이 정적 페이지로만 구성',
        'TDD로 작업해 단위·컴포넌트·통합 테스트 123개. GitHub Actions에서 통과한 빌드만 Cloudflare Pages에 올라감',
      ],
      en: [
        'The whole hero is a halftone-dot canvas. On first visit a globe wrapped in the wordmark spins, then its dots scatter and reassemble into stairs and letters; clicks send a ripple through the dots',
        'Section-by-section full-page scrolling, dot-lettered section headings and a header scrollspy that follows the current section',
        'Korean and English, dark and light modes. Static pages only: no third-party scripts, trackers or cookies',
        'Built test-first: 123 unit, component and integration tests. Only builds that pass GitHub Actions reach Cloudflare Pages',
      ],
    },
    stack: ['Astro', 'TypeScript', 'Canvas', 'Vitest', 'Cloudflare Pages'],
    href: 'https://stairno.com',
  },
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
    title: 'agent-commonplace',
    status: 'shipped',
    size: 'standard',
    period: { kr: '2026.10', en: 'Oct 2026' },
    role: { kr: '개인 오픈소스 · MIT', en: 'Personal open source · MIT' },
    summary: {
      kr: 'Claude Code, Codex, Antigravity가 여러 컴퓨터에서 같은 지시문과 메모리를 쓰게 하는 CLI. 에이전트 훅과 비공개 git 레포 하나로 동기화합니다. 제 dotfiles에서 쓰던 동기화 훅을 누구나 설치할 수 있게 다시 짰습니다.',
      en: 'A CLI that gives Claude Code, Codex and Antigravity the same instructions and memory on every machine, synced through agent hooks and one private git repo. A rewrite of the sync hook from my dotfiles that anyone can install.',
    },
    highlights: {
      kr: [
        '세션 시작 때 pull, 응답마다 commit·push. 세 에이전트의 서로 다른 훅 형식(Claude·Codex의 SessionStart/Stop, Antigravity의 PreInvocation)을 명령 하나로 등록',
        '프로젝트 메모리는 git remote로 짝지어 컴퓨터마다 경로가 달라도 같은 폴더를 공유. 심볼릭 링크 권한이 없는 Windows에선 junction으로 대체하고, 내용이 다른 파일은 `.from-<host>`로 남김',
        '동시에 뜬 훅끼리 FETCH_HEAD를 두고 경합하던 문제를 공유 락으로 해결',
        '의존성 0개, Node 22+. 두 컴퓨터 e2e를 포함한 테스트 24개가 Ubuntu·macOS·Windows × Node 22/24 CI에서 통과',
      ],
      en: [
        "Pulls when a session starts, commits and pushes after each reply. One command registers the three agents' different hook formats (SessionStart/Stop for Claude and Codex, PreInvocation for Antigravity)",
        'Project memory is matched by git remote, so the same folder is shared even when paths differ per machine. Falls back to junctions on Windows without symlink rights and keeps differing files as `.from-<host>`',
        'A shared lock stops hooks that start together from racing on FETCH_HEAD',
        'Zero dependencies, Node 22+. 24 tests, including a two-machine e2e, pass in CI on Ubuntu, macOS and Windows × Node 22/24',
      ],
    },
    stack: ['Node.js', 'Git', 'Claude Code', 'Codex', 'GitHub Actions'],
    href: 'https://github.com/seren-wib/agent-commonplace',
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
      kr: '팀장 · 문서 · 프론트엔드 · 인증 · CI · 오픈소스 웹 수업 팀 프로젝트 (4인, 커밋 168개 중 94개)',
      en: 'Team lead · Docs · Front-end · Auth · CI · Open-source web course team project (team of 4, 94 of 168 commits)',
    },
    summary: {
      kr: '브라우저에서 코드를 작성하고 실행하고 저장하는 온라인 코드 에디터.',
      en: 'A browser-based editor to write, run and save code.',
    },
    highlights: {
      kr: [
        '팀이 보고 일하는 문서를 전부 작성: 개발 환경·기술 스택 버전·폴더 구조를 담은 README, 기여 흐름 CONTRIBUTING, 그리고 API 명세, DB 스키마, 아키텍처, 페이지 정의, 컴포넌트 구조, export 함수명, AI 코딩 도구용 검증 절차·완료 조건까지 스펙 문서 9종',
        'React 19 + Vite + Monaco Editor 프론트엔드 대부분: 라우팅과 인증 가드, 공용 컴포넌트, 라이트·다크 디자인 토큰',
        'bcrypt + JWT 로그인·회원가입 API',
        'GitHub Actions CI(클라이언트·서버 각각 lint, 테스트, 빌드)를 세우고 `main` 보호 규칙으로 CI 통과 시에만 머지. Jest·Supertest, Vitest·React Testing Library',
      ],
      en: [
        'Wrote every document the team worked from: a README with the dev environment, pinned stack versions and folder layout, a CONTRIBUTING workflow, and nine spec docs covering the API, DB schema, architecture, pages, component structure, exported function names, plus a runbook and done conditions for AI coding tools',
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
