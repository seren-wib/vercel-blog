import type { PlaygroundId } from '@/data/playground'

type CodeId = Exclude<PlaygroundId, 'sql'>

/** Starting code and stdin for each language. Reset brings these back. */
export const examples: Record<CodeId, { code: string; stdin?: string }> = {
  html: {
    code: `<!doctype html>
<html>
  <head>
    <style>
      body { font-family: system-ui, sans-serif; padding: 24px; }
      button { font: inherit; padding: 6px 14px; }
      .count { font-size: 48px; font-weight: 700; margin: 12px 0; }
    </style>
  </head>
  <body>
    <h1>Counter</h1>
    <div class="count" id="count">0</div>
    <button id="add">+1</button>

    <script>
      let n = 0
      document.getElementById('add').addEventListener('click', () => {
        n += 1
        document.getElementById('count').textContent = n
        console.log('clicked', n)
      })
    </script>
  </body>
</html>
`,
  },
  javascript: {
    code: `// Ctrl+Enter (⌘+Enter) runs the code.
const scores = { kim: 82, lee: 95, park: 77 }

const ranked = Object.entries(scores).toSorted(([, a], [, b]) => b - a)
console.log(ranked)

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
for (const [name, score] of ranked) {
  await sleep(300)
  console.log(\`\${name}: \${score}\`)
}
`,
  },
  python: {
    code: `# input() reads one line from the stdin box.
n = int(input())
nums = list(map(int, input().split()))

print(f"count = {n}")
print(f"sum   = {sum(nums)}")
print(f"max   = {max(nums)}")
print(sorted(nums, reverse=True))
`,
    stdin: '5\n3 9 1 7 4\n',
  },
  c: {
    code: `#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    long long sum = 0;
    for (int i = 0; i < n; i++) {
        int x;
        scanf("%d", &x);
        sum += x;
    }
    printf("sum = %lld\\n", sum);
    printf("avg = %.2f\\n", (double)sum / n);
    return 0;
}
`,
    stdin: '5\n3 9 1 7 4\n',
  },
  cpp: {
    code: `#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    int n;
    std::cin >> n;

    std::vector<int> v(n);
    for (auto& x : v) std::cin >> x;

    std::ranges::sort(v);
    for (int x : v) std::cout << x << ' ';
    std::cout << '\\n';
}
`,
    stdin: '5\n3 9 1 7 4\n',
  },
}
