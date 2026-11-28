import { visit } from 'unist-util-visit'

/**
 * Posts link glossary terms as [Term](glossary:<slug>), without a locale.
 * This plugin turns them into /<locale>/glossary/#<slug> using the post's folder
 * (contentlayer puts it in vfile.data.rawDocumentData.flattenedPath, e.g. "blog/kr/dev/git/…").
 */
export function remarkGlossaryLinks() {
  return (tree, file) => {
    const flattenedPath: string = file.data?.rawDocumentData?.flattenedPath ?? ''
    const locale = flattenedPath.split('/')[1] === 'en' ? 'en' : 'kr'
    visit(tree, 'link', (node: { url: string }) => {
      if (!node.url.startsWith('glossary:')) return
      const slug = node.url.slice('glossary:'.length)
      node.url = slug ? `/${locale}/glossary/#${slug}` : `/${locale}/glossary/`
    })
  }
}
