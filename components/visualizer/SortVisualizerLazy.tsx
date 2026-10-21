'use client'

import dynamic from 'next/dynamic'
import type { AlgorithmId } from './algorithms'

/** MDX entry point: loads the editor and runners only on posts that use the visualizer */
const SortVisualizer = dynamic(() => import('./SortVisualizer'), {
  ssr: false,
  loading: () => (
    <div className="not-prose my-8 flex h-[640px] items-center justify-center rounded-md border border-gray-200 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
      Loading visualizer…
    </div>
  ),
})

export default function SortVisualizerLazy({ algorithm }: { algorithm: AlgorithmId }) {
  return <SortVisualizer algorithm={algorithm} />
}
