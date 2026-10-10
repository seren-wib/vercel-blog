/**
 * Old flat post URLs (/blog/<slug>) from before posts were split into category folders.
 * Each maps to the post's current path under /blog/<category>/.
 */
const movedPosts = {
  '01unity': 'unity/unity-01-basics',
  'unity-err': 'unity/unity-err',
  '05-03딥러닝': 'ai/ai-05-03-deep-learning',
  '05-04CNN': 'ai/ai-05-04-cnn',
  '06-01LLM': 'ai/ai-06-01-llm',
  '07-01AI-agent': 'ai/ai-07-01-ai-agent',
  '06sync': 'os/os-06-sync-1',
  '07sync': 'os/os-07-sync-2',
  '08sched': 'os/os-08-scheduling',
  '09mem': 'os/os-09-memory',
  '10virtual-mem1': 'os/os-10-virtual-memory-1',
  '11virtual-mem2': 'os/os-11-virtual-memory-2',
  '12virtual-mem3': 'os/os-12-virtual-memory-3',
  '13IO': 'os/os-13-io',
  '14storage': 'os/os-14-storage',
  '15filesystem': 'os/os-15-file-system',
  'network-overview': 'network/network-ch1-2-overview',
  'ch3-data-transmission': 'network/network-ch3-data-transmission',
  'ch4-transmission-media': 'network/network-ch4-transmission-media',
  'ch4-appendix-antenna-propagation': 'network/network-ch4a-appendix-antenna-propagation',
  'ch5-encoding': 'network/network-ch5-encoding',
  'ch6 error correction': 'network/network-ch6-error-correction',
  'ch7-data-link': 'network/network-ch7-data-link',
  'ch8-multiplexing': 'network/network-ch8-multiplexing',
  'ch9-wan-1': 'network/network-ch9-wan-1',
}

/**
 * Post URLs under /blog/<category>/ from before slugs got the category prefix and English-only names.
 */
const renamedPosts = {
  'ai/05-03딥러닝': 'ai/ai-05-03-deep-learning',
  'ai/05-04CNN': 'ai/ai-05-04-cnn',
  'ai/06-01LLM': 'ai/ai-06-01-llm',
  'ai/07-01AI-agent': 'ai/ai-07-01-ai-agent',
  'ai/07-02Agent': 'ai/ai-07-02-rag',
  'cloud-computing/hw1-cloud-basics': 'cloud-computing/cloud-computing-hw1-cloud-basics',
  'cloud-computing/hw2-kvm-vm-cluster': 'cloud-computing/cloud-computing-hw2-kvm-vm-cluster',
  'cloud-computing/hw3-htcondor-cluster': 'cloud-computing/cloud-computing-hw3-htcondor-cluster',
  'computer-systems/ch1-big-picture': 'computer-systems/computer-systems-ch1-big-picture',
  'computer-systems/ch2-data-representation':
    'computer-systems/computer-systems-ch2-data-representation',
  'network/ch1-2-network-overview': 'network/network-ch1-2-overview',
  'network/ch3-data-transmission': 'network/network-ch3-data-transmission',
  'network/ch4-transmission-media': 'network/network-ch4-transmission-media',
  'network/ch4a-appendix-antenna-propagation': 'network/network-ch4a-appendix-antenna-propagation',
  'network/ch5-encoding': 'network/network-ch5-encoding',
  'network/ch6-error-correction': 'network/network-ch6-error-correction',
  'network/ch7-data-link': 'network/network-ch7-data-link',
  'network/ch8-multiplexing': 'network/network-ch8-multiplexing',
  'network/ch9-wan-1': 'network/network-ch9-wan-1',
  'os/06sync': 'os/os-06-sync-1',
  'os/07sync': 'os/os-07-sync-2',
  'os/08sched': 'os/os-08-scheduling',
  'os/09mem': 'os/os-09-memory',
  'os/10virtual-mem1': 'os/os-10-virtual-memory-1',
  'os/11virtual-mem2': 'os/os-11-virtual-memory-2',
  'os/12virtual-mem3': 'os/os-12-virtual-memory-3',
  'os/13IO': 'os/os-13-io',
  'os/14storage': 'os/os-14-storage',
  'os/15filesystem': 'os/os-15-file-system',
  'software-engineering/ch1-overview': 'software-engineering/software-engineering-ch1-overview',
  'software-engineering/ch2-process-models':
    'software-engineering/software-engineering-ch2-process-models',
  'sql/mysql-cheatsheet': 'sql/sql-mysql-cheatsheet',
  'unity/01unity': 'unity/unity-01-basics',
}

const encodePath = (postPath) => postPath.split('/').map(encodeURIComponent).join('/')

/**
 * Old post URLs go straight to the Korean post (posts were Korean-only before /kr and /en existed).
 * URLs without a locale prefix that are not listed here are sent to /kr by middleware.ts.
 */
const postRedirects = Object.entries({ ...movedPosts, ...renamedPosts }).map(([from, to]) => ({
  source: `/blog/${encodePath(from)}`,
  destination: `/kr/blog/${encodePath(to)}/`,
  permanent: true,
}))

/**
 * Tag pages were replaced by category pages. Every tag slug matches a category folder name.
 */
const tagRedirects = [
  { source: '/tags', destination: '/kr/blog/category/', permanent: true },
  { source: '/tags/:tag', destination: '/kr/blog/category/:tag/', permanent: true },
  {
    source: '/tags/:tag/page/:page',
    destination: '/kr/blog/category/:tag/page/:page/',
    permanent: true,
  },
]

/**
 * The full post list lives on each locale's landing page. Page 1 of the list is the landing page itself.
 */
const listRedirects = [
  { source: '/blog', destination: '/kr/', permanent: true },
  { source: '/blog/page/1', destination: '/kr/', permanent: true },
  { source: '/blog/page/:page', destination: '/kr/page/:page/', permanent: true },
  { source: '/page/1', destination: '/kr/', permanent: true },
  { source: '/:locale(kr|en)/page/1', destination: '/:locale/', permanent: true },
]

module.exports = [...postRedirects, ...tagRedirects, ...listRedirects]
