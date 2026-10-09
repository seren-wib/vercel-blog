/**
 * Old flat post URLs (/blog/<slug>) from before posts were split into category folders.
 * Each maps to the post's current path under /blog/<category>/.
 */
const movedPosts = {
  '01unity': 'unity/01unity',
  'unity-err': 'unity/unity-err',
  '05-03딥러닝': 'ai/05-03딥러닝',
  '05-04CNN': 'ai/05-04CNN',
  '06-01LLM': 'ai/06-01LLM',
  '07-01AI-agent': 'ai/07-01AI-agent',
  '06sync': 'os/06sync',
  '07sync': 'os/07sync',
  '08sched': 'os/08sched',
  '09mem': 'os/09mem',
  '10virtual-mem1': 'os/10virtual-mem1',
  '11virtual-mem2': 'os/11virtual-mem2',
  '12virtual-mem3': 'os/12virtual-mem3',
  '13IO': 'os/13IO',
  '14storage': 'os/14storage',
  '15filesystem': 'os/15filesystem',
  'network-overview': 'network/ch1-2-network-overview',
  'ch3-data-transmission': 'network/ch3-data-transmission',
  'ch4-transmission-media': 'network/ch4-transmission-media',
  'ch4-appendix-antenna-propagation': 'network/ch4a-appendix-antenna-propagation',
  'ch5-encoding': 'network/ch5-encoding',
  'ch6 error correction': 'network/ch6-error-correction',
  'ch7-data-link': 'network/ch7-data-link',
  'ch8-multiplexing': 'network/ch8-multiplexing',
  'ch9-wan-1': 'network/ch9-wan-1',
}

const postRedirects = Object.entries(movedPosts).map(([from, to]) => ({
  source: `/blog/${encodeURIComponent(from)}`,
  destination: `/blog/${to.split('/').map(encodeURIComponent).join('/')}/`,
  permanent: true,
}))

/**
 * Tag pages were replaced by category pages. Every tag slug matches a category folder name.
 */
const tagRedirects = [
  { source: '/tags', destination: '/blog/', permanent: true },
  { source: '/tags/:tag', destination: '/blog/category/:tag/', permanent: true },
  {
    source: '/tags/:tag/page/:page',
    destination: '/blog/category/:tag/page/:page/',
    permanent: true,
  },
]

module.exports = [...postRedirects, ...tagRedirects]
