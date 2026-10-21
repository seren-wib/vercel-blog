'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { basicSetup } from 'codemirror'
import { EditorView, keymap } from '@codemirror/view'
import { Compartment, EditorState, Prec } from '@codemirror/state'
import { indentWithTab } from '@codemirror/commands'
import { defaultHighlightStyle, indentUnit, syntaxHighlighting } from '@codemirror/language'
import { setDiagnostics, type Diagnostic as LintDiagnostic } from '@codemirror/lint'
import { oneDarkHighlightStyle } from '@codemirror/theme-one-dark'
import { cpp } from '@codemirror/lang-cpp'
import { html } from '@codemirror/lang-html'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import type { Diagnostic } from './runners'

export type EditorLanguage = 'html' | 'javascript' | 'python' | 'c' | 'cpp'

const languageSupport = {
  html: () => html(),
  javascript: () => javascript(),
  python: () => python(),
  c: () => cpp(),
  cpp: () => cpp(),
}

/** Colors come from the page (Tailwind classes on the wrapper), so the editor follows the site theme. */
const baseTheme = EditorView.theme({
  '&': { height: '100%', fontSize: '13.5px', backgroundColor: 'transparent' },
  '&.cm-focused': { outline: 'none' },
  '.cm-scroller': {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    lineHeight: '1.6',
  },
  '.cm-gutters': {
    backgroundColor: 'transparent',
    borderRight: '1px solid var(--pg-line)',
    color: 'var(--pg-muted)',
  },
  '.cm-activeLine, .cm-activeLineGutter': { backgroundColor: 'var(--pg-active)' },
  '.cm-cursor': { borderLeftColor: 'currentColor' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': {
    backgroundColor: 'var(--pg-selection) !important',
  },
  '.cm-tooltip': {
    backgroundColor: 'var(--pg-panel)',
    border: '1px solid var(--pg-line)',
    color: 'inherit',
  },
})

type Props = {
  language: EditorLanguage
  value: string
  onChange: (value: string) => void
  onRun: () => void
  diagnostics: Diagnostic[]
  label: string
}

export default function CodeEditor({
  language,
  value,
  onChange,
  onRun,
  diagnostics,
  label,
}: Props) {
  const host = useRef<HTMLDivElement>(null)
  const view = useRef<EditorView | null>(null)
  const highlight = useRef(new Compartment())
  const callbacks = useRef({ onChange, onRun })
  callbacks.current = { onChange, onRun }
  const { resolvedTheme } = useTheme()

  // Create the editor once per language; later value changes from outside (Reset) are pushed in below
  useEffect(() => {
    if (!host.current) return
    const editor = new EditorView({
      parent: host.current,
      state: EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          Prec.highest(
            keymap.of([
              {
                key: 'Mod-Enter',
                run: () => {
                  callbacks.current.onRun()
                  return true
                },
              },
            ])
          ),
          keymap.of([indentWithTab]),
          indentUnit.of(
            language === 'python' || language === 'c' || language === 'cpp' ? '    ' : '  '
          ),
          languageSupport[language](),
          highlight.current.of(syntaxHighlighting(defaultHighlightStyle)),
          baseTheme,
          EditorView.contentAttributes.of({ 'aria-label': label }),
          EditorView.updateListener.of((u) => {
            if (u.docChanged) callbacks.current.onChange(u.state.doc.toString())
          }),
        ],
      }),
    })
    view.current = editor
    return () => {
      editor.destroy()
      view.current = null
    }
    // value is only the starting text; it must not recreate the editor on every keystroke
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, label])

  useEffect(() => {
    const editor = view.current
    if (editor && editor.state.doc.toString() !== value) {
      editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: value } })
    }
  }, [value])

  useEffect(() => {
    view.current?.dispatch({
      effects: highlight.current.reconfigure(
        syntaxHighlighting(resolvedTheme === 'dark' ? oneDarkHighlightStyle : defaultHighlightStyle)
      ),
    })
  }, [resolvedTheme, language])

  useEffect(() => {
    const editor = view.current
    if (!editor) return
    const doc = editor.state.doc
    const marks: LintDiagnostic[] = diagnostics
      .filter((d) => d.line >= 1 && d.line <= doc.lines)
      .map((d) => {
        const line = doc.line(d.line)
        const from = Math.min(line.from + Math.max(d.column - 1, 0), line.to)
        return { from, to: Math.max(from, line.to), severity: d.severity, message: d.message }
      })
    editor.dispatch(setDiagnostics(editor.state, marks))
  }, [diagnostics])

  return <div ref={host} className="h-full min-h-0 overflow-hidden" />
}
