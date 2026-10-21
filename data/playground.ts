import type { Locale } from './i18n'

/**
 * Playground languages, in header menu and card order.
 * `runner` says where the code runs: 'browser' stays on the visitor's machine,
 * 'compiler-explorer' is sent to godbolt.org to compile and run.
 */
export type PlaygroundId = 'sql' | 'html' | 'javascript' | 'python' | 'c' | 'cpp'

export type PlaygroundLanguage = {
  id: PlaygroundId
  name: string
  runner: 'browser' | 'compiler-explorer'
  /** Engine shown on the card and the practice page */
  engine: string
  summary: Record<Locale, string>
  /** A few lines shown on the card */
  preview: string
}

export const playgroundLanguages: PlaygroundLanguage[] = [
  {
    id: 'sql',
    name: 'SQL',
    runner: 'browser',
    engine: 'SQLite (sql.js)',
    summary: {
      kr: '교재의 COMPANY 데이터베이스에 바로 쿼리를 날립니다. 실행할 때마다 바뀐 행이 표에 표시됩니다.',
      en: 'Query the COMPANY database from the textbook. Every run highlights the rows it changed.',
    },
    preview: 'SELECT Fname, Lname\nFROM EMPLOYEE\nWHERE Dno = 5;',
  },
  {
    id: 'html',
    name: 'HTML',
    runner: 'browser',
    engine: 'Sandboxed iframe',
    summary: {
      kr: 'HTML, CSS, JavaScript를 한 파일에 쓰면 미리보기에 바로 그려집니다.',
      en: 'Write HTML, CSS and JavaScript in one file and watch the preview update as you type.',
    },
    preview:
      '<h1>Hello</h1>\n<style>h1 { color: tomato }</style>\n<script>console.log("hi")</script>',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    runner: 'browser',
    engine: 'Web Worker',
    summary: {
      kr: '브라우저에서 바로 실행합니다. console 출력과 top-level await를 쓸 수 있습니다.',
      en: 'Runs right in your browser, with console output and top-level await.',
    },
    preview: 'const xs = [3, 1, 2]\nconsole.log(xs.toSorted())\n// [ 1, 2, 3 ]',
  },
  {
    id: 'python',
    name: 'Python',
    runner: 'browser',
    engine: 'Pyodide (Python 3.14)',
    summary: {
      kr: '브라우저 안에서 CPython을 돌립니다. 처음 실행할 때 런타임(약 10MB)을 한 번 받아옵니다.',
      en: 'Real CPython inside your browser. The first run downloads the runtime (about 10 MB) once.',
    },
    preview: 'nums = [int(x) for x in input().split()]\nprint(sum(nums))',
  },
  {
    id: 'c',
    name: 'C',
    runner: 'compiler-explorer',
    engine: 'GCC 15.2 · Compiler Explorer',
    summary: {
      kr: 'GCC로 컴파일해서 실행합니다. 입력은 stdin 칸에 미리 적어 둡니다.',
      en: 'Compiled with GCC and run. Put the program input in the stdin box first.',
    },
    preview: '#include <stdio.h>\n\nint main(void) {\n    printf("Hello, C\\n");\n}',
  },
  {
    id: 'cpp',
    name: 'C++',
    runner: 'compiler-explorer',
    engine: 'G++ 15.2 (C++20) · Compiler Explorer',
    summary: {
      kr: 'G++로 컴파일해서 실행합니다. C++20 표준 라이브러리를 그대로 쓸 수 있습니다.',
      en: 'Compiled with G++ and run, with the full C++20 standard library.',
    },
    preview: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, C++\\n";\n}',
  },
]

export function findPlaygroundLanguage(id: string) {
  return playgroundLanguages.find((l) => l.id === id)
}
