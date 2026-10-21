/**
 * Turns a program's step trace (see algorithms.ts) into animation frames.
 * Each frame is the array after one step, plus what that step touched.
 */
export type Highlight = { kind: 'cmp' | 'swap' | 'sorted'; i: number; j?: number } | null

export type Frame = {
  values: number[]
  sorted: boolean[]
  highlight: Highlight
  phase: string | null
}

export type Trace = {
  input: number[]
  output: number[] | null
  frames: Frame[]
  /** Problems found while replaying, shown under the bars */
  problems: string[]
}

export function parseTrace(stdout: string): Trace {
  const problems: string[] = []
  let input: number[] = []
  let output: number[] | null = null
  const frames: Frame[] = []

  let values: number[] = []
  let sorted: boolean[] = []
  let phase: string | null = null
  const push = (highlight: Highlight) =>
    frames.push({ values: [...values], sorted: [...sorted], highlight, phase })
  const inRange = (k: number) => Number.isInteger(k) && k >= 0 && k < values.length

  for (const raw of stdout.split('\n')) {
    const [cmd, ...rest] = raw.trim().split(/\s+/)
    const nums = rest.map(Number)
    if (cmd === 'INIT') {
      input = nums
      values = [...nums]
      sorted = nums.map(() => false)
      push(null)
    } else if (cmd === 'PHASE') {
      phase = rest.join(' ')
    } else if (cmd === 'CMP' || cmd === 'SWAP') {
      const [i, j] = nums
      if (!inRange(i) || !inRange(j)) {
        problems.push(`Index out of range: ${raw.trim()}`)
        continue
      }
      if (cmd === 'SWAP') [values[i], values[j]] = [values[j], values[i]]
      push({ kind: cmd === 'CMP' ? 'cmp' : 'swap', i, j })
    } else if (cmd === 'SORTED') {
      const [i] = nums
      if (!inRange(i)) {
        problems.push(`Index out of range: ${raw.trim()}`)
        continue
      }
      sorted[i] = true
      push({ kind: 'sorted', i })
    } else if (cmd === 'DONE') {
      output = nums
    }
  }

  if (!frames.length)
    problems.push('The program printed no INIT line, so there is nothing to draw.')
  if (output) {
    if (output.join(' ') !== values.join(' '))
      problems.push('DONE does not match the array rebuilt from the SWAP steps.')
    if (output.some((v, k) => k > 0 && output![k - 1] > v))
      problems.push('DONE is not in ascending order.')
  } else if (frames.length) {
    problems.push('The program ended without a DONE line.')
  }
  return { input, output, frames, problems }
}
